from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import Plan, User, UserProfile


@admin.register(User)
class UserAdmin(DjangoUserAdmin):  # type: ignore
    model = User
    _fieldsets = list(DjangoUserAdmin.fieldsets)
    _fieldsets.append(
        (
            "Profile",
            {
                "fields": (
                    "display_name",
                    "bio",
                    "avatar_url",
                    "subscription_type",
                    "subscription",
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
        "subscription",
        "subscription_plan",
        "is_active",
        "account_status",
        "referred_by_user",
        "referred_users_count",
    ]
    readonly_fields = ("external_id",)

    def referred_users_count(self, obj):
        return obj.referred_users.count()

    referred_users_count.short_description = "Referred users"


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("user", "timezone")
    readonly_fields = ("created_at", "updated_at")


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("name", "slug", "price", "currency", "billing_cycle", "is_active")
    list_filter = ("billing_cycle", "is_active")
    search_fields = ("name", "slug")
