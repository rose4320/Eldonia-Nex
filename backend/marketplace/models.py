from django.conf import settings
from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    parent = models.ForeignKey("self", null=True, blank=True, on_delete=models.SET_NULL)
    sort_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "categories"


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    usage_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "tags"


class Artwork(models.Model):
    supabase_id = models.UUIDField(
        null=True,
        blank=True,
        unique=True,
        db_index=True,
        editable=False,
        help_text="Supabase public.artworks.id",
    )
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="artworks"
    )
    # denormalized fields for frontend: keep creator ID, display name and avatar
    creator_external_id = models.UUIDField(null=True, blank=True, editable=False)
    creator_display_name = models.CharField(max_length=100, blank=True)
    creator_avatar_url = models.URLField(max_length=1000, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.ForeignKey(
        Category, null=True, blank=True, on_delete=models.SET_NULL
    )
    file_url = models.URLField(max_length=1000)
    thumbnail_url = models.URLField(max_length=1000, blank=True)
    file_size = models.BigIntegerField(null=True, blank=True)
    file_type = models.CharField(max_length=50, blank=True)
    gallery_category = models.CharField(
        max_length=30,
        blank=True,
        db_index=True,
        help_text="Supabase artworks.category（GALLERY 表示カテゴリ slug）",
    )
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_free = models.BooleanField(default=True)
    license_type = models.CharField(max_length=50, blank=True)
    is_adult_content = models.BooleanField(default=False)

    view_count = models.BigIntegerField(default=0)
    like_count = models.IntegerField(default=0)
    comment_count = models.IntegerField(default=0)
    download_count = models.IntegerField(default=0)

    status = models.CharField(max_length=20, default="published")
    featured_until = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    tags = models.ManyToManyField(Tag, through="ArtworkTag", related_name="artworks")

    class Meta:
        db_table = "artworks"
        indexes = [
            models.Index(fields=["creator", "status"]),
            models.Index(fields=["-created_at"]),
        ]


class ArtworkTag(models.Model):
    artwork = models.ForeignKey(Artwork, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    class Meta:
        db_table = "artwork_tags"
        unique_together = ("artwork", "tag")


class Product(models.Model):
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    artwork = models.ForeignKey(
        Artwork, null=True, blank=True, on_delete=models.SET_NULL
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.ForeignKey(
        Category, null=True, blank=True, on_delete=models.SET_NULL
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField(default=0)
    is_digital = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "products"
        verbose_name = "商品（旧）"
        verbose_name_plural = "商品（旧）"


class ShopProduct(models.Model):
    """Supabase public.shop_products の Admin 用ミラー。"""

    PRODUCT_TYPE_PHYSICAL = "physical"
    PRODUCT_TYPE_DIGITAL = "digital"
    PRODUCT_TYPE_CHOICES = [
        (PRODUCT_TYPE_PHYSICAL, "physical"),
        (PRODUCT_TYPE_DIGITAL, "digital"),
    ]

    supabase_id = models.UUIDField(
        unique=True,
        db_index=True,
        editable=False,
        help_text="Supabase public.shop_products.id",
    )
    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="shop_products",
    )
    seller_external_id = models.UUIDField(null=True, blank=True, editable=False, db_index=True)
    title = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, default="goods", db_index=True)
    product_type = models.CharField(
        max_length=20,
        choices=PRODUCT_TYPE_CHOICES,
        default=PRODUCT_TYPE_PHYSICAL,
        db_index=True,
    )
    price = models.PositiveIntegerField(default=0)
    compare_at_price = models.PositiveIntegerField(null=True, blank=True)
    image_url = models.URLField(max_length=1000, blank=True)
    download_url = models.URLField(max_length=1000, blank=True)
    source_artwork_id = models.UUIDField(null=True, blank=True, db_index=True)
    gallery_urls = models.JSONField(default=list, blank=True)
    tags = models.JSONField(default=list, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    review_count = models.PositiveIntegerField(default=0)
    stock_quantity = models.PositiveIntegerField(null=True, blank=True)
    is_nexus_prime = models.BooleanField(default=False)
    is_nexus_choice = models.BooleanField(default=False)
    is_bestseller = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        db_table = "shop_products_mirror"
        verbose_name = "SHOP商品"
        verbose_name_plural = "SHOP商品"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["is_active", "-created_at"]),
            models.Index(fields=["category", "is_active"]),
        ]

    def __str__(self) -> str:
        return self.title


class Order(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders"
    )
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default="JPY")
    status = models.CharField(max_length=30, default="pending")
    stripe_payment_intent = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "orders"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    artwork = models.ForeignKey(
        Artwork, null=True, blank=True, on_delete=models.SET_NULL
    )
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=1)

    class Meta:
        db_table = "order_items"


class Like(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    artwork = models.ForeignKey(Artwork, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "likes"
        unique_together = ("user", "artwork")


class Comment(models.Model):
    artwork = models.ForeignKey(
        Artwork, on_delete=models.CASCADE, related_name="comments"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL
    )
    parent = models.ForeignKey("self", null=True, blank=True, on_delete=models.CASCADE)
    content = models.TextField()
    rating = models.IntegerField(null=True, blank=True)
    is_edited = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "comments"


class Fan(models.Model):
    fan = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="fan_set"
    )
    fanned = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="fanned_set"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "fans"
        unique_together = ("fan", "fanned")


class Transaction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=20)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    fee_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    net_amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "transactions"


class Referral(models.Model):
    referrer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="referrals_made",
    )
    referred_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="referred_by",
    )
    referral_code = models.CharField(max_length=50, unique=True)
    status = models.CharField(max_length=20, default="active")
    country_code = models.CharField(max_length=10, null=True, blank=True)
    rebate_percent = models.DecimalField(max_digits=5, decimal_places=2, default=10)
    reward_available_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "referrals"


class ReferralTrack(models.Model):
    referral = models.ForeignKey(
        Referral, null=True, blank=True, on_delete=models.CASCADE
    )
    tracking_type = models.CharField(max_length=20)
    visitor_ip = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    country_code = models.CharField(max_length=2, null=True, blank=True)
    converted_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL
    )
    # optional order id to mark which order a referral track corresponds to
    order_id = models.BigIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "referral_tracks"

