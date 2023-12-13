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

load_dotenv()
google_api_key = os.getenv("GOOGLE_API_KEY")
openai.api_key = os.getenv("OPENAI_API_KEY")

logger = logging.getLogger(__name__)

assistant = openai.beta.assistants.create(
    name="City Trip Planner",
    instructions="Users will give you information about their ideal night and city. Recommend locations to visit based on information given.",
    # model="gpt-4-1106-preview",
    model="gpt-3.5-turbo",
    tools=[
        {
            "type": "function",
            "function": {
                "name": "get_info",
                "description": "Determine city and location requests from the string. Add any additional keywords relating to searching locations on google maps.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state e.g. San Francisco, CA",
                        },
                        "request": {
                            "type": "string",
                            "description": "The core of the request. Could be attractions, food, events, and more.",
                        },
                        "extra": {
                            "type": "string",
                            "description": "Any additional keywords to specify location interests.",
                        },
                    },
                    "required": ["location", "request"],
                },
            },
        }
    ],
)

output_data = {
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


class Conversation(APIView):
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        user = request.user
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

        while run.status == "in_progress" or run.status == "queued":
            run = openai.beta.threads.runs.retrieve(
                thread_id=thread.id,
                run_id=run.id,
            )
        logger.info(run)
        if run.status == "requires_action":
            logger.info(run.required_action.submit_tool_outputs.tool_calls[0].id)
            run = openai.beta.threads.runs.submit_tool_outputs(
                thread_id=thread.id,
                run_id=run.id,
                tool_outputs=[
                    {
                        "tool_call_id": run.required_action.submit_tool_outputs.tool_calls[
                            0
                        ].id,
                        "output": json.dumps(output_data),
                    }
                ],
            )

        while run.status == "in_progress" or run.status == "queued":
            run = openai.beta.threads.runs.retrieve(
                thread_id=thread.id,
                run_id=run.id,
            )

        messages = openai.beta.threads.messages.list(
            thread_id=thread.id,
        )

        return Response({"message": messages}, status=200)
