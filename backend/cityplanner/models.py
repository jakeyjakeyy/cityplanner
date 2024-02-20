from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)


class Itinerary(models.Model):
    class Meta:
        verbose_name_plural = "Itineraries"  # Plural name for admin panel because "Itinerarys" drove me mad

    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    thread_id = models.TextField()
    location = models.TextField()
    itinerary = models.JSONField()
    selections = models.JSONField(null=True, blank=True)
    message = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    hidden = models.BooleanField(default=False)  # for soft delete
