"""Event Serializers"""
from decimal import Decimal
from rest_framework import serializers
from events.models import Event, EventTicket


class EventTicketSerializer(serializers.ModelSerializer):
    """EventTicket Serializer"""
    
    available_quantity = serializers.SerializerMethodField()
    
    class Meta:
        model = EventTicket
        fields = [
            'id',
            'ticket_type',
            'price',
            'quantity',
            'sold_quantity',
            'available_quantity',
            'is_active',
            'created_at',
        ]
        read_only_fields = ['id', 'sold_quantity', 'created_at']
    
    def get_available_quantity(self, obj):
        """利用可能なチケット数を取得"""
        return obj.quantity - obj.sold_quantity


class EventListSerializer(serializers.ModelSerializer):
    """Event List Serializer (一覧表示用)"""
    
    organizer_name = serializers.CharField(source='organizer.username', read_only=True)
    tickets_count = serializers.SerializerMethodField()
    is_sold_out = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'description',
            'event_type',
            'venue_name',
            'start_datetime',
            'end_datetime',
            'timezone',
            'capacity',
            'is_free',
            'status',
            'organizer_name',
            'tickets_count',
            'is_sold_out',
            'created_at',
        ]
        read_only_fields = ['id', 'organizer_name', 'created_at']
    
    def get_tickets_count(self, obj):
        """チケット種類数を取得"""
        return obj.tickets.filter(is_active=True).count()
    
    def get_is_sold_out(self, obj):
        """売り切れかどうかを判定"""
        if obj.is_free:
            return False
        tickets = obj.tickets.filter(is_active=True)
        if not tickets.exists():
            return False
        return all(ticket.sold_quantity >= ticket.quantity for ticket in tickets)


class EventDetailSerializer(serializers.ModelSerializer):
    """Event Detail Serializer (詳細表示用)"""
    
    organizer_name = serializers.CharField(source='organizer.username', read_only=True)
    organizer_id = serializers.IntegerField(source='organizer.id', read_only=True)
    tickets = EventTicketSerializer(many=True, read_only=True)
    
    class Meta:
        model = Event
        fields = [
            'id',
            'organizer_id',
            'organizer_name',
            'title',
            'description',
            'event_type',
            'venue_name',
            'venue_address',
            'start_datetime',
            'end_datetime',
            'timezone',
            'capacity',
            'is_free',
            'status',
            'tickets',
            'created_at',
        ]
        read_only_fields = ['id', 'organizer_id', 'organizer_name', 'created_at']


class EventCreateSerializer(serializers.ModelSerializer):
    """Event Create Serializer (作成用)"""
    
    tickets = EventTicketSerializer(many=True, required=False)
    
    class Meta:
        model = Event
        fields = [
            'title',
            'description',
            'event_type',
            'venue_name',
            'venue_address',
            'start_datetime',
            'end_datetime',
            'timezone',
            'capacity',
            'is_free',
            'status',
            'tickets',
        ]
    
    def validate(self, data):
        """バリデーション"""
        if data.get('end_datetime') and data.get('start_datetime'):
            if data['end_datetime'] <= data['start_datetime']:
                raise serializers.ValidationError({
                    'end_datetime': '終了日時は開始日時より後である必要があります。'
                })
        
        if data.get('event_type') == 'venue' and not data.get('venue_name'):
            raise serializers.ValidationError({
                'venue_name': '会場イベントの場合、会場名は必須です。'
            })
        
        return data
    
    def create(self, validated_data):
        """イベント作成"""
        tickets_data = validated_data.pop('tickets', [])
        event = Event.objects.create(**validated_data)
        
        # チケットを作成
        for ticket_data in tickets_data:
            EventTicket.objects.create(event=event, **ticket_data)
        
        return event


class EventUpdateSerializer(serializers.ModelSerializer):
    """Event Update Serializer (更新用)"""
    
    class Meta:
        model = Event
        fields = [
            'title',
            'description',
            'event_type',
            'venue_name',
            'venue_address',
            'start_datetime',
            'end_datetime',
            'timezone',
            'capacity',
            'is_free',
            'status',
        ]
    
    def validate(self, data):
        """バリデーション"""
        instance = self.instance
        start_datetime = data.get('start_datetime', instance.start_datetime)
        end_datetime = data.get('end_datetime', instance.end_datetime)
        
        if end_datetime <= start_datetime:
            raise serializers.ValidationError({
                'end_datetime': '終了日時は開始日時より後である必要があります。'
            })
        
        event_type = data.get('event_type', instance.event_type)
        venue_name = data.get('venue_name', instance.venue_name)
        
        if event_type == 'venue' and not venue_name:
            raise serializers.ValidationError({
                'venue_name': '会場イベントの場合、会場名は必須です。'
            })
        
        return data
