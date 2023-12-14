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

logger = logging.getLogger(__name__)

assistant = openai.beta.assistants.create(
    name="City Trip Planner",
    instructions="Users will give you information such as a city and general idea of their ideal night. Interpret their input and create a itinerary to visit different locations across their chosen city based on their interests.",
    # model="gpt-4-1106-preview",
    model="gpt-3.5-turbo",
    tools=[
        {
            "type": "function",
            "function": {
                "name": "create_itinerary",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state e.g. San Francisco, CA",
                        },
                        "locationTypes": {
                            "type": "string",
                            "description": "condense user requests into an ordered itinerary of each type, take liberties to add or adjust the list to make sure the list has at least 2 stops and create the perfect time out. Separate each stop with a , e.g. 'restaurant', 'amusement park', 'bar'",
                        },
                    },
                    "required": ["location", "locationTypes"],
                },
                "description": "Take user input and return one or more types of locations for the user to visit on their trip.",
            },
        }
    ],
)


output_data_static = {
    "places": [
        {
            "formattedAddress": "367 Pitt St, Sydney NSW 2000, Australia",
            "websiteUri": "http://www.motherchusvegetarian.com.au/",
            "displayName": {
                "text": "Mother Chu's Vegetarian Kitchen",
                "languageCode": "en",
            },
        },
        {
            "formattedAddress": "175 First Ave, Five Dock NSW 2046, Australia",
            "websiteUri": "http://www.veggosizzle.com.au/",
            "displayName": {
                "text": "Veggo Sizzle - Vegan & Vegetarian Restaurant, Five Dock, Sydney",
                "languageCode": "en",
            },
        },
    ]
}


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
        logger.info(query)
        url = "https://places.googleapis.com/v1/places:searchText"

        headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": google_api_key,
            "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.websiteUri,places.types",
        }
        params = {
            "textQuery": query,
            "maxResultCount": "5",
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
            run = openai.beta.threads.runs.create(
                thread_id=request.data["thread"],
                assistant_id=assistant.id,
                input=request.data["input"],
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

            run = openai.beta.threads.runs.submit_tool_outputs(
                thread_id=thread.id,
                run_id=run.id,
                tool_outputs=[
                    {
                        "tool_call_id": run.required_action.submit_tool_outputs.tool_calls[
                            0
                        ].id,
                        "output": json.dumps(searchResults),
                    }
                ],
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
