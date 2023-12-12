from django.urls import path

from .views import *

from rest_framework_simplejwt.views import (
  TokenObtainPairView,
  TokenRefreshView,
)

urlpatterns = [
  path("token", TokenObtainPairView.as_view(), name="token"),
  path("token/refresh", TokenRefreshView.as_view(), name="refresh"),
  path("register", Register.as_view(), name="register"),
  path("search", Search.as_view(), name="search"),
]