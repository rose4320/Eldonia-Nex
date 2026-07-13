"""Django Admin 用 — GALLERY 作品一覧の絞り込み"""

from django.contrib import admin
from django.db.models import QuerySet

from marketplace.models import Artwork

GALLERY_CATEGORY_LABELS: dict[str, str] = {
    "illustration": "イラスト",
    "manga": "漫画",
    "photo": "写真",
    "story": "ストーリー",
    "video": "動画",
    "music": "音楽",
    "document": "ドキュメント",
    "3d": "3D",
    "other": "その他",
}

_VERIFY_KIND_TO_CATEGORY = {
    "image": "illustration",
    "audio": "music",
    "document": "document",
    "model": "3d",
}


def gallery_category_label(slug: str) -> str:
    if not slug:
        return "—"
    return GALLERY_CATEGORY_LABELS.get(slug, slug)


def infer_gallery_category(artwork: Artwork) -> str:
    if artwork.gallery_category:
        return artwork.gallery_category
    title = (artwork.title or "").strip().lower()
    if not title.startswith("[verify]"):
        return ""
    parts = title.split()
    if len(parts) < 2:
        return ""
    return _VERIFY_KIND_TO_CATEGORY.get(parts[1], "")


class GalleryCategoryFilter(admin.SimpleListFilter):
    title = "GALLERYカテゴリ"
    parameter_name = "gallery_category"

    def lookups(self, request, model_admin):
        slugs = set(
            Artwork.objects.exclude(gallery_category="")
            .values_list("gallery_category", flat=True)
            .distinct()
        )
        if Artwork.objects.filter(title__istartswith="[verify]").exists():
            slugs.update(_VERIFY_KIND_TO_CATEGORY.values())
        return [
            (slug, gallery_category_label(slug))
            for slug in sorted(slugs, key=lambda value: gallery_category_label(value))
        ]

    def queryset(self, request, queryset: QuerySet[Artwork]):
        value = self.value()
        if not value:
            return queryset

        from django.db.models import Q

        direct = Q(gallery_category=value)
        verify_kinds = [kind for kind, cat in _VERIFY_KIND_TO_CATEGORY.items() if cat == value]
        if not verify_kinds:
            return queryset.filter(direct)

        verify_q = Q()
        for kind in verify_kinds:
            verify_q |= Q(gallery_category="", title__istartswith=f"[verify] {kind}")
        return queryset.filter(direct | verify_q).distinct()


class CreatorFilter(admin.SimpleListFilter):
    title = "ユーザー（作者）"
    parameter_name = "creator"

    def lookups(self, request, model_admin):
        creators: dict[int, str] = {}
        for artwork in (
            Artwork.objects.select_related("creator")
            .only(
                "creator_id",
                "creator_display_name",
                "creator__username",
                "creator__display_name",
            )
            .order_by("creator_display_name", "creator__username")
        ):
            if artwork.creator_id in creators:
                continue
            label = (
                (artwork.creator_display_name or "").strip()
                or (getattr(artwork.creator, "display_name", "") or "").strip()
                or (getattr(artwork.creator, "username", "") or "").strip()
                or f"User #{artwork.creator_id}"
            )
            creators[artwork.creator_id] = label
        return [
            (str(creator_id), label)
            for creator_id, label in sorted(creators.items(), key=lambda item: item[1].casefold())
        ]

    def queryset(self, request, queryset: QuerySet[Artwork]):
        if self.value():
            return queryset.filter(creator_id=self.value())
        return queryset


class VerifyArtworkFilter(admin.SimpleListFilter):
    title = "作品種別"
    parameter_name = "verify"

    def lookups(self, request, model_admin):
        return (
            ("real", "本番作品"),
            ("verify", "[verify] テスト"),
        )

    def queryset(self, request, queryset: QuerySet[Artwork]):
        if self.value() == "verify":
            return queryset.filter(title__istartswith="[verify]")
        if self.value() == "real":
            return queryset.exclude(title__istartswith="[verify]")
        return queryset
