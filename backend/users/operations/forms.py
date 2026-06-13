from decimal import Decimal, InvalidOperation

from django import forms

from .services import PLAN_PRICE_SLOTS, get_current_plan_prices
from .settings_constants import FEE_SETTING_SLOTS, PLAN_DETAIL_SLOTS
from .settings_service import get_current_fee_values, get_plan_details, get_quest_actions


class SubscriptionPlanPricesForm(forms.Form):
    """サブスク料金 — 括弧内（円）のみ入力"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        current = get_current_plan_prices()
        for slot in PLAN_PRICE_SLOTS:
            self.fields[slot["slug"]] = forms.IntegerField(
                label=slot["label"],
                min_value=0,
                max_value=9999999,
                initial=current.get(slot["slug"], slot["default_yen"]),
                widget=forms.NumberInput(
                    attrs={
                        "class": "ops-price-input",
                        "inputmode": "numeric",
                        "aria-label": f"{slot['label']} 月額（円）",
                    }
                ),
            )

    def cleaned_prices(self) -> dict[str, int]:
        return {slug: int(self.cleaned_data[slug]) for slug in self.fields}


class FeeSettingsForm(forms.Form):
    """手数料・還元率 — 括弧内（%）のみ入力"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        current = get_current_fee_values()
        for slot in FEE_SETTING_SLOTS:
            self.fields[slot["key"]] = forms.CharField(
                label=slot["label"],
                initial=current.get(slot["key"], slot["default"]),
                widget=forms.TextInput(
                    attrs={
                        "class": "ops-rate-input",
                        "inputmode": "decimal",
                        "aria-label": f"{slot['label']}（{slot['unit']}）",
                    }
                ),
            )

    def clean(self):
        cleaned = super().clean()
        for slot in FEE_SETTING_SLOTS:
            key = slot["key"]
            raw = (cleaned.get(key) or "").strip()
            try:
                value = Decimal(raw)
            except InvalidOperation:
                self.add_error(key, "数字で入力してください（例: 10 または 3.6）")
                continue
            if value < 0 or value > 100:
                self.add_error(key, "0〜100 の範囲で入力してください")
        return cleaned

    def cleaned_values(self) -> dict[str, str]:
        return {key: self.cleaned_data[key].strip() for key in self.fields}

    def field_groups(self):
        for slot in FEE_SETTING_SLOTS:
            yield {**slot, "field": self[slot["key"]]}


class PlanDetailsForm(forms.Form):
    """プラン詳細 — 試用（　）日"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        current = get_plan_details()
        for slot in PLAN_DETAIL_SLOTS:
            slug = slot["slug"]
            data = current.get(slug, {})
            self.fields[f"{slug}_trial"] = forms.IntegerField(
                label=f"{slot['label']} 試用",
                min_value=0,
                max_value=365,
                initial=data.get("trial_days", 0),
                widget=forms.NumberInput(
                    attrs={"class": "ops-price-input", "inputmode": "numeric"}
                ),
            )
            self.fields[f"{slug}_active"] = forms.BooleanField(
                label=f"{slot['label']} を公開",
                initial=data.get("is_active", True),
                required=False,
            )

    def cleaned_details(self) -> dict[str, dict]:
        result: dict[str, dict] = {}
        for slot in PLAN_DETAIL_SLOTS:
            slug = slot["slug"]
            result[slug] = {
                "trial_days": int(self.cleaned_data[f"{slug}_trial"]),
                "is_active": bool(self.cleaned_data.get(f"{slug}_active")),
            }
        return result

    def field_groups(self):
        for slot in PLAN_DETAIL_SLOTS:
            slug = slot["slug"]
            yield {
                "label": slot["label"],
                "slug": slug,
                "trial": self[f"{slug}_trial"],
                "active": self[f"{slug}_active"],
            }


class QuestSettingsForm(forms.Form):
    """Quest（ExpAction）設定"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.action_types: list[str] = []
        for row in get_quest_actions():
            action_type = row["action_type"]
            self.action_types.append(action_type)
            prefix = action_type.replace("-", "_")
            self.fields[f"{prefix}_exp"] = forms.IntegerField(
                label=f"{row['description']} EXP",
                min_value=0,
                initial=row["base_exp"],
                widget=forms.NumberInput(attrs={"class": "ops-price-input", "inputmode": "numeric"}),
            )
            self.fields[f"{prefix}_daily"] = forms.IntegerField(
                label="1日上限",
                min_value=0,
                initial=row["max_daily_count"],
                widget=forms.NumberInput(attrs={"class": "ops-price-input", "inputmode": "numeric"}),
            )
            self.fields[f"{prefix}_active"] = forms.BooleanField(
                label="有効",
                initial=row["is_active"],
                required=False,
            )

    def cleaned_rows(self) -> list[dict]:
        current_map = {row["action_type"]: row for row in get_quest_actions()}
        rows: list[dict] = []
        for action_type in self.action_types:
            prefix = action_type.replace("-", "_")
            rows.append(
                {
                    "action_type": action_type,
                    "description": current_map.get(action_type, {}).get("description", action_type),
                    "base_exp": int(self.cleaned_data[f"{prefix}_exp"]),
                    "max_daily_count": int(self.cleaned_data[f"{prefix}_daily"]),
                    "is_active": bool(self.cleaned_data.get(f"{prefix}_active")),
                }
            )
        return rows

    def field_groups(self):
        current_map = {row["action_type"]: row for row in get_quest_actions()}
        for action_type in self.action_types:
            prefix = action_type.replace("-", "_")
            yield {
                "action_type": action_type,
                "description": current_map.get(action_type, {}).get("description", action_type),
                "exp": self[f"{prefix}_exp"],
                "daily": self[f"{prefix}_daily"],
                "active": self[f"{prefix}_active"],
            }


class AdminPasswordConfirmForm(forms.Form):
    admin_password = forms.CharField(
        label="管理人パスワード",
        widget=forms.PasswordInput(
            attrs={
                "class": "ops-password-input",
                "autocomplete": "current-password",
                "placeholder": "ログイン中の管理人パスワードを入力",
            }
        ),
    )
    confirm_understand = forms.BooleanField(
        label="変更内容を確認し、実行することに同意します",
        required=True,
    )
