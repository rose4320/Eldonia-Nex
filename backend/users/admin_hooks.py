from django.contrib import admin
from django.urls import path, reverse
from django.urls.exceptions import NoReverseMatch

from users.operations.dashboard import get_dashboard_metrics
from users.operations.views import (
    dashboard_stats_view,
    fee_settings_confirm_view,
    fee_settings_view,
    plan_details_confirm_view,
    plan_details_view,
    quest_settings_confirm_view,
    quest_settings_view,
    settings_hub_view,
    subscription_plans_confirm_view,
    subscription_plans_view,
)

_registered = False


def register_operations_admin_urls() -> None:
    """Django Admin に運用向けカスタム画面を追加"""
    global _registered
    if _registered:
        return
    _registered = True

    admin.site.site_header = "Eldonia-Nex 運用パネル"
    admin.site.site_title = "Eldonia 運用"
    admin.site.index_title = "Nexus Operations Console"

    original_get_urls = admin.site.get_urls
    original_index = admin.site.index

    def get_urls():
        custom = [
            path("operations/settings/", admin.site.admin_view(settings_hub_view), name="ops_settings_hub"),
            path("operations/subscription-plans/", admin.site.admin_view(subscription_plans_view), name="ops_subscription_plans"),
            path("operations/subscription-plans/confirm/", admin.site.admin_view(subscription_plans_confirm_view), name="ops_subscription_plans_confirm"),
            path("operations/settings/fees/", admin.site.admin_view(fee_settings_view), name="ops_fee_settings"),
            path("operations/settings/fees/confirm/", admin.site.admin_view(fee_settings_confirm_view), name="ops_fee_settings_confirm"),
            path("operations/settings/plan-details/", admin.site.admin_view(plan_details_view), name="ops_plan_details"),
            path("operations/settings/plan-details/confirm/", admin.site.admin_view(plan_details_confirm_view), name="ops_plan_details_confirm"),
            path("operations/settings/quest/", admin.site.admin_view(quest_settings_view), name="ops_quest_settings"),
            path("operations/settings/quest/confirm/", admin.site.admin_view(quest_settings_confirm_view), name="ops_quest_settings_confirm"),
            path("operations/dashboard-stats/", admin.site.admin_view(dashboard_stats_view), name="ops_dashboard_stats"),
        ]
        return custom + original_get_urls()

    def index(request, extra_context=None):
        extra_context = extra_context or {}
        extra_context["ops_dashboard"] = get_dashboard_metrics()
        try:
            extra_context["ops_stats_url"] = reverse("admin:ops_dashboard_stats")
        except NoReverseMatch:
            extra_context["ops_stats_url"] = "/admin/operations/dashboard-stats/"
        return original_index(request, extra_context)

    admin.site.get_urls = get_urls  # type: ignore[method-assign]
    admin.site.index = index  # type: ignore[method-assign]
