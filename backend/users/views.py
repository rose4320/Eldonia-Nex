import json

from django.http import HttpRequest, JsonResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from .models import Plan, User


@method_decorator(csrf_exempt, name='dispatch')
class RegisterUserView(View):
    def post(self, request: HttpRequest):
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            email = data.get('email')
            plan = data.get('plan', 'free')
            plan_obj = Plan.objects.filter(slug=plan).first()
            if not plan_obj:
                return JsonResponse({'error': 'Invalid plan'}, status=400)
            user = User.objects.create_user(username=username, password=password, email=email)
            user.subscription = plan_obj.slug
            user.save()
            return JsonResponse({'status': 'ok', 'user_id': user.id, 'plan': plan_obj.slug})
        except (ValueError, KeyError, TypeError) as e:
            return JsonResponse({'error': str(e)}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class PlanListView(View):
    def get(self, request: HttpRequest):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Authentication required'}, status=401)
        plans = Plan.objects.filter(is_active=True).order_by('sort_order')
        result = [
            {
                'name': p.name,
                'slug': p.slug,
                'price': str(p.price),
                'currency': p.currency,
                'features': p.features,
                'trial_days': p.trial_days,
            } for p in plans
        ]
        return JsonResponse({'plans': result})
