"""Celery tasks for localization app."""
from celery import shared_task

from .services import update_all_exchange_rates


@shared_task
def update_exchange_rates_task():
    """Update exchange rates from external API."""
    stats = update_all_exchange_rates()
    return {
        'status': 'success' if stats['total_updated'] > 0 else 'failed',
        'stats': stats,
    }
