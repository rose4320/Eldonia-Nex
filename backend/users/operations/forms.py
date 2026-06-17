from decimal import Decimal, InvalidOperation

from django import forms
from django.utils.text import slugify

from .services import get_current_plan_prices, get_plan_price_slots
from .settings_service import (
    get_current_fee_values,
    get_fee_setting_slots,
    get_plan_detail_slots,
    get_plan_details,
    get_quest_actions,
)


class SubscriptionPlanAddForm(forms.Form):
    """サブスクプラン追加"""

    name = forms.CharField(
        label="プラン名",
        max_length=100,
        widget=forms.TextInput(attrs={"class": "ops-text-input", "placeholder": "例: Creator Plus"}),
    )
    slug = forms.SlugField(
        label="管理キー",
        max_length=50,
        required=False,
        widget=forms.TextInput(attrs={"class": "ops-text-input", "placeholder": "例: creator-plus"}),
    )
    price = forms.IntegerField(
        label="月額（円）",
        min_value=0,
        max_value=9999999,
        initial=0,
        widget=forms.NumberInput(attrs={"class": "ops-price-input", "inputmode": "numeric"}),
    )
    trial_days = forms.IntegerField(
        label="試用日数",
        min_value=0,
        max_value=365,
        initial=0,
        widget=forms.NumberInput(attrs={"class": "ops-price-input", "inputmode": "numeric"}),
    )
    is_active = forms.BooleanField(label="公開する", required=False, initial=True)

    def clean_slug(self):
        raw = self.cleaned_data.get("slug") or self.cleaned_data.get("name") or ""
        slug = slugify(raw).replace("_", "-")
        if not slug:
            raise forms.ValidationError("管理キーを入力してください。")
        from users.models import Plan

        if Plan.objects.filter(slug=slug).exists():
            raise forms.ValidationError("この管理キーはすでに使われています。")
        return slug


class FeeSettingAddForm(forms.Form):
    """手数料項目追加"""

    label = forms.CharField(
        label="項目名",
        max_length=100,
        widget=forms.TextInput(attrs={"class": "ops-text-input", "placeholder": "例: AI生成手数料"}),
    )
    key = forms.SlugField(
        label="管理キー",
        max_length=80,
        required=False,
        widget=forms.TextInput(attrs={"class": "ops-text-input", "placeholder": "例: ai_generation_fee"}),
    )
    value = forms.CharField(
        label="初期値（%）",
        initial="0",
        widget=forms.TextInput(attrs={"class": "ops-rate-input", "inputmode": "decimal"}),
    )
    help_text = forms.CharField(
        label="説明",
        required=False,
        max_length=200,
        widget=forms.TextInput(attrs={"class": "ops-text-input", "placeholder": "どの売上に適用する手数料か"}),
    )

    def clean_key(self):
        raw = self.cleaned_data.get("key") or self.cleaned_data.get("label") or ""
        key = slugify(raw).replace("-", "_")
        if not key:
            raise forms.ValidationError("管理キーを入力してください。")
        from users.models import OpsSetting

        if OpsSetting.objects.filter(key=key).exists():
            raise forms.ValidationError("この管理キーはすでに使われています。")
        return key

    def clean_value(self):
        raw = (self.cleaned_data.get("value") or "").strip()
        try:
            value = Decimal(raw)
        except InvalidOperation as exc:
            raise forms.ValidationError("数字で入力してください（例: 10 または 3.6）") from exc
        if value < 0 or value > 100:
            raise forms.ValidationError("0〜100 の範囲で入力してください。")
        return raw


class ExpActionAddForm(forms.Form):
    """EXP付与アクション追加"""

    action_type = forms.RegexField(
        label="アクションキー",
        regex=r"^[a-z0-9_.-]+$",
        max_length=50,
        error_messages={"invalid": "英小文字・数字・._- で入力してください。"},
        widget=forms.TextInput(attrs={"class": "ops-text-input", "placeholder": "例: ai.generate"}),
    )
    description = forms.CharField(
        label="表示名",
        max_length=255,
        widget=forms.TextInput(attrs={"class": "ops-text-input", "placeholder": "例: AI生成を実行"}),
    )
    base_exp = forms.IntegerField(
        label="EXP",
        min_value=0,
        initial=10,
        widget=forms.NumberInput(attrs={"class": "ops-price-input", "inputmode": "numeric"}),
    )
    max_daily_count = forms.IntegerField(
        label="1日上限",
        min_value=0,
        initial=20,
        widget=forms.NumberInput(attrs={"class": "ops-price-input", "inputmode": "numeric"}),
    )
    is_active = forms.BooleanField(label="有効", required=False, initial=True)

    def clean_action_type(self):
        action_type = (self.cleaned_data.get("action_type") or "").strip()
        if not action_type:
            raise forms.ValidationError("アクションキーを入力してください。")
        try:
            from gamification.models import ExpAction
        except ImportError as exc:
            raise forms.ValidationError("Gamification アプリが利用できません。") from exc
        if ExpAction.objects.filter(action_type=action_type).exists():
            raise forms.ValidationError("このアクションキーはすでに使われています。")
        return action_type


class SubscriptionPlanPricesForm(forms.Form):
    """サブスク料金 — 括弧内（円）のみ入力"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        current = get_current_plan_prices()
        for slot in get_plan_price_slots():
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
        for slot in get_fee_setting_slots():
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
        for slot in get_fee_setting_slots():
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
        for slot in get_fee_setting_slots():
            yield {**slot, "field": self[slot["key"]]}


class PlanDetailsForm(forms.Form):
    """プラン詳細 — 試用（　）日"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        current = get_plan_details()
        for slot in get_plan_detail_slots():
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
        for slot in get_plan_detail_slots():
            slug = slot["slug"]
            result[slug] = {
                "trial_days": int(self.cleaned_data[f"{slug}_trial"]),
                "is_active": bool(self.cleaned_data.get(f"{slug}_active")),
            }
        return result

    def field_groups(self):
        for slot in get_plan_detail_slots():
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


class AnnouncementBroadcastForm(forms.Form):
    """運営からのユーザー告知"""

    TARGET_CHOICES = [
        ("all", "全ユーザー"),
        ("creators", "クリエイターのみ"),
        ("email", "メールアドレス指定（1名）"),
    ]

    target = forms.ChoiceField(
        label="配信先",
        choices=TARGET_CHOICES,
        widget=forms.Select(attrs={"class": "ops-select"}),
    )
    target_email = forms.EmailField(
        label="配信先メール（個別指定時）",
        required=False,
        widget=forms.EmailInput(
            attrs={
                "class": "ops-text-input",
                "placeholder": "user@example.com",
            }
        ),
    )
    title = forms.CharField(
        label="タイトル",
        max_length=120,
        widget=forms.TextInput(
            attrs={"class": "ops-text-input", "placeholder": "【重要】メンテナンスのお知らせ"}
        ),
    )
    body = forms.CharField(
        label="本文",
        required=False,
        widget=forms.Textarea(
            attrs={
                "class": "ops-textarea",
                "rows": 4,
                "placeholder": "告知の詳細を入力…",
            }
        ),
    )
    href = forms.CharField(
        label="リンク URL（任意）",
        required=False,
        max_length=500,
        widget=forms.TextInput(
            attrs={"class": "ops-text-input", "placeholder": "/help/guides"}
        ),
    )

    def clean(self):
        cleaned = super().clean()
        if cleaned.get("target") == "email" and not cleaned.get("target_email"):
            self.add_error("target_email", "個別配信の場合はメールアドレスが必要です。")
        return cleaned


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
