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
            "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.websiteUri,places.types,places.location,places.rating,places.photos,places.editorial_summary",
        }
        params = {
            "textQuery": query,
            "maxResultCount": "20",
        }
        if locationBias != {}:
            params = {
                "textQuery": query,
                "maxResultCount": "20",
                "locationBias": {
                    "circle": {
                        "center": locationBias,
                        "radius": 1000,
                    }
                },
            }
        if "live" in query.lower():
            params["maxResultCount"] = "5"

        res = requests.post(url, json=params, headers=headers)
        data = res.json()
        # logger.info(data)

        # Get photos for each place
        for place in data["places"]:
            if "photos" in place:
                photo = place["photos"][0]["name"]
                place["photo"] = (
                    f"https://places.googleapis.com/v1/{photo}/media?maxHeightPx=400&maxWidthPx=400&key={google_api_key}"
                )

        # if searching for event venues, we search the seatgeek + ticketmaster api for local events
        if "live" in query.lower():
            goog_res = data
            url = "https://api.seatgeek.com/2/events"
            params = {
                "client_id": seatgeek_client_id,
                "q": location,
                "per_page": 5,
            }
            res = requests.get(url, params=params)
            resjson = res.json()
            # get hour difference between now and event for seatgeek
            data = []
            for event in resjson["events"]:
                event["hourDiff"] = hourDiff.hourDiff(event["datetime_utc"], "seatgeek")
                event["apiType"] = "seatgeek"
            for event in resjson["events"]:
                if event["hourDiff"] > 0:
                    data.append(event)

            # get data and hour difference for ticketmaster
            url = f"https://app.ticketmaster.com/discovery/v2/events.json?apikey={ticketmaster_api_key}&city={city}&state={state}&size=5&sort=date,asc"
            # logger.info(url)
            res = requests.get(url)
            resjson = res.json()
            if "_embedded" in resjson:
                for event in resjson["_embedded"]["events"]:
                    event["hourDiff"] = hourDiff.hourDiff(
                        event["dates"]["start"]["dateTime"], "ticketmaster"
                    )
                    event["apiType"] = "ticketmaster"
                for event in resjson["_embedded"]["events"]:
                    if event["hourDiff"] > 0:
                        data.append(event)

            # logger.debug(data)
            # sort most recent events first and return retults
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
                logger.info(run.required_action.submit_tool_outputs.tool_calls)
                response = {
                    "order": request.data["newOrder"],
                    "selections": request.data["selections"],
                }
                run = openai.beta.threads.runs.submit_tool_outputs(
                    thread_id=thread.id,
                    run_id=run.id,
                    tool_outputs=[
                        {
                            "tool_call_id": run.required_action.submit_tool_outputs.tool_calls[
                                0
                            ].id,
                            "output": json.dumps(response),
                        }
                    ],
                )
                # Update any changes to the itinerary, and user selections to the DB
                itinerary_db = models.Itinerary.objects.get(thread_id=thread.id)
                if request.data["newOrder"]:
                    itinerary_db.itinerary = request.data["newOrder"]
                itinerary_db.selections = request.data["selections"]
                itinerary_db.save()

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
            # Initialize to database
            itinerary_db = models.Itinerary.objects.create(
                user=user,
                thread_id=thread.id,
                location=function_arguments["location"],
                itinerary=itinerary,
            )
            itinerary_db.save()
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

        # Update message to the database
        itinerary_db = models.Itinerary.objects.get(thread_id=thread.id)
        logger.info(messages.data[0].content[0].text.value)
        itinerary_db.message = messages.data[0].content[0].text.value
        itinerary_db.save()

        return Response({"message": messages}, status=200)


class Profile(APIView):
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        if request.data["action"] == "history":
            user = request.user
            itineraries = models.Itinerary.objects.filter(user=user)
            data = []
            for itinerary in itineraries:
                if itinerary.selections:
                    data.append(
                        {
                            "location": itinerary.location,
                            "itinerary": itinerary.itinerary,
                            "selections": itinerary.selections,
                            "message": itinerary.message,
                            "date": itinerary.created_at,
                        }
                    )
            data.sort(key=lambda x: x["date"], reverse=True)
            return Response({"itineraries": data}, status=200)
