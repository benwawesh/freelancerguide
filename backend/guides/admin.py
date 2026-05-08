from django.contrib import admin
from .models import Tutorial, ExternalLink, HeroSettings, SocialLinks


class ExternalLinkInline(admin.TabularInline):
    """
    Inline admin for ExternalLink to edit links directly in Tutorial admin.
    """
    model = ExternalLink
    extra = 1
    fields = ('title', 'url', 'description')


@admin.register(Tutorial)
class TutorialAdmin(admin.ModelAdmin):
    """
    Admin interface for Tutorial model with inline external links.
    """
    list_display = ('title', 'category', 'is_published', 'order', 'created_at')
    list_filter = ('is_published', 'category', 'created_at')
    search_fields = ('title', 'description', 'content')
    ordering = ('order', '-created_at')
    readonly_fields = ('id', 'created_at', 'updated_at')
    
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'content')
        }),
        ('Media', {
            'fields': ('image_url',)
        }),
        ('Organization', {
            'fields': ('category', 'order', 'is_published')
        }),
        ('System Information', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [ExternalLinkInline]


@admin.register(ExternalLink)
class ExternalLinkAdmin(admin.ModelAdmin):
    """
    Admin interface for ExternalLink model.
    """
    list_display = ('title', 'tutorial', 'url', 'created_at')
    list_filter = ('tutorial', 'created_at')
    search_fields = ('title', 'url', 'tutorial__title')
    ordering = ('-created_at',)
    readonly_fields = ('id', 'created_at')


@admin.register(HeroSettings)
class HeroSettingsAdmin(admin.ModelAdmin):
    """
    Admin interface for HeroSettings model.
    Only one instance should exist.
    """
    list_display = ('button_text', 'button_enabled', 'updated_at')
    readonly_fields = ('id', 'updated_at')
    
    fieldsets = (
        ('Hero Button Configuration', {
            'fields': ('button_text', 'button_url', 'button_enabled')
        }),
        ('System Information', {
            'fields': ('id', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        # Only allow one HeroSettings instance
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)
    
    def has_delete_permission(self, request, obj=None):
        # Prevent deletion of the only HeroSettings instance
        return False


@admin.register(SocialLinks)
class SocialLinksAdmin(admin.ModelAdmin):
    """
    Admin interface for SocialLinks model.
    Only one instance should exist.
    """
    list_display = ('show_telegram', 'show_whatsapp', 'updated_at')
    readonly_fields = ('id', 'updated_at')
    
    fieldsets = (
        ('Telegram Settings', {
            'fields': ('telegram_url', 'show_telegram')
        }),
        ('WhatsApp Settings', {
            'fields': ('whatsapp_url', 'show_whatsapp')
        }),
        ('System Information', {
            'fields': ('id', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        # Only allow one SocialLinks instance
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)
    
    def has_delete_permission(self, request, obj=None):
        # Prevent deletion of the only SocialLinks instance
        return False
