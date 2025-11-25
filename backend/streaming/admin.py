from django.contrib import admin

from .models import LiveStream, StreamDonation


@admin.register(LiveStream)
class LiveStreamAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("title", "streamer", "status", "scheduled_start")


@admin.register(StreamDonation)
class StreamDonationAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("stream", "donor", "amount", "created_at")
