from django.contrib import messages
from django.contrib.admin.views.decorators import staff_member_required
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.urls import reverse
from django.views.decorators.http import require_http_methods

from .dashboard import get_dashboard_metrics
from .forms import (
    AdminPasswordConfirmForm,
    AnnouncementBroadcastForm,
    ExpActionAddForm,
    FeeSettingAddForm,
    FeeSettingsForm,
    SubscriptionPlanAddForm,
    PlanDetailsForm,
    QuestSettingsForm,
    SubscriptionPlanPricesForm,
)
from .announcement_service import (
    SupabaseAnnouncementError,
    preview_announcement,
    send_announcement,
)
from .services import (
    SESSION_KEY,
    apply_plan_prices,
    build_preview,
    get_current_plan_prices,
)
from .settings_constants import (
    FEE_SETTING_SLOTS,
    SESSION_KEY_ANNOUNCEMENT,
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
    ensure_quest_actions,
    get_current_fee_values,
    get_plan_details,
    get_quest_actions,
)
from users.models import OpsSetting, Plan
from users.operations.presence import get_live_user_presence
from users.operations.sync_status import (
    frontend_base_url,
    get_plan_sync_status,
    run_manual_plan_push,
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
def live_users_view(request: HttpRequest) -> JsonResponse:
    return JsonResponse(get_live_user_presence())


@staff_member_required
@require_http_methods(["GET"])
def plan_sync_status_view(request: HttpRequest) -> JsonResponse:
    return JsonResponse(get_plan_sync_status())


@staff_member_required
@require_http_methods(["POST"])
def plan_sync_push_view(request: HttpRequest) -> HttpResponse:
    outcome = run_manual_plan_push(reason="manual_admin")
    if outcome.get("ok"):
        messages.success(request, outcome["message"])
    else:
        messages.error(request, f"同期失敗: {outcome.get('message')}")
    next_url = request.POST.get("next") or reverse("admin:index")
    return redirect(next_url)


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
            "plan_sync": get_plan_sync_status(),
            "frontend_url": frontend_base_url(),
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
            "add_form": SubscriptionPlanAddForm(),
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
@require_http_methods(["POST"])
def subscription_plan_add_view(request: HttpRequest) -> HttpResponse:
    form = SubscriptionPlanAddForm(request.POST)
    if form.is_valid():
        Plan.objects.create(
            name=form.cleaned_data["name"].strip(),
            slug=form.cleaned_data["slug"],
            price=form.cleaned_data["price"],
            currency="JPY",
            billing_cycle="monthly",
            trial_days=form.cleaned_data["trial_days"],
            is_active=form.cleaned_data.get("is_active", False),
            sort_order=(Plan.objects.count() + 1) * 10,
        )
        from users.operations.plan_push import push_plans_after_admin_change

        sync_msg = push_plans_after_admin_change(reason="plan_add")
        if sync_msg:
            messages.success(
                request,
                f"プラン「{form.cleaned_data['name']}」を追加しました。{sync_msg}",
            )
        else:
            messages.success(request, f"プラン「{form.cleaned_data['name']}」を追加しました。")
    else:
        messages.error(request, "プランを追加できませんでした。入力内容を確認してください。")
        request.session["ops_plan_add_errors"] = form.errors
    return redirect("admin:ops_subscription_plans")


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
            "add_form": FeeSettingAddForm(),
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
@require_http_methods(["POST"])
def fee_setting_add_view(request: HttpRequest) -> HttpResponse:
    form = FeeSettingAddForm(request.POST)
    if form.is_valid():
        OpsSetting.objects.create(
            key=form.cleaned_data["key"],
            label=form.cleaned_data["label"].strip(),
            value=form.cleaned_data["value"].strip(),
            category="fees",
        )
        messages.success(request, f"手数料項目「{form.cleaned_data['label']}」を追加しました。")
    else:
        messages.error(request, "手数料項目を追加できませんでした。入力内容を確認してください。")
        request.session["ops_fee_add_errors"] = form.errors
    return redirect("admin:ops_fee_settings")


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
            "add_form": SubscriptionPlanAddForm(),
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
@require_http_methods(["POST"])
def exp_action_add_view(request: HttpRequest) -> HttpResponse:
    form = ExpActionAddForm(request.POST)
    if form.is_valid():
        try:
            from gamification.models import ExpAction
        except ImportError:
            messages.error(request, "Gamification アプリが利用できません。")
            return redirect("admin:ops_exp_settings")

        ExpAction.objects.create(
            action_type=form.cleaned_data["action_type"],
            description=form.cleaned_data["description"].strip(),
            base_exp=form.cleaned_data["base_exp"],
            max_daily_count=form.cleaned_data["max_daily_count"],
            is_active=form.cleaned_data.get("is_active", False),
        )
        messages.success(
            request,
            f"EXP付与アクション「{form.cleaned_data['description']}」を追加しました。",
        )
    else:
        messages.error(request, "EXP付与アクションを追加できませんでした。入力内容を確認してください。")
        request.session["ops_exp_add_errors"] = form.errors
    return redirect("admin:ops_exp_settings")


@staff_member_required
@require_http_methods(["GET", "POST"])
def quest_settings_view(request: HttpRequest) -> HttpResponse:
    ensure_quest_actions()
    current = get_quest_actions()
    if not current:
        return render(
            request,
            "admin/operations/quest_settings.html",
            {
                "form": None,
                "add_form": ExpActionAddForm(),
                "quest_actions": [],
                "title": "EXP付与設定",
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
                return redirect("admin:ops_exp_settings")
            request.session[SESSION_KEY_QUEST] = new_rows
            return redirect("admin:ops_exp_settings_confirm")
    else:
        form = QuestSettingsForm()

    return render(
        request,
        "admin/operations/quest_settings.html",
        {
            "form": form,
            "add_form": ExpActionAddForm(),
            "quest_actions": current,
            "title": "EXP付与設定",
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
        return redirect("admin:ops_exp_settings")

    current = get_quest_actions()
    return _render_confirm(
        request,
        template="admin/operations/quest_settings_confirm.html",
        session_key=SESSION_KEY_QUEST,
        back_url=reverse("admin:ops_exp_settings"),
        title="EXP付与設定 — 最終確認",
        active_tab="quest",
        preview=build_quest_preview(current, pending),
        on_apply=apply_quest_actions,
        success_message="EXP付与設定を更新しました",
        success_redirect=reverse("admin:ops_exp_settings"),
    )


@staff_member_required
@require_http_methods(["GET", "POST"])
def announcement_broadcast_view(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        form = AnnouncementBroadcastForm(request.POST)
        if form.is_valid():
            payload = {
                "target": form.cleaned_data["target"],
                "target_email": form.cleaned_data.get("target_email") or "",
                "title": form.cleaned_data["title"],
                "body": form.cleaned_data.get("body") or "",
                "href": form.cleaned_data.get("href") or "",
                "priority": (
                    "critical" if form.cleaned_data.get("is_critical") else "normal"
                ),
            }
            request.session[SESSION_KEY_ANNOUNCEMENT] = payload
            return redirect("admin:ops_announcement_confirm")
    else:
        form = AnnouncementBroadcastForm()

    return render(
        request,
        "admin/operations/announcement_broadcast.html",
        {
            "form": form,
            "title": "ユーザーへの告知送信",
            "step": 1,
            "active_tab": "announcement",
        },
    )


@staff_member_required
@require_http_methods(["GET", "POST"])
def announcement_broadcast_confirm_view(request: HttpRequest) -> HttpResponse:
    pending = request.session.get(SESSION_KEY_ANNOUNCEMENT)
    if not pending:
        messages.warning(request, "確認する告知がありません。最初から入力してください。")
        return redirect("admin:ops_announcement_broadcast")

    try:
        preview = preview_announcement(
            title=pending["title"],
            body=pending["body"],
            href=pending["href"] or None,
            target=pending["target"],
            email=pending["target_email"] or None,
            priority=pending.get("priority") or "normal",
        )
    except SupabaseAnnouncementError as exc:
        messages.error(request, str(exc))
        return redirect("admin:ops_announcement_broadcast")

    if request.method == "POST":
        form = AdminPasswordConfirmForm(request.POST)
        if form.is_valid():
            if not request.user.check_password(form.cleaned_data["admin_password"]):
                form.add_error("admin_password", "パスワードが正しくありません。")
            else:
                try:
                    count = send_announcement(
                        title=pending["title"],
                        body=pending["body"],
                        href=pending["href"] or None,
                        target=pending["target"],
                        email=pending["target_email"] or None,
                        priority=pending.get("priority") or "normal",
                    )
                except SupabaseAnnouncementError as exc:
                    messages.error(request, str(exc))
                    return redirect("admin:ops_announcement_broadcast")
                del request.session[SESSION_KEY_ANNOUNCEMENT]
                priority = pending.get("priority") or "normal"
                extra = "（最重要モーダル）" if priority == "critical" else ""
                messages.success(
                    request, f"告知を {count} 件のユーザーに送信しました{extra}。"
                )
                return redirect("admin:ops_announcement_broadcast")
    else:
        form = AdminPasswordConfirmForm()

    return render(
        request,
        "admin/operations/announcement_broadcast_confirm.html",
        {
            "form": form,
            "preview": preview,
            "title": "告知送信 — 最終確認",
            "step": 2,
            "active_tab": "announcement",
            "back_url": reverse("admin:ops_announcement_broadcast"),
        },
    )
