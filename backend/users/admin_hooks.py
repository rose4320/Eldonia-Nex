from django.contrib import admin
from django.urls import path, reverse
from django.urls.exceptions import NoReverseMatch

from users.operations.dashboard import get_dashboard_metrics
from users.operations.presence import get_live_user_presence
from users.operations.sync_status import (
    frontend_base_url,
    get_ops_health,
    get_plan_sync_status,
)
from users.operations.views import (
    announcement_broadcast_confirm_view,
    announcement_broadcast_view,
    dashboard_stats_view,
    exp_action_add_view,
    fee_setting_add_view,
    fee_settings_confirm_view,
    fee_settings_view,
    live_users_view,
    plan_details_confirm_view,
    plan_details_view,
    plan_sync_push_view,
    plan_sync_status_view,
    quest_settings_confirm_view,
    quest_settings_view,
    subscription_plan_add_view,
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

    admin.site.site_header = "ELDONIA NEX"
    admin.site.site_title = "ELDONIA NEX Ops"
    admin.site.index_title = "Nexus Operations Console"

    original_get_urls = admin.site.get_urls
    original_index = admin.site.index
    original_each_context = admin.site.each_context

    def each_context(request):
        ctx = original_each_context(request)
        ctx["frontend_url"] = frontend_base_url()
        return ctx

    def get_urls():
        custom = [
            path("operations/settings/", admin.site.admin_view(settings_hub_view), name="ops_settings_hub"),
            path("operations/subscription-plans/add/", admin.site.admin_view(subscription_plan_add_view), name="ops_subscription_plan_add"),
            path("operations/subscription-plans/", admin.site.admin_view(subscription_plans_view), name="ops_subscription_plans"),
            path("operations/subscription-plans/confirm/", admin.site.admin_view(subscription_plans_confirm_view), name="ops_subscription_plans_confirm"),
            path("operations/settings/fees/add/", admin.site.admin_view(fee_setting_add_view), name="ops_fee_setting_add"),
            path("operations/settings/fees/", admin.site.admin_view(fee_settings_view), name="ops_fee_settings"),
            path("operations/settings/fees/confirm/", admin.site.admin_view(fee_settings_confirm_view), name="ops_fee_settings_confirm"),
            path("operations/settings/plan-details/", admin.site.admin_view(plan_details_view), name="ops_plan_details"),
            path("operations/settings/plan-details/confirm/", admin.site.admin_view(plan_details_confirm_view), name="ops_plan_details_confirm"),
            path("operations/settings/exp/add/", admin.site.admin_view(exp_action_add_view), name="ops_exp_action_add"),
            path("operations/settings/exp/", admin.site.admin_view(quest_settings_view), name="ops_exp_settings"),
            path("operations/settings/exp/confirm/", admin.site.admin_view(quest_settings_confirm_view), name="ops_exp_settings_confirm"),
            path("operations/settings/quest/", admin.site.admin_view(quest_settings_view), name="ops_quest_settings"),
            path("operations/settings/quest/confirm/", admin.site.admin_view(quest_settings_confirm_view), name="ops_quest_settings_confirm"),
            path("operations/announcements/", admin.site.admin_view(announcement_broadcast_view), name="ops_announcement_broadcast"),
            path("operations/announcements/confirm/", admin.site.admin_view(announcement_broadcast_confirm_view), name="ops_announcement_confirm"),
            path("operations/dashboard-stats/", admin.site.admin_view(dashboard_stats_view), name="ops_dashboard_stats"),
            path("operations/plan-sync/status/", admin.site.admin_view(plan_sync_status_view), name="ops_plan_sync_status"),
            path("operations/plan-sync/push/", admin.site.admin_view(plan_sync_push_view), name="ops_plan_sync_push"),
            path("operations/live-users/", admin.site.admin_view(live_users_view), name="ops_live_users"),
        ]
        return custom + original_get_urls()

    def index(request, extra_context=None):
        extra_context = extra_context or {}
        extra_context["ops_dashboard"] = get_dashboard_metrics()
        extra_context["plan_sync"] = get_plan_sync_status()
        extra_context["ops_health"] = get_ops_health()
        extra_context["live_users"] = get_live_user_presence()
        extra_context["frontend_url"] = frontend_base_url()
        try:
            extra_context["ops_stats_url"] = reverse("admin:ops_dashboard_stats")
        except NoReverseMatch:
            extra_context["ops_stats_url"] = "/admin/operations/dashboard-stats/"
        try:
            extra_context["ops_live_users_url"] = reverse("admin:ops_live_users")
        except NoReverseMatch:
            extra_context["ops_live_users_url"] = "/admin/operations/live-users/"
        try:
            extra_context["ops_plan_sync_push_url"] = reverse("admin:ops_plan_sync_push")
        except NoReverseMatch:
            extra_context["ops_plan_sync_push_url"] = "/admin/operations/plan-sync/push/"
        return original_index(request, extra_context)

    admin.site.get_urls = get_urls  # type: ignore[method-assign]
    admin.site.index = index  # type: ignore[method-assign]
    admin.site.each_context = each_context  # type: ignore[method-assign]
