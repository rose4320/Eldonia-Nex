"""
Portfolio API Views
"""
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Portfolio, PortfolioLike


class PortfolioListView(APIView):
    """ポートフォリオ一覧取得（公開作品）"""
    permission_classes = [AllowAny]

    def get(self, request):
        """公開ポートフォリオ一覧を取得"""
        work_type = request.query_params.get('work_type')
        user_id = request.query_params.get('user_id')
        limit = int(request.query_params.get('limit', 20))
        offset = int(request.query_params.get('offset', 0))
        
        queryset = Portfolio.objects.filter(visibility='public')
        
        if work_type:
            queryset = queryset.filter(work_type=work_type)
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        queryset = queryset.select_related('user')[offset:offset + limit]
        
        portfolios = [{
            'id': p.id,
            'user_id': p.user_id,
            'username': p.user.username,
            'display_name': p.user.display_name or p.user.username,
            'avatar_url': p.user.avatar_url or '',
            'title': p.title,
            'description': p.description,
            'work_type': p.work_type,
            'thumbnail_url': p.thumbnail_url,
            'external_url': p.external_url,
            'tags': p.tags,
            'tools_used': p.tools_used,
            'is_featured': p.is_featured,
            'view_count': p.view_count,
            'like_count': p.like_count,
            'created_at': p.created_at.isoformat(),
        } for p in queryset]
        
        total_count = Portfolio.objects.filter(visibility='public').count()
        
        return Response({
            'portfolios': portfolios,
            'total': total_count,
            'limit': limit,
            'offset': offset,
        })


class PortfolioDetailView(APIView):
    """ポートフォリオ詳細取得"""
    permission_classes = [AllowAny]

    def get(self, request, portfolio_id):
        """ポートフォリオ詳細を取得"""
        try:
            portfolio = Portfolio.objects.select_related('user').get(id=portfolio_id)
            
            # 非公開の場合は所有者のみ閲覧可能
            if portfolio.visibility == 'private':
                if not request.user.is_authenticated or request.user.id != portfolio.user_id:
                    return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
            
            # 閲覧数カウントアップ
            portfolio.view_count += 1
            portfolio.save(update_fields=['view_count'])
            
            # いいね済みかチェック
            is_liked = False
            if request.user.is_authenticated:
                is_liked = PortfolioLike.objects.filter(
                    user=request.user, portfolio=portfolio
                ).exists()
            
            return Response({
                'id': portfolio.id,
                'user_id': portfolio.user_id,
                'username': portfolio.user.username,
                'display_name': portfolio.user.display_name or portfolio.user.username,
                'avatar_url': portfolio.user.avatar_url or '',
                'title': portfolio.title,
                'description': portfolio.description,
                'work_type': portfolio.work_type,
                'thumbnail_url': portfolio.thumbnail_url,
                'file_urls': portfolio.file_urls,
                'external_url': portfolio.external_url,
                'tags': portfolio.tags,
                'tools_used': portfolio.tools_used,
                'creation_period': portfolio.creation_period,
                'client_name': portfolio.client_name,
                'visibility': portfolio.visibility,
                'is_featured': portfolio.is_featured,
                'view_count': portfolio.view_count,
                'like_count': portfolio.like_count,
                'is_liked': is_liked,
                'created_at': portfolio.created_at.isoformat(),
                'updated_at': portfolio.updated_at.isoformat(),
            })
        except Portfolio.DoesNotExist:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


class MyPortfolioListView(APIView):
    """自分のポートフォリオ一覧（認証必須）"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """自分のポートフォリオ一覧を取得"""
        portfolios = Portfolio.objects.filter(user=request.user).order_by('-is_featured', 'sort_order', '-created_at')
        
        return Response([{
            'id': p.id,
            'title': p.title,
            'description': p.description,
            'work_type': p.work_type,
            'thumbnail_url': p.thumbnail_url,
            'visibility': p.visibility,
            'is_featured': p.is_featured,
            'sort_order': p.sort_order,
            'view_count': p.view_count,
            'like_count': p.like_count,
            'created_at': p.created_at.isoformat(),
        } for p in portfolios])

    def post(self, request):
        """ポートフォリオを作成"""
        portfolio = Portfolio.objects.create(
            user=request.user,
            title=request.data.get('title', ''),
            description=request.data.get('description', ''),
            work_type=request.data.get('work_type', 'illustration'),
            thumbnail_url=request.data.get('thumbnail_url', ''),
            file_urls=request.data.get('file_urls'),
            external_url=request.data.get('external_url', ''),
            tags=request.data.get('tags'),
            tools_used=request.data.get('tools_used'),
            creation_period=request.data.get('creation_period', ''),
            client_name=request.data.get('client_name', ''),
            visibility=request.data.get('visibility', 'public'),
            is_featured=request.data.get('is_featured', False),
            sort_order=request.data.get('sort_order', 0),
        )
        
        return Response({
            'detail': 'ポートフォリオを作成しました',
            'portfolio': {
                'id': portfolio.id,
                'title': portfolio.title,
                'work_type': portfolio.work_type,
                'visibility': portfolio.visibility,
            }
        }, status=status.HTTP_201_CREATED)


class MyPortfolioDetailView(APIView):
    """自分のポートフォリオ詳細（認証必須）"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request, portfolio_id):
        """ポートフォリオを更新"""
        try:
            portfolio = Portfolio.objects.get(id=portfolio_id, user=request.user)
        except Portfolio.DoesNotExist:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
        fields = ['title', 'description', 'work_type', 'thumbnail_url', 'file_urls',
                  'external_url', 'tags', 'tools_used', 'creation_period', 'client_name',
                  'visibility', 'is_featured', 'sort_order']
        
        for field in fields:
            if field in request.data:
                setattr(portfolio, field, request.data[field])
        
        portfolio.save()
        
        return Response({
            'detail': 'ポートフォリオを更新しました',
            'portfolio': {
                'id': portfolio.id,
                'title': portfolio.title,
            }
        })

    def delete(self, request, portfolio_id):
        """ポートフォリオを削除"""
        try:
            portfolio = Portfolio.objects.get(id=portfolio_id, user=request.user)
            portfolio.delete()
            return Response({'detail': 'ポートフォリオを削除しました'})
        except Portfolio.DoesNotExist:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


class PortfolioLikeView(APIView):
    """ポートフォリオいいね"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, portfolio_id):
        """いいねを追加"""
        try:
            portfolio = Portfolio.objects.get(id=portfolio_id)
        except Portfolio.DoesNotExist:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
        like, created = PortfolioLike.objects.get_or_create(
            user=request.user, portfolio=portfolio
        )
        
        if created:
            portfolio.like_count += 1
            portfolio.save(update_fields=['like_count'])
            return Response({'detail': 'いいねしました', 'like_count': portfolio.like_count})
        else:
            return Response({'detail': '既にいいね済みです', 'like_count': portfolio.like_count})

    def delete(self, request, portfolio_id):
        """いいねを解除"""
        try:
            portfolio = Portfolio.objects.get(id=portfolio_id)
            like = PortfolioLike.objects.get(user=request.user, portfolio=portfolio)
            like.delete()
            portfolio.like_count = max(0, portfolio.like_count - 1)
            portfolio.save(update_fields=['like_count'])
            return Response({'detail': 'いいねを解除しました', 'like_count': portfolio.like_count})
        except (Portfolio.DoesNotExist, PortfolioLike.DoesNotExist):
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)


class UserPortfolioView(APIView):
    """特定ユーザーのポートフォリオ一覧"""
    permission_classes = [AllowAny]

    def get(self, request, username):
        """ユーザーのポートフォリオを取得"""
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        queryset = Portfolio.objects.filter(user=user, visibility='public')
        
        portfolios = [{
            'id': p.id,
            'title': p.title,
            'description': p.description,
            'work_type': p.work_type,
            'thumbnail_url': p.thumbnail_url,
            'is_featured': p.is_featured,
            'view_count': p.view_count,
            'like_count': p.like_count,
            'created_at': p.created_at.isoformat(),
        } for p in queryset]
        
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'display_name': user.display_name or user.username,
                'avatar_url': user.avatar_url or '',
                'bio': user.bio or '',
            },
            'portfolios': portfolios,
            'total': len(portfolios),
        })
