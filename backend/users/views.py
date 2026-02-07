import json

from django.http import HttpRequest, JsonResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from .models import Plan, User


@method_decorator(csrf_exempt, name="dispatch")
class RegisterUserView(View):
    def post(self, request: HttpRequest):
        import uuid as uuid_module
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")
            
            # Validation
            if not email or not password:
                return JsonResponse({"error": "Email and password are required"}, status=400)
            
            # Check if email already exists
            if User.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email already registered"}, status=400)
            
            # Auto-generate username from email
            base_username = email.split('@')[0][:20]
            username = f"{base_username}_{str(uuid_module.uuid4())[:8]}"
            
            # Ensure username is unique
            while User.objects.filter(username=username).exists():
                username = f"{base_username}_{str(uuid_module.uuid4())[:8]}"
            
            plan = data.get("plan", "free")
            plan_obj = Plan.objects.filter(slug=plan).first()
            if not plan_obj:
                # Default to free plan if specified plan not found
                plan_obj = Plan.objects.filter(slug="free").first()
                if not plan_obj:
                    return JsonResponse({"error": "No plan available"}, status=400)
            
            user = User.objects.create_user(username=username, password=password, email=email)
            user.subscription = plan_obj.slug
            user.save()
            return JsonResponse({"status": "ok", "user_id": user.id, "plan": plan_obj.slug, "username": username})
        except (ValueError, KeyError, TypeError) as e:
            return JsonResponse({"error": str(e)}, status=400)


@method_decorator(csrf_exempt, name="dispatch")
class PlanListView(View):
    def get(self, request: HttpRequest):
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Authentication required"}, status=401)
        plans = Plan.objects.filter(is_active=True).order_by("sort_order")
        result = [
            {
                "name": p.name,
                "slug": p.slug,
                "price": str(p.price),
                "currency": p.currency,
                "features": p.features,
                "trial_days": p.trial_days,
            }
            for p in plans
        ]
        return JsonResponse({"plans": result})
