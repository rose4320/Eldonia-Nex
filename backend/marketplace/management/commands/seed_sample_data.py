import random
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone


class Command(BaseCommand):
    help = "Seed sample data for development (artworks, events, streams, gamification, orders)."

    def handle(self, *args, **options):
        User = get_user_model()

        # Create sample users
        users = []
        sample_users = [
            {"username": "alice", "email": "alice@example.com"},
            {"username": "bob", "email": "bob@example.com"},
            {"username": "carol", "email": "carol@example.com"},
        ]
        for su in sample_users:
            u, created = User.objects.get_or_create(
                username=su["username"],
                defaults={
                    "email": su["email"],
                    "display_name": su["username"].title(),
                },
            )
            if created:
                u.set_password("password123")
                u.save()
            users.append(u)

        # Marketplace: categories, tags, artworks, products, likes, comments
        from marketplace.models import (
            Artwork,
            ArtworkTag,
            Category,
            Comment,
            Like,
            Product,
            Tag,
        )

        cat, _ = Category.objects.get_or_create(
            slug="illustrations", defaults={"name": "Illustrations"}
        )
        cat2, _ = Category.objects.get_or_create(
            slug="photography", defaults={"name": "Photography"}
        )

        tags = []
        for t in ("fantasy", "landscape", "portrait"):
            tag, _ = Tag.objects.get_or_create(name=t)
            tags.append(tag)

        artworks = []
        for i in range(1, 6):
            creator = random.choice(users)
            art_title = f"Sample Artwork {i}"
            art, _ = Artwork.objects.get_or_create(
                title=art_title,
                defaults={
                    "creator": creator,
                    "description": f"Auto-generated artwork #{i}",
                    "category": cat if i % 2 == 0 else cat2,
                    "file_url": f"https://example.com/files/art_{i}.png",
                    "thumbnail_url": f"https://example.com/files/thumb_art_{i}.png",
                    "file_size": 1024 * i,
                    "file_type": "image/png",
                    "price": Decimal("500.00") if i % 2 == 0 else Decimal("0.00"),
                    "is_free": i % 2 != 0,
                },
            )
            artworks.append(art)
            # attach tags
            for t in tags[: (i % len(tags)) + 1]:
                ArtworkTag.objects.get_or_create(artwork=art, tag=t)
            # sample likes/comments
            Like.objects.get_or_create(user=creator, artwork=art)
            Comment.objects.get_or_create(
                artwork=art, user=creator, content=f"Nice work #{i}"
            )

        # Products & Orders
        from marketplace.models import Order, OrderItem

        product, _ = Product.objects.get_or_create(
            name="Sample Print",
            defaults={
                "seller": users[0],
                "description": "A sample physical print",
                "price": Decimal("1200.00"),
                "stock_quantity": 10,
                "is_digital": False,
            },
        )

        order, _ = Order.objects.get_or_create(
            user=users[1],
            defaults={
                "total_amount": Decimal("1200.00"),
                "currency": "JPY",
                "status": "completed",
            },
        )
        OrderItem.objects.get_or_create(
            order=order,
            artwork=artworks[0],
            defaults={
                "unit_price": artworks[0].price or Decimal("0.00"),
                "quantity": 1,
            },
        )

        # Events and tickets
        from events.models import Event, EventTicket

        ev, _ = Event.objects.get_or_create(
            title="Sample Live Event",
            defaults={
                "organizer": users[0],
                "description": "Auto-generated event",
                "event_type": "online",
                "start_datetime": timezone.now() + timezone.timedelta(days=3),
                "end_datetime": timezone.now() + timezone.timedelta(days=3, hours=2),
                "is_free": False,
                "status": "published",
            },
        )
        EventTicket.objects.get_or_create(
            event=ev,
            ticket_type="standard",
            defaults={"price": Decimal("1500.00"), "quantity": 100},
        )

        # Streaming: streams and donations
        from streaming.models import LiveStream, StreamDonation

        stream, _ = LiveStream.objects.get_or_create(
            title="Sample Stream",
            defaults={
                "streamer": users[2],
                "description": "A sample stream",
                "stream_key": f"stream_{random.randint(1000, 9999)}",
                "status": "live",
                "actual_start": timezone.now(),
            },
        )
        StreamDonation.objects.get_or_create(
            stream=stream,
            donor=users[1],
            defaults={
                "amount": Decimal("300.00"),
                "message": "Great stream!",
                "payment_status": "completed",
            },
        )

        # Gamification: exp actions, logs, achievements
        from gamification.models import (
            Achievement,
            ExpAction,
            UserAchievement,
            UserExpLog,
        )

        # Plans (billing) — LP Plans v0.9.2 と同期
        from users.models import Plan
        from users.plan_catalog import LP_PLAN_CATALOG, plan_defaults

        for slot in LP_PLAN_CATALOG:
            Plan.objects.update_or_create(
                slug=slot["slug"],
                defaults=plan_defaults(slot),
            )

        # legacy 'pro' → 'premium' に統合（Plan 行の有無に関係なく）
        User.objects.filter(subscription_plan="pro").update(
            subscription_plan="premium"
        )
        Plan.objects.filter(slug="pro").delete()

        free_plan = Plan.objects.get(slug="free")
        standard_plan = Plan.objects.get(slug="standard")
        premium_plan = Plan.objects.get(slug="premium")
        business_plan = Plan.objects.get(slug="business")
        _ = (free_plan, standard_plan, premium_plan, business_plan)

        # Assign a sample plan id string to one user for verification (store plan id per docs)
        users[0].subscription_plan = "standard"
        users[0].subscription_type = (
            "premium"
            if users[0].subscription_type == "premium"
            else users[0].subscription_type
        )
        users[0].save()

        ea, _ = ExpAction.objects.get_or_create(
            action_type="upload_artwork",
            defaults={"base_exp": 50, "description": "Upload an artwork"},
        )
        UserExpLog.objects.get_or_create(
            user=users[0],
            action=ea,
            defaults={"exp_gained": 50, "description": "Seed: upload"},
        )

        ach, _ = Achievement.objects.get_or_create(
            name="First Upload",
            defaults={
                "condition_type": "uploads",
                "condition_value": 1,
                "description": "Awarded for first upload",
            },
        )
        UserAchievement.objects.get_or_create(
            user=users[0],
            achievement=ach,
            defaults={"progress": 1, "completed_at": timezone.now()},
        )

        # Summary output
        self.stdout.write(self.style.SUCCESS("Sample data seeded."))
        self.stdout.write(f"Users: {len(users)}, Artworks: {len(artworks)}")
