import json
from rest_framework import serializers
from .models import Tutorial, ExternalLink, HeroSettings, SocialLinks


class ExternalLinkSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(format='hex_verbose', read_only=True)

    class Meta:
        model = ExternalLink
        fields = ['id', 'title', 'url', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']


class TutorialSerializer(serializers.ModelSerializer):
    """
    Serializer for Tutorial model with nested external links.
    """
    id = serializers.UUIDField(format='hex_verbose')
    image = serializers.ImageField(use_url=True, required=False, allow_null=True)
    external_links = ExternalLinkSerializer(many=True, read_only=True)
    
    class Meta:
        model = Tutorial
        fields = [
            'id', 'title', 'description', 'content', 
            'image', 'youtube_url', 'category', 'is_published', 
            'is_featured', 'order', 'created_at', 'updated_at', 
            'external_links'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TutorialListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for listing tutorials without full content.
    """
    id = serializers.UUIDField(format='hex_verbose')
    image = serializers.ImageField(use_url=True, required=False, allow_null=True)
    link_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Tutorial
        fields = [
            'id', 'title', 'description', 'image', 
            'category', 'is_published', 'is_featured',
            'order', 'created_at', 'link_count'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_link_count(self, obj):
        """Return the count of external links for this tutorial."""
        return obj.external_links.count()


class TutorialCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating tutorials with file uploads.
    """
    id = serializers.UUIDField(format='hex_verbose', read_only=True)
    image = serializers.ImageField(required=False, allow_null=True)
    external_links_data = ExternalLinkSerializer(many=True, write_only=True, required=False)
    
    class Meta:
        model = Tutorial
        fields = [
            'id', 'title', 'description', 'content', 
            'image', 'youtube_url', 'category', 'is_published', 
            'is_featured', 'order', 'external_links_data'
        ]
    
    def to_internal_value(self, data):
        # When sent as multipart/form-data, external_links_data arrives as a JSON string
        if 'external_links_data' in data and isinstance(data.get('external_links_data'), str):
            try:
                parsed = json.loads(data['external_links_data'])
                data = data.copy()
                data['external_links_data'] = parsed
            except (json.JSONDecodeError, TypeError):
                pass
        return super().to_internal_value(data)

    def create(self, validated_data):
        """Create tutorial with associated external links."""
        external_links_data = validated_data.pop('external_links_data', [])
        tutorial = Tutorial.objects.create(**validated_data)
        
        for link_data in external_links_data:
            ExternalLink.objects.create(tutorial=tutorial, **link_data)
        
        return tutorial
    
    def update(self, instance, validated_data):
        """Update tutorial and manage external links."""
        external_links_data = validated_data.pop('external_links_data', None)
        
        # Update tutorial fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Handle external links if provided
        if external_links_data is not None:
            # Delete existing links
            instance.external_links.all().delete()
            # Create new links
            for link_data in external_links_data:
                ExternalLink.objects.create(tutorial=instance, **link_data)
        
        return instance


class HeroSettingsSerializer(serializers.ModelSerializer):
    """
    Serializer for HeroSettings model.
    """
    id = serializers.UUIDField(format='hex_verbose', read_only=True)

    class Meta:
        model = HeroSettings
        fields = ['id', 'button_text', 'button_url', 'button_enabled', 'updated_at']
        read_only_fields = ['id', 'updated_at']


class SocialLinksSerializer(serializers.ModelSerializer):
    """
    Serializer for SocialLinks model.
    """
    id = serializers.UUIDField(format='hex_verbose', read_only=True)

    class Meta:
        model = SocialLinks
        fields = ['id', 'telegram_url', 'whatsapp_url', 'show_telegram', 'show_whatsapp', 'updated_at']
        read_only_fields = ['id', 'updated_at']
