from rest_framework.views import APIView
from rest_framework.response import Response
from cityplanner import models
from rest_framework_simplejwt.authentication import JWTAuthentication
import openai
import os
from dotenv import load_dotenv
import logging
import json
import time
import requests
import re
from .utils import hourDiff

load_dotenv()
google_api_key = os.getenv("GOOGLE_API_KEY")
openai.api_key = os.getenv("OPENAI_API_KEY")
assistant_id = os.getenv("ASSISTANT_3.5")
assistant = openai.beta.assistants.retrieve(assistant_id)
seatgeek_client_id = os.getenv("SEATGEEK_CLIENT_ID")
ticketmaster_api_key = os.getenv("TICKETMASTER_API_KEY")

logger = logging.getLogger(__name__)


class Register(APIView):
    def post(self, request):
        try:
            user = models.User.objects.create_user(
                username=request.data["username"],
                password=request.data["password"],
            )
            user.save()
            return Response({"message": "User created"}, status=200)
        except Exception as e:
            return Response({"message": "User creation failed"}, status=400)


class Search(APIView):
    def get(self, request):
        return Response({"message": "Search"}, status=200)

    def post(self, request):
        query = request.data["query"]
        locationBias = request.data["locationBias"]
        location = request.data["location"]
        logger.info(query)
        logger.info(locationBias)
        city = location.split(",")[0]
        state = location.split(",")[1]
        state = state.strip()
        url = "https://places.googleapis.com/v1/places:searchText"

        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": google_api_key,
            "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.websiteUri,places.types,places.location,places.rating",
        }
        params = {
            "textQuery": query,
            "maxResultCount": "5",
        }
        if locationBias != {}:
            params = {
                "textQuery": query,
                "maxResultCount": "5",
                "locationBias": {
                    "circle": {
                        "center": locationBias,
                        "radius": 1000,
                    }
                },
            }
        # if priceLevels != []:
        #     logger.info(f"SERVER: Price Levels is: {priceLevels}")
        #     params["priceLevels"] = priceLevels

        res = requests.post(url, json=params, headers=headers)
        data = res.json()
        logger.debug(data)
        event_venue = 0
        # if all 5 results are event venues, we search the seatgeek + ticketmaster api for local events
        for place in data["places"]:
            if "event_venue" in place["types"]:
                event_venue += 1
        if event_venue == 5:
            goog_res = data
            url = "https://api.seatgeek.com/2/events"
            params = {
                "client_id": seatgeek_client_id,
                "q": location,
                "per_page": 5,
            }
            res = requests.get(url, params=params)
            resjson = res.json()
            # get hour difference between now and event
            for event in resjson["events"]:
                event["hourDiff"] = hourDiff.hourDiff(event["datetime_utc"], "seatgeek")
                event["apiType"] = "seatgeek"
            data = resjson["events"]
            url = f"https://app.ticketmaster.com/discovery/v2/events.json?apikey={ticketmaster_api_key}&city={city}&state={state}&size=5&sort=date,asc"
            logger.info(url)
            res = requests.get(url)
            resjson = res.json()
            for event in resjson["_embedded"]["events"]:
                event["hourDiff"] = hourDiff.hourDiff(
                    event["dates"]["start"]["dateTime"], "ticketmaster"
                )
                event["apiType"] = "ticketmaster"
            for event in resjson["_embedded"]["events"]:
                if event["hourDiff"] > 0:
                    data.append(event)

            logger.debug(data)
            data = sorted(data, key=lambda event: event["hourDiff"])
            return Response({"events": data, "searchResults": goog_res}, status=200)

        # If user is making their first selection we dont need a locationBias
        if not locationBias:
            return Response({"searchResults": data}, status=200)
        # Otherwise we use the previous location as a locationBias
        for place in data["places"]:
            distance = requests.post(
                f"https://maps.googleapis.com/maps/api/directions/json?origin={locationBias['latitude']},{locationBias['longitude']}&destination={place['location']['latitude']},{place['location']['longitude']}&key={google_api_key}"
            )
            distance_text = distance.json()["routes"][0]["legs"][0]["duration"]["text"]
            distance_value = re.sub(r"\D", "", distance_text)
            place["distance"] = distance_value + " minutes drive"
            # show walking distance if less than 5 minutes drive
            if int(distance_value) < 3:
                distance = requests.post(
                    f"https://maps.googleapis.com/maps/api/directions/json?origin={locationBias['latitude']},{locationBias['longitude']}&destination={place['location']['latitude']},{place['location']['longitude']}&mode=walking&key={google_api_key}"
                )
                distance_text = distance.json()["routes"][0]["legs"][0]["duration"][
                    "text"
                ]
                place["distance"] = distance_value + " minutes walk"

        return Response({"searchResults": data}, status=200)


class Conversation(APIView):
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        user = request.user
        if request.data["thread"] == "new":
            thread = openai.beta.threads.create(
                messages=[
                    {
                        "role": "user",
                        "content": request.data["input"],
                    }
                ]
            )
            run = openai.beta.threads.runs.create(
                thread_id=thread.id,
                assistant_id=assistant.id,
            )
        else:
            thread = openai.beta.threads.retrieve(request.data["thread"])
            run = openai.beta.threads.runs.list(
                thread_id=thread.id,
                order="desc",
            )
            run = openai.beta.threads.runs.retrieve(
                thread_id=thread.id,
                run_id=run.data[0].id,
            )
            if run.status == "requires_action":
                run = openai.beta.threads.runs.submit_tool_outputs(
                    thread_id=thread.id,
                    run_id=run.id,
                    tool_outputs=[
                        {
                            "tool_call_id": run.required_action.submit_tool_outputs.tool_calls[
                                0
                            ].id,
                            "output": json.dumps(request.data["selections"]),
                        }
                    ],
                )
            else:
                openai.beta.threads.messages.create(
                    thread.id,
                    role="user",
                    content=request.data["input"],
                )
                run = openai.beta.threads.runs.create(
                    thread_id=thread.id,
                    assistant_id=assistant.id,
                )

        while run.status == "in_progress" or run.status == "queued":
            time.sleep(1)
            run = openai.beta.threads.runs.retrieve(
                thread_id=thread.id,
                run_id=run.id,
            )

        # api returned the initial itinerary, send list to frontend for selections
        if run.status == "requires_action":
            function_arguments = json.loads(
                run.required_action.submit_tool_outputs.tool_calls[0].function.arguments
            )
            logger.info(function_arguments)

            itinerary = []
            i = 0
            for location_type in function_arguments["locationTypes"].split(","):
                itinerary.append(location_type)
                i += 1
            return Response(
                {
                    "location": function_arguments["location"],
                    "itinerary": itinerary,
                    "thread": thread.id,
                },
                status=200,
            )

        while run.status == "in_progress" or run.status == "queued":
            time.sleep(1)
            run = openai.beta.threads.runs.retrieve(
                thread_id=thread.id,
                run_id=run.id,
            )

        messages = openai.beta.threads.messages.list(
            thread_id=thread.id,
        )

        thread = models.Thread.objects.create(
            user=user,
            message=messages,
            thread_id=thread.id,
        )
        thread.save()

        return Response({"message": messages}, status=200)
