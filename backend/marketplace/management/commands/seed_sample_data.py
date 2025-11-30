import random
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone


class Command(BaseCommand):
    help = "Seed sample data for development (artworks, events, streams, gamification, orders)."

    def handle(self, *args: object, **options: object):
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
        )  # type: ignore[attr-defined]
        cat2, _ = Category.objects.get_or_create(
            slug="photography", defaults={"name": "Photography"}
        )  # type: ignore[attr-defined]

        tags = []
        for t in ("fantasy", "landscape", "portrait"):
            tag, _ = Tag.objects.get_or_create(name=t)  # type: ignore[attr-defined]
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
            )  # type: ignore[attr-defined]
            artworks.append(art)
            # attach tags
            for t in tags[: (i % len(tags)) + 1]:
                ArtworkTag.objects.get_or_create(artwork=art, tag=t)  # type: ignore[attr-defined]
            # sample likes/comments
            Like.objects.get_or_create(user=creator, artwork=art)  # type: ignore[attr-defined]
            Comment.objects.get_or_create(
                artwork=art, user=creator, content=f"Nice work #{i}"
            )  # type: ignore[attr-defined]

        # Products & Orders
        from marketplace.models import Order, OrderItem

        Product.objects.get_or_create(
            name="Sample Print",
            defaults={
                "seller": users[0],
                "description": "A sample physical print",
                "price": Decimal("1200.00"),
                "stock_quantity": 10,
                "is_digital": False,
            },
        )  # type: ignore[attr-defined]

        order, _ = Order.objects.get_or_create(
            user=users[1],
            defaults={
                "total_amount": Decimal("1200.00"),
                "currency": "JPY",
                "status": "completed",
            },
        )  # type: ignore[attr-defined]
        OrderItem.objects.get_or_create(
            order=order,
            artwork=artworks[0],
            defaults={
                "unit_price": artworks[0].price or Decimal("0.00"),
                "quantity": 1,
            },
        )  # type: ignore[attr-defined]

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
        )  # type: ignore[attr-defined]
        EventTicket.objects.get_or_create(
            event=ev,
            ticket_type="standard",
            defaults={"price": Decimal("1500.00"), "quantity": 100},
        )  # type: ignore[attr-defined]

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
        )  # type: ignore[attr-defined]
        StreamDonation.objects.get_or_create(
            stream=stream,
            donor=users[1],
            defaults={
                "amount": Decimal("300.00"),
                "message": "Great stream!",
                "payment_status": "completed",
            },
        )  # type: ignore[attr-defined]

        # Gamification: exp actions, logs, achievements
        from gamification.models import (
            Achievement,
            ExpAction,
            UserAchievement,
            UserExpLog,
        )

        # Plans (billing) - users app: create plans matching docs (free, standard, pro, business)
        from users.models import Plan

        # Use update_or_create so existing plans are updated to current pricing/specs
        Plan.objects.update_or_create(
            slug="free",
            defaults={
                "name": "Free",
                "price": Decimal("0.00"),
                "billing_cycle": "monthly",
                "trial_days": 0,
                "is_active": True,
            },
        )
        Plan.objects.update_or_create(
            slug="standard",
            defaults={
                "name": "Standard",
                "price": Decimal("800.00"),
                "billing_cycle": "monthly",
                "trial_days": 14,
                "is_active": True,
            },
        )
        # Add premium plan as requested (¥1,500.00)
        Plan.objects.update_or_create(
            slug="premium",
            defaults={
                "name": "Premium",
                "price": Decimal("1500.00"),
                "billing_cycle": "monthly",
                "trial_days": 14,
                "is_active": True,
            },
        )
        # If a legacy 'pro' plan exists, map users to 'premium' and remove the duplicate
        if Plan.objects.filter(slug="pro").exists():
            pro_obj = Plan.objects.get(slug="pro")  # type: ignore[attr-defined]
            # Ensure premium exists (create from pro if needed)
            Plan.objects.get_or_create(
                slug="premium",
                defaults={
                    "name": pro_obj.name if pro_obj.name else "Premium",
                    "price": pro_obj.price,
                    "billing_cycle": pro_obj.billing_cycle,
                    "trial_days": pro_obj.trial_days,
                    "is_active": pro_obj.is_active,
                },
            )  # type: ignore[attr-defined]
            # Map users who had 'pro' to 'premium'
            User.objects.filter(subscription_plan="pro").update(
                subscription_plan="premium"
            )
            pro_obj.delete()
        Plan.objects.update_or_create(
            slug="business",
            defaults={
                "name": "Business",
                "price": Decimal("10000.00"),
                "billing_cycle": "monthly",
                "trial_days": 0,
                "is_active": True,
            },
        )

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
        )  # type: ignore[attr-defined]
        UserExpLog.objects.get_or_create(
            user=users[0],
            action=ea,
            defaults={"exp_gained": 50, "description": "Seed: upload"},
        )  # type: ignore[attr-defined]

        ach, _ = Achievement.objects.get_or_create(
            name="First Upload",
            defaults={
                "condition_type": "uploads",
                "condition_value": 1,
                "description": "Awarded for first upload",
            },
        )  # type: ignore[attr-defined]
        UserAchievement.objects.get_or_create(
            user=users[0],
            achievement=ach,
            defaults={"progress": 1, "completed_at": timezone.now()},
        )  # type: ignore[attr-defined]

        # Summary output
        self.stdout.write(self.style.SUCCESS("Sample data seeded."))  # type: ignore[attr-defined]
        self.stdout.write(f"Users: {len(users)}, Artworks: {len(artworks)}")
