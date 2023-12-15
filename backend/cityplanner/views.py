from rest_framework.views import APIView
from rest_framework.response import Response
from cityplanner import models
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.renderers import JSONRenderer
import openai
import os
from dotenv import load_dotenv
import logging
import json
import time
import requests

load_dotenv()
google_api_key = os.getenv("GOOGLE_API_KEY")
openai.api_key = os.getenv("OPENAI_API_KEY")
assistant_id = os.getenv("ASSISTANT_3.5")
assistant = openai.beta.assistants.retrieve(assistant_id)

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
        except:
            return Response({"message": "User creation failed"}, status=400)


class Search(APIView):
    def get(self, request):
        return Response({"message": "Search"}, status=200)

    def post(self, request):
        query = request.data["query"]
        locationBias = request.data["locationBias"]
        logger.info(query)
        logger.info(locationBias)
        url = "https://places.googleapis.com/v1/places:searchText"

        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": google_api_key,
            "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.websiteUri,places.types,places.location",
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
                        "radius": 750,
                    }
                },
            }
        res = requests.post(url, json=params, headers=headers)
        return Response({"searchResults": res.json()}, status=200)


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

        while run.status == "in_progress" or run.status == "queued":
            time.sleep(1)
            run = openai.beta.threads.runs.retrieve(
                thread_id=thread.id,
                run_id=run.id,
            )
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
