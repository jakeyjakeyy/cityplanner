from rest_framework.views import APIView
from rest_framework.response import Response
from cityplanner import models
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.renderers import JSONRenderer
import openai
import os
from dotenv import load_dotenv

load_dotenv()
google_api_key = os.getenv("GOOGLE_API_KEY")
openai.api_key = os.getenv("OPENAI_API_KEY")

assistant = openai.beta.assistants.create(
    name="City Trip Planner",
    instructions="Users will give you information about their ideal night and city. Recommend locations to visit based on information given.",
    model="gpt-4-1106-preview",
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
        return Response({"message": "Conversation", "user": user}, status=200)
