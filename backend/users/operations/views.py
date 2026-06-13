from django.contrib import messages
from django.contrib.admin.views.decorators import staff_member_required
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.urls import reverse
from django.views.decorators.http import require_http_methods

from .dashboard import get_dashboard_metrics
from .forms import (
    AdminPasswordConfirmForm,
    FeeSettingsForm,
    PlanDetailsForm,
    QuestSettingsForm,
    SubscriptionPlanPricesForm,
)
from .services import (
    SESSION_KEY,
    apply_plan_prices,
    build_preview,
    get_current_plan_prices,
)
from .settings_constants import (
    FEE_SETTING_SLOTS,
    SESSION_KEY_FEES,
    SESSION_KEY_PLAN_DETAILS,
    SESSION_KEY_QUEST,
)
from .settings_service import (
    apply_fee_values,
    apply_plan_details,
    apply_quest_actions,
    build_fee_preview,
    build_plan_details_preview,
    build_quest_preview,
    get_current_fee_values,
    get_plan_details,
    get_quest_actions,
)


def _serialize_dashboard(metrics: dict) -> dict:
    data = dict(metrics)
    updated = data.pop("updated_at")
    data["updated_at"] = updated.strftime("%Y-%m-%d %H:%M:%S")
    sales = dict(data.get("sales", {}))
    for key in ("gmv_today_raw", "gmv_month_raw", "gmv_prev_month_raw"):
        sales.pop(key, None)
    data["sales"] = sales
    return data


def _render_confirm(
    request: HttpRequest,
    *,
    template: str,
    session_key: str,
    back_url: str,
    title: str,
    active_tab: str,
    preview: list,
    on_apply,
    success_message: str,
    success_redirect: str,
) -> HttpResponse:
    pending = request.session.get(session_key)
    if not pending:
        messages.warning(request, "確認する変更がありません。最初から入力してください。")
        return redirect(back_url)

    if request.method == "POST":
        form = AdminPasswordConfirmForm(request.POST)
        if form.is_valid():
            if not request.user.check_password(form.cleaned_data["admin_password"]):
                form.add_error("admin_password", "パスワードが正しくありません。")
            else:
                try:
                    labels = on_apply(pending)
                except ValueError as exc:
                    messages.error(request, str(exc))
                    return redirect(back_url)
                del request.session[session_key]
                messages.success(request, f"{success_message}: " + " / ".join(labels))
                return redirect(success_redirect)
    else:
        form = AdminPasswordConfirmForm()

    return render(
        request,
        template,
        {
            "form": form,
            "preview": preview,
            "title": title,
            "step": 2,
            "active_tab": active_tab,
            "back_url": back_url,
        },
    )


@staff_member_required
@require_http_methods(["GET"])
def dashboard_stats_view(request: HttpRequest) -> JsonResponse:
    return JsonResponse(_serialize_dashboard(get_dashboard_metrics()))


@staff_member_required
@require_http_methods(["GET"])
def settings_hub_view(request: HttpRequest) -> HttpResponse:
    return render(
        request,
        "admin/operations/settings_hub.html",
        {
            "title": "設定一覧",
            "active_tab": "hub",
            "plan_prices": get_current_plan_prices(),
            "fee_values": get_current_fee_values(),
            "plan_details": get_plan_details(),
            "quest_actions": get_quest_actions(),
        },
    )


@staff_member_required
@require_http_methods(["GET", "POST"])
def subscription_plans_view(request: HttpRequest) -> HttpResponse:
    current = get_current_plan_prices()

    if request.method == "POST":
        form = SubscriptionPlanPricesForm(request.POST)
        if form.is_valid():
            new_prices = form.cleaned_prices()
            if new_prices == current:
                messages.info(request, "変更はありません。")
                return redirect("admin:ops_subscription_plans")
            request.session[SESSION_KEY] = new_prices
            return redirect("admin:ops_subscription_plans_confirm")
    else:
        form = SubscriptionPlanPricesForm()

    return render(
        request,
        "admin/operations/subscription_plans.html",
        {
            "form": form,
            "current": current,
            "title": "サブスク料金の設定",
            "step": 1,
            "active_tab": "plans",
        },
    )


@staff_member_required
@require_http_methods(["GET", "POST"])
def subscription_plans_confirm_view(request: HttpRequest) -> HttpResponse:
    pending = request.session.get(SESSION_KEY)
    if not pending:
        messages.warning(request, "確認する変更がありません。最初から入力してください。")
        return redirect("admin:ops_subscription_plans")

    current = get_current_plan_prices()
    return _render_confirm(
        request,
        template="admin/operations/subscription_plans_confirm.html",
        session_key=SESSION_KEY,
        back_url=reverse("admin:ops_subscription_plans"),
        title="サブスク料金 — 最終確認",
        active_tab="plans",
        preview=build_preview(current, pending),
        on_apply=apply_plan_prices,
        success_message="サブスク料金を更新しました",
        success_redirect=reverse("admin:ops_subscription_plans"),
    )


@staff_member_required
@require_http_methods(["GET", "POST"])
def fee_settings_view(request: HttpRequest) -> HttpResponse:
    current = get_current_fee_values()

    if request.method == "POST":
        form = FeeSettingsForm(request.POST)
        if form.is_valid():
            new_values = form.cleaned_values()
            if new_values == current:
                messages.info(request, "変更はありません。")
                return redirect("admin:ops_fee_settings")
            request.session[SESSION_KEY_FEES] = new_values
            return redirect("admin:ops_fee_settings_confirm")
    else:
        form = FeeSettingsForm()

    return render(
        request,
        "admin/operations/fee_settings.html",
        {
            "form": form,
            "title": "手数料・還元率の設定",
            "step": 1,
            "active_tab": "fees",
            "fee_slots": FEE_SETTING_SLOTS,
        },
    )


@staff_member_required
@require_http_methods(["GET", "POST"])
def fee_settings_confirm_view(request: HttpRequest) -> HttpResponse:
    pending = request.session.get(SESSION_KEY_FEES)
    if not pending:
        messages.warning(request, "確認する変更がありません。最初から入力してください。")
        return redirect("admin:ops_fee_settings")

    current = get_current_fee_values()
    return _render_confirm(
        request,
        template="admin/operations/fee_settings_confirm.html",
        session_key=SESSION_KEY_FEES,
        back_url=reverse("admin:ops_fee_settings"),
        title="手数料・還元率 — 最終確認",
        active_tab="fees",
        preview=build_fee_preview(current, pending),
        on_apply=apply_fee_values,
        success_message="手数料・還元率を更新しました",
        success_redirect=reverse("admin:ops_fee_settings"),
    )


@staff_member_required
@require_http_methods(["GET", "POST"])
def plan_details_view(request: HttpRequest) -> HttpResponse:
    current = get_plan_details()

    if request.method == "POST":
        form = PlanDetailsForm(request.POST)
        if form.is_valid():
            new_values = form.cleaned_details()
            unchanged = all(
                current[slug]["trial_days"] == new_values[slug]["trial_days"]
                and current[slug]["is_active"] == new_values[slug]["is_active"]
                for slug in current
            )
            if unchanged:
                messages.info(request, "変更はありません。")
                return redirect("admin:ops_plan_details")
            request.session[SESSION_KEY_PLAN_DETAILS] = new_values
            return redirect("admin:ops_plan_details_confirm")
    else:
        form = PlanDetailsForm()

    return render(
        request,
        "admin/operations/plan_details.html",
        {
            "form": form,
            "plan_details": current,
            "title": "プラン詳細の設定",
            "step": 1,
            "active_tab": "plan_details",
        },
    )


@staff_member_required
@require_http_methods(["GET", "POST"])
def plan_details_confirm_view(request: HttpRequest) -> HttpResponse:
    pending = request.session.get(SESSION_KEY_PLAN_DETAILS)
    if not pending:
        messages.warning(request, "確認する変更がありません。最初から入力してください。")
        return redirect("admin:ops_plan_details")

    current = get_plan_details()
    return _render_confirm(
        request,
        template="admin/operations/plan_details_confirm.html",
        session_key=SESSION_KEY_PLAN_DETAILS,
        back_url=reverse("admin:ops_plan_details"),
        title="プラン詳細 — 最終確認",
        active_tab="plan_details",
        preview=build_plan_details_preview(current, pending),
        on_apply=apply_plan_details,
        success_message="プラン詳細を更新しました",
        success_redirect=reverse("admin:ops_plan_details"),
    )


@staff_member_required
@require_http_methods(["GET", "POST"])
def quest_settings_view(request: HttpRequest) -> HttpResponse:
    current = get_quest_actions()
    if not current:
        return render(
            request,
            "admin/operations/quest_settings.html",
            {
                "form": None,
                "quest_actions": [],
                "title": "Quest 設定",
                "step": 1,
                "active_tab": "quest",
                "empty": True,
            },
        )

    if request.method == "POST":
        form = QuestSettingsForm(request.POST)
        if form.is_valid():
            new_rows = form.cleaned_rows()
            if new_rows == current:
                messages.info(request, "変更はありません。")
                return redirect("admin:ops_quest_settings")
            request.session[SESSION_KEY_QUEST] = new_rows
            return redirect("admin:ops_quest_settings_confirm")
    else:
        form = QuestSettingsForm()

    return render(
        request,
        "admin/operations/quest_settings.html",
        {
            "form": form,
            "quest_actions": current,
            "title": "Quest 設定",
            "step": 1,
            "active_tab": "quest",
            "empty": False,
        },
    )


@staff_member_required
@require_http_methods(["GET", "POST"])
def quest_settings_confirm_view(request: HttpRequest) -> HttpResponse:
    pending = request.session.get(SESSION_KEY_QUEST)
    if not pending:
        messages.warning(request, "確認する変更がありません。最初から入力してください。")
        return redirect("admin:ops_quest_settings")

    current = get_quest_actions()
    return _render_confirm(
        request,
        template="admin/operations/quest_settings_confirm.html",
        session_key=SESSION_KEY_QUEST,
        back_url=reverse("admin:ops_quest_settings"),
        title="Quest 設定 — 最終確認",
        active_tab="quest",
        preview=build_quest_preview(current, pending),
        on_apply=apply_quest_actions,
        success_message="Quest 設定を更新しました",
        success_redirect=reverse("admin:ops_quest_settings"),
    )
