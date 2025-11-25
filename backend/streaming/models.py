from django.conf import settings
from django.db import models


class LiveStream(models.Model):
    streamer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="live_streams"
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    stream_key = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=20, default="scheduled")
    scheduled_start = models.DateTimeField(null=True, blank=True)
    actual_start = models.DateTimeField(null=True, blank=True)
    actual_end = models.DateTimeField(null=True, blank=True)
    max_viewers = models.IntegerField(default=0)
    total_donations = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    is_archived = models.BooleanField(default=False)
    archive_url = models.URLField(max_length=1000, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "live_streams"


class StreamDonation(models.Model):
    stream = models.ForeignKey(
        LiveStream, on_delete=models.CASCADE, related_name="donations"
    )
    donor = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    message = models.TextField(blank=True)
    is_anonymous = models.BooleanField(default=False)
    payment_status = models.CharField(max_length=20, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "stream_donations"


"""Streaming models module.

Defined models above. Removed trailing template lines.
"""
