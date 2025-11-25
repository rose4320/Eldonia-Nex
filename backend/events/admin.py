from django.contrib import admin

from .models import Event, EventTicket


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("title", "organizer", "start_datetime", "end_datetime", "status")


@admin.register(EventTicket)
class EventTicketAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("event", "ticket_type", "price", "quantity")
