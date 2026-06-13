from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import Plan, User, UserProfile


def _plan_choices() -> list[tuple[str, str]]:
    choices: list[tuple[str, str]] = []
    for plan in Plan.objects.filter(is_active=True).order_by("sort_order", "price"):
        choices.append((plan.slug, f"{plan.name} = （{int(plan.price)}）円 / 月"))
    if not choices:
        choices = [
            ("free", "Free = （0）円 / 月"),
            ("standard", "Standard = （800）円 / 月"),
            ("pro", "Pro = （1500）円 / 月"),
        ]
    return choices


@admin.register(User)
class UserAdmin(DjangoUserAdmin):  # type: ignore
    model = User
    exclude = ("subscription", "subscription_type")
    _fieldsets = list(DjangoUserAdmin.fieldsets)
    _fieldsets.append(
        (
            "プロフィール",
            {
                "fields": (
                    "display_name",
                    "bio",
                    "avatar_url",
                    "subscription_plan",
                    "total_exp",
                    "current_level",
                )
            },
        )
    )
    fieldsets = tuple(_fieldsets)
    list_display = [
        "external_id",
        "username",
        "email",
        "display_name",
        "subscription_plan_label",
        "is_active",
        "account_status",
        "referred_by_user",
        "referred_users_count",
    ]
    list_filter = ("subscription_plan", "is_active", "account_status")
    readonly_fields = ("external_id",)

    def subscription_plan_label(self, obj: User) -> str:
        plan = Plan.objects.filter(slug=obj.subscription_plan).first()
        if plan:
            return f"{plan.name}（{int(plan.price)}円）"
        return obj.subscription_plan or "free"

    subscription_plan_label.short_description = "サブスクプラン"
    subscription_plan_label.admin_order_field = "subscription_plan"

    def formfield_for_dbfield(self, db_field, request, **kwargs):
        if db_field.name == "subscription_plan":
            kwargs["widget"] = forms.Select(choices=_plan_choices())
        return super().formfield_for_dbfield(db_field, request, **kwargs)

    def referred_users_count(self, obj):
        return obj.referred_users.count()

    referred_users_count.short_description = "紹介した人数"


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("user", "timezone")
    readonly_fields = ("created_at", "updated_at")


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("name", "slug", "price", "currency", "billing_cycle", "is_active")
    list_filter = ("billing_cycle", "is_active")
    search_fields = ("name", "slug")

    def changelist_view(self, request, extra_context=None):
        from django.contrib import messages
        from django.shortcuts import redirect
        from django.urls import reverse

        if request.GET.get("advanced") != "1":
            messages.info(
                request,
                "料金だけ変える場合は「サブスク料金」画面がおすすめです（括弧内の数字だけ編集）。",
            )
            return redirect(reverse("admin:ops_subscription_plans"))
        return super().changelist_view(request, extra_context=extra_context)
