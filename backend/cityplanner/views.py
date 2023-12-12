from rest_framework.views import APIView
from rest_framework.response import Response
from cityplanner import models
from rest_framework_simplejwt.authentication import JWTAuthentication

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