"""Event API Views"""
from django.shortcuts import get_object_or_404
from django.utils import timezone

from events.models import Event, EventTicket
from gamification.exp_rewards import award_event_creation_exp
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import check_event_creation_permission, get_plan_limits
from .serializers import (
    EventCreateSerializer,
    EventDetailSerializer,
    EventListSerializer,
    EventTicketSerializer,
    EventUpdateSerializer,
)


class EventListView(generics.ListAPIView):
    """イベント一覧取得API"""
    
    serializer_class = EventListSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        """クエリセット取得"""
        queryset = Event.objects.select_related('organizer').prefetch_related('tickets')
        
        # フィルタリング
        event_type = self.request.query_params.get('event_type')
        if event_type:
            queryset = queryset.filter(event_type=event_type)
        
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        is_free = self.request.query_params.get('is_free')
        if is_free is not None:
            queryset = queryset.filter(is_free=is_free.lower() == 'true')
        
        # 今後のイベントのみ表示（オプション）
        upcoming_only = self.request.query_params.get('upcoming')
        if upcoming_only and upcoming_only.lower() == 'true':
            queryset = queryset.filter(start_datetime__gte=timezone.now())
        
        # ソート
        ordering = self.request.query_params.get('ordering', '-created_at')
        queryset = queryset.order_by(ordering)
        
        return queryset


class EventDetailView(generics.RetrieveAPIView):
    """イベント詳細取得API"""
    
    queryset = Event.objects.select_related('organizer').prefetch_related('tickets')
    serializer_class = EventDetailSerializer
    permission_classes = [permissions.AllowAny]


class EventCreateView(generics.CreateAPIView):
    """イベント作成API"""
    
    serializer_class = EventCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        """作成前にプラン制限をチェック"""
        # リクエストデータから必要な情報を取得
        capacity = request.data.get('capacity')
        is_free = request.data.get('is_free', True)
        
        # プラン制限チェック
        allowed, error_message = check_event_creation_permission(
            request.user,
            capacity=capacity,
            is_free=is_free
        )
        
        if not allowed:
            return Response(
                {'detail': error_message},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # 制限をクリアした場合は通常の作成処理を実行
        return super().create(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        """作成時の処理"""
        event = serializer.save(organizer=self.request.user)
        
        # イベント作成でEXPを付与
        exp_result = award_event_creation_exp(self.request.user)
        
        # レスポンスにEXP情報を追加するため、eventにメタ情報を付与
        event._exp_reward = exp_result
        
        return event
    
    def create(self, request, *args, **kwargs):
        """作成処理（EXP情報をレスポンスに含める）"""
        # リクエストデータから必要な情報を取得
        capacity = request.data.get('capacity')
        is_free = request.data.get('is_free', True)
        
        # プラン制限チェック
        allowed, error_message = check_event_creation_permission(
            request.user,
            capacity=capacity,
            is_free=is_free
        )
        
        if not allowed:
            return Response(
                {'detail': error_message},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # 親クラスのcreateを呼び出し
        response = super().create(request, *args, **kwargs)
        
        # EXP情報を追加
        if hasattr(self, '_created_instance') and hasattr(self._created_instance, '_exp_reward'):
            response.data['exp_reward'] = self._created_instance._exp_reward
        
        return response
    
    def perform_create(self, serializer):
        """作成時の処理"""
        event = serializer.save(organizer=self.request.user)
        
        # イベント作成でEXPを付与
        exp_result = award_event_creation_exp(self.request.user)
        
        # インスタンスを保存してcreateメソッドで使えるように
        event._exp_reward = exp_result
        self._created_instance = event
        
        return event


class EventUpdateView(generics.UpdateAPIView):
    """イベント更新API"""
    
    queryset = Event.objects.all()
    serializer_class = EventUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """自分が作成したイベントのみ更新可能"""
        return Event.objects.filter(organizer=self.request.user)


class EventDeleteView(generics.DestroyAPIView):
    """イベント削除API"""
    
    queryset = Event.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """自分が作成したイベントのみ削除可能"""
        return Event.objects.filter(organizer=self.request.user)


class MyEventsView(generics.ListAPIView):
    """自分のイベント一覧取得API"""
    
    serializer_class = EventListSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """自分が作成したイベントのみ取得"""
        return Event.objects.filter(
            organizer=self.request.user
        ).select_related('organizer').prefetch_related('tickets').order_by('-created_at')


class EventTicketCreateView(generics.CreateAPIView):
    """イベントチケット作成API"""
    
    serializer_class = EventTicketSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        """チケット作成"""
        event_id = self.kwargs.get('event_id')
        event = get_object_or_404(Event, id=event_id, organizer=self.request.user)
        serializer.save(event=event)


class EventTicketUpdateView(generics.UpdateAPIView):
    """イベントチケット更新API"""
    
    serializer_class = EventTicketSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """自分が作成したイベントのチケットのみ更新可能"""
        event_id = self.kwargs.get('event_id')
        return EventTicket.objects.filter(event_id=event_id, event__organizer=self.request.user)


class EventTicketDeleteView(generics.DestroyAPIView):
    """イベントチケット削除API"""
    
    queryset = EventTicket.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """自分が作成したイベントのチケットのみ削除可能"""
        event_id = self.kwargs.get('event_id')
        return EventTicket.objects.filter(event_id=event_id, event__organizer=self.request.user)


class EventPublishView(APIView):
    """イベント公開API"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        """イベントを公開状態に変更"""
        event = get_object_or_404(Event, id=pk, organizer=request.user)
        
        if event.status == 'published':
            return Response(
                {'error': 'このイベントは既に公開されています。'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        event.status = 'published'
        event.save()
        
        serializer = EventDetailSerializer(event)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EventCancelView(APIView):
    """イベントキャンセルAPI"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        """イベントをキャンセル状態に変更"""
        event = get_object_or_404(Event, id=pk, organizer=request.user)
        
        if event.status == 'cancelled':
            return Response(
                {'error': 'このイベントは既にキャンセルされています。'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        event.status = 'cancelled'
        event.save()
        
        serializer = EventDetailSerializer(event)
        return Response(serializer.data, status=status.HTTP_200_OK)


class VenueRecommendationView(APIView):
    """会場推薦API"""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """会場推薦を取得"""
        capacity = request.data.get('capacity')
        location = request.data.get('location')
        purpose = request.data.get('purpose')
        
        if not all([capacity, location, purpose]):
            return Response(
                {'error': '収容人数、場所、用途は必須です。'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # モック会場データ（実際にはデータベースや外部APIから取得）
        venues = [
            {
                'name': '東京コンベンションセンター',
                'address': '東京都千代田区',
                'capacity': int(capacity) + 50,
                'rating': 4.5,
                'distance': '2.5km',
                'price_range': '¥50,000 - ¥100,000',
                'amenities': ['WiFi', 'プロジェクター', '駐車場'],
            },
            {
                'name': 'クリエイティブスペース渋谷',
                'address': '東京都渋谷区',
                'capacity': int(capacity) + 20,
                'rating': 4.2,
                'distance': '3.8km',
                'price_range': '¥30,000 - ¥60,000',
                'amenities': ['WiFi', '音響設備', 'ケータリング'],
            },
            {
                'name': 'アートギャラリー新宿',
                'address': '東京都新宿区',
                'capacity': int(capacity),
                'rating': 4.0,
                'distance': '5.2km',
                'price_range': '¥25,000 - ¥50,000',
                'amenities': ['展示スペース', '照明設備'],
            },
        ]
        
        return Response({'venues': venues}, status=status.HTTP_200_OK)


class EventSuccessPredictionView(APIView):
    """イベント成功率予測API"""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """イベント成功率を予測"""
        title = request.data.get('title', '')
        description = request.data.get('description', '')
        capacity = request.data.get('capacity', 0)
        start_date = request.data.get('start_date', '')
        is_free = request.data.get('is_free', True)
        
        if not all([title, capacity, start_date]):
            return Response(
                {'error': 'タイトル、収容人数、開始日は必須です。'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 成功率計算ロジック
        base_rate = 60
        factors = []
        
        # タイトルの長さ
        if 10 < len(title) < 50:
            base_rate += 10
            factors.append({
                'name': 'タイトルの長さ',
                'impact': 'positive',
                'description': '適切な長さのタイトルは注目を集めやすいです'
            })
        elif len(title) < 10:
            base_rate -= 5
            factors.append({
                'name': 'タイトルの長さ',
                'impact': 'negative',
                'description': 'タイトルが短すぎます'
            })
        
        # 収容人数
        try:
            cap = int(capacity)
            if 20 < cap < 100:
                base_rate += 5
                factors.append({
                    'name': '収容人数',
                    'impact': 'positive',
                    'description': '適切な規模で管理しやすいイベントです'
                })
            elif cap > 200:
                base_rate -= 5
                factors.append({
                    'name': '収容人数',
                    'impact': 'negative',
                    'description': '大規模イベントは運営が難しくなります'
                })
        except ValueError:
            pass
        
        # 開催日までの期間
        from datetime import datetime
        try:
            start_datetime = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            today = datetime.now(start_datetime.tzinfo)
            days_until_event = (start_datetime - today).days
            
            if days_until_event > 30:
                base_rate += 10
                factors.append({
                    'name': '準備期間',
                    'impact': 'positive',
                    'description': '十分な準備期間があります'
                })
            elif days_until_event < 7:
                base_rate -= 10
                factors.append({
                    'name': '準備期間',
                    'impact': 'negative',
                    'description': '準備期間が短すぎます'
                })
        except (ValueError, TypeError):
            pass
        
        # 説明文の充実度
        if len(description) > 100:
            base_rate += 5
            factors.append({
                'name': '説明文の充実度',
                'impact': 'positive',
                'description': '詳細な説明は参加者の信頼を得られます'
            })
        elif len(description) < 50:
            base_rate -= 3
            factors.append({
                'name': '説明文の充実度',
                'impact': 'negative',
                'description': '説明が不十分です'
            })
        
        # 無料イベント
        if is_free:
            base_rate += 8
            factors.append({
                'name': '参加費',
                'impact': 'positive',
                'description': '無料イベントは参加しやすいです'
            })
        
        # 最終的な成功率（20-95%の範囲）
        success_rate = min(95, max(20, base_rate))
        
        # 推奨事項
        recommendations = []
        if success_rate < 60:
            recommendations.append('開催日を延期して準備期間を確保することをお勧めします')
            recommendations.append('イベントの詳細説明を充実させましょう')
        try:
            if int(capacity) > 150:
                recommendations.append('大規模イベントの場合、スタッフを増員することを検討してください')
        except ValueError:
            pass
        if len(description) < 50:
            recommendations.append('イベントの魅力を伝える詳細な説明を追加しましょう')
        
        if not recommendations:
            recommendations.append('現在の設定は良好です！')
        
        return Response({
            'success_rate': success_rate,
            'factors': factors,
            'recommendations': recommendations
        }, status=status.HTTP_200_OK)


class FinancialProjectionView(APIView):
    """イベント収支予測API"""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """
        収支予測を計算
        
        リクエストパラメータ:
        - capacity: 収容人数
        - ticket_price: チケット価格
        - venue_cost: 会場費
        - marketing_cost: 宣伝費
        - other_costs: その他費用
        - is_free: 無料イベントかどうか
        """
        capacity = request.data.get('capacity', 0)
        ticket_price = request.data.get('ticket_price', 0)
        venue_cost = request.data.get('venue_cost', 0)
        marketing_cost = request.data.get('marketing_cost', 0)
        other_costs = request.data.get('other_costs', 0)
        is_free = request.data.get('is_free', True)
        
        try:
            capacity = int(capacity)
            ticket_price = float(ticket_price)
            venue_cost = float(venue_cost)
            marketing_cost = float(marketing_cost)
            other_costs = float(other_costs)
        except (ValueError, TypeError):
            return Response(
                {'error': '数値の入力が正しくありません。'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 集客数の計算ロジック:
        # ====================================
        # イベント主催者（ユーザー）のファン動向から集客数を予測
        # 
        # 計算要素:
        # 1. ファン数: 主催者の総ファン数
        # 2. イベント参加率: ファンがイベントに参加する確率（5-15%）
        # 3. 過去のイベント実績: 主催者の過去イベント参加率
        # 4. 収容人数の制約: 計算結果が収容人数を超えない
        # 
        # 計算式:
        # 基本集客数 = ファン数 × イベント参加率
        # 最終集客数 = min(基本集客数, 収容人数)
        # 
        # イベント参加率の決定要因:
        # - ファン数 < 100: 15% (小規模コミュニティは参加率が高い)
        # - ファン数 100-1000: 10% (中規模コミュニティ)
        # - ファン数 > 1000: 5% (大規模コミュニティは参加率が低下)
        
        # ユーザーのファン情報を取得
        user = request.user if request.user.is_authenticated else None
        fan_count = 0
        if user:
            fan_count = user.fan_count
        
        # 過去のイベント実績を取得
        past_events_count = 0
        avg_attendance_rate = 0
        if user:
            # ユーザーが主催した過去のイベント数
            past_events = Event.objects.filter(
                organizer=user,
                status='published',
                start_datetime__lt=timezone.now()
            )
            past_events_count = past_events.count()
            
            # 過去イベントの平均参加率を計算（実装例）
            # 注: 実際の参加者データがない場合は推定値を使用
            if past_events_count > 0:
                # 経験値ボーナス: 過去イベントが多いほど参加率が向上
                experience_bonus = min(past_events_count * 0.01, 0.05)  # 最大5%アップ
            else:
                experience_bonus = 0
        else:
            experience_bonus = 0
        
        # ファン数に基づくイベント参加率を計算
        if fan_count == 0:
            # ファンがいない場合は収容人数の30%を基準（一般公募想定）
            base_participation_rate = 0.30
            expected_attendance = int(capacity * base_participation_rate)
            calculation_method = "ファン数0名: 一般公募を想定し収容人数の30%"
        elif fan_count < 100:
            # 小規模コミュニティ: 高い参加率
            base_participation_rate = 0.15
            expected_attendance = int(fan_count * (base_participation_rate + experience_bonus))
            calculation_method = f"小規模コミュニティ(ファン{fan_count}名): 参加率{int((base_participation_rate + experience_bonus)*100)}%"
        elif fan_count < 1000:
            # 中規模コミュニティ
            base_participation_rate = 0.10
            expected_attendance = int(fan_count * (base_participation_rate + experience_bonus))
            calculation_method = f"中規模コミュニティ(ファン{fan_count}名): 参加率{int((base_participation_rate + experience_bonus)*100)}%"
        else:
            # 大規模コミュニティ
            base_participation_rate = 0.05
            expected_attendance = int(fan_count * (base_participation_rate + experience_bonus))
            calculation_method = f"大規模コミュニティ(ファン{fan_count}名): 参加率{int((base_participation_rate + experience_bonus)*100)}%"
        
        # 経験値ボーナスの情報を追加
        if past_events_count > 0:
            calculation_method += f" + 経験値ボーナス{int(experience_bonus*100)}% (過去{past_events_count}回開催)"
        
        # 収容人数の制約を適用
        if expected_attendance > capacity:
            expected_attendance = capacity
            calculation_method += f" → 収容人数上限により{capacity}名に調整"
        
        # 最低1人は想定
        expected_attendance = max(1, expected_attendance)
        
        total_revenue = 0 if is_free else expected_attendance * ticket_price
        
        # 総コスト
        total_costs = venue_cost + marketing_cost + other_costs
        
        # 利益
        profit = total_revenue - total_costs
        
        # 損益分岐点
        break_even_attendance = 0
        if ticket_price > 0:
            break_even_attendance = int(total_costs / ticket_price) + 1
        
        # 利益率
        profit_margin = 0
        if total_revenue > 0:
            profit_margin = (profit / total_revenue) * 100
        
        # 警告メッセージ
        warnings = []
        if profit < 0:
            warnings.append('⚠️ 赤字が予想されます。コストの削減またはチケット価格の見直しを検討してください。')
        if break_even_attendance > capacity:
            warnings.append('⚠️ 損益分岐点が収容人数を超えています。価格設定を見直してください。')
        if total_costs == 0:
            warnings.append('ℹ️ コストが入力されていません。正確な予測のためコストを入力してください。')
        if not is_free and ticket_price == 0:
            warnings.append('ℹ️ チケット価格が0円です。無料イベントの場合はチェックボックスをオンにしてください。')
        
        if not warnings:
            warnings.append('✅ 良好な収支計画です！')
        
        return Response({
            'total_revenue': total_revenue,
            'total_costs': total_costs,
            'profit': profit,
            'break_even_attendance': break_even_attendance,
            'profit_margin': profit_margin,
            'expected_attendance': expected_attendance,
            'warnings': warnings,
            'fan_count': fan_count,
            'calculation_method': calculation_method,
            'past_events_count': past_events_count
        }, status=status.HTTP_200_OK)


class EventCompleteView(APIView):
    """イベント完了API（参加者数を記録してEXP付与）"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, event_id):
        """
        イベントを完了状態にして、参加率に応じたEXPを付与
        
        Request Body:
        {
            "actual_attendance": 45  // 実際の参加者数
        }
        """
        from gamification.exp_rewards import award_event_success_exp

        # イベント取得
        event = get_object_or_404(Event, id=event_id)
        
        # 権限チェック（主催者のみ）
        if event.organizer != request.user:
            return Response(
                {'detail': 'イベント主催者のみが完了処理を実行できます。'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # 既に完了済みかチェック
        if event.status == 'completed':
            return Response(
                {'detail': 'このイベントは既に完了しています。'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 実際の参加者数を取得
        actual_attendance = request.data.get('actual_attendance')
        if actual_attendance is None:
            return Response(
                {'detail': 'actual_attendanceを指定してください。'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            actual_attendance = int(actual_attendance)
            if actual_attendance < 0:
                raise ValueError('参加者数は0以上である必要があります。')
        except (ValueError, TypeError) as e:
            return Response(
                {'detail': f'無効な参加者数: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 参加率を計算
        capacity = event.capacity or 1
        attendance_rate = actual_attendance / capacity
        
        # EXP付与
        exp_result = award_event_success_exp(request.user, attendance_rate)
        
        # イベントのステータスを更新
        event.status = 'completed'
        event.save(update_fields=['status'])
        
        return Response({
            'message': 'イベントが完了しました！',
            'event': {
                'id': event.id,
                'title': event.title,
                'status': event.status,
                'capacity': capacity,
                'actual_attendance': actual_attendance,
                'attendance_rate': round(attendance_rate * 100, 2),
            },
            'exp_reward': exp_result
        }, status=status.HTTP_200_OK)


class UserPlanLimitsView(APIView):
    """ユーザーのプラン制限情報を取得"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """プラン制限情報を返す"""
        from datetime import datetime
        
        user = request.user
        subscription_plan = getattr(user, 'subscription', 'free') or \
                           getattr(user, 'subscription_plan', 'free') or \
                           getattr(user, 'subscription_type', 'free')
        
        limits = get_plan_limits(subscription_plan)
        
        # 今月作成したイベント数を取得
        now = datetime.now()
        first_day_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        events_this_month = Event.objects.filter(
            organizer=user,
            created_at__gte=first_day_of_month
        ).count()
        
        # 残り作成可能数を計算
        remaining_events = None
        if limits['max_events_per_month'] is not None:
            remaining_events = max(0, limits['max_events_per_month'] - events_this_month)
        
        return Response({
            'subscription_plan': subscription_plan,
            'max_events_per_month': limits['max_events_per_month'],
            'events_created_this_month': events_this_month,
            'remaining_events_this_month': remaining_events,
            'max_capacity': limits['max_capacity'],
            'can_use_paid_events': limits['can_use_paid_events'],
            'can_use_advanced_features': limits['can_use_advanced_features'],
            'description': limits['description'],
        }, status=status.HTTP_200_OK)
