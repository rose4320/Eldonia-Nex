"""Events API URLs"""
from django.urls import path

from .views import (
    EventCancelView,
    EventCompleteView,
    EventCreateView,
    EventDeleteView,
    EventDetailView,
    EventListView,
    EventPublishView,
    EventSuccessPredictionView,
    EventTicketCreateView,
    EventTicketDeleteView,
    EventTicketUpdateView,
    EventUpdateView,
    FinancialProjectionView,
    MyEventsView,
    VenueRecommendationView,
)

app_name = 'events_api'

urlpatterns = [
    # イベント関連
    path('', EventListView.as_view(), name='event-list'),
    path('create/', EventCreateView.as_view(), name='event-create'),
    path('my-events/', MyEventsView.as_view(), name='my-events'),
    path('<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('<int:pk>/update/', EventUpdateView.as_view(), name='event-update'),
    path('<int:pk>/delete/', EventDeleteView.as_view(), name='event-delete'),
    path('<int:pk>/publish/', EventPublishView.as_view(), name='event-publish'),
    path('<int:pk>/cancel/', EventCancelView.as_view(), name='event-cancel'),
    path('<int:event_id>/complete/', EventCompleteView.as_view(), name='event-complete'),
    
    # チケット関連
    path('<int:event_id>/tickets/create/', EventTicketCreateView.as_view(), name='ticket-create'),
    path('<int:event_id>/tickets/<int:pk>/update/', EventTicketUpdateView.as_view(), name='ticket-update'),
    path('<int:event_id>/tickets/<int:pk>/delete/', EventTicketDeleteView.as_view(), name='ticket-delete'),
    
    # 会場推薦、成功率予測、収支予測
    path('recommend-venues/', VenueRecommendationView.as_view(), name='recommend-venues'),
    path('predict-success/', EventSuccessPredictionView.as_view(), name='predict-success'),
    path('financial-projection/', FinancialProjectionView.as_view(), name='financial-projection'),
]
