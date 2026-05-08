import uuid
from django.db import models


class Tutorial(models.Model):
    """
    Tutorial guide model with UUID primary key.
    Contains freelance tutorial information and external links.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(help_text="Short description for the guide list")
    content = models.TextField(help_text="Full content of the tutorial guide")
    image = models.ImageField(upload_to='guide_images/', blank=True, null=True, help_text="Upload guide image (max 20MB)")
    youtube_url = models.URLField(blank=True, null=True, help_text="YouTube video URL for embedding")
    category = models.CharField(max_length=100, blank=True, null=True, help_text="Optional category for organization")
    is_published = models.BooleanField(default=True, help_text="Whether the guide is visible to public")
    is_featured = models.BooleanField(default=False, help_text="Feature this guide in the hero section (only one at a time)")
    order = models.IntegerField(default=0, help_text="Order for sorting guides")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tutorials'
        ordering = ['order', '-created_at']
        verbose_name = 'Tutorial'
        verbose_name_plural = 'Tutorials'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # Ensure only one guide is featured at a time
        if self.is_featured:
            Tutorial.objects.filter(is_featured=True).exclude(id=self.id).update(is_featured=False)
        super().save(*args, **kwargs)


class ExternalLink(models.Model):
    """
    External links associated with tutorials.
    Each tutorial can have multiple external links.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tutorial = models.ForeignKey(
        Tutorial,
        on_delete=models.CASCADE,
        related_name='external_links'
    )
    title = models.CharField(max_length=255, help_text="Link text/title")
    url = models.URLField(help_text="The actual URL to link to")
    description = models.TextField(blank=True, null=True, help_text="Optional description for the link")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'external_links'
        ordering = ['id']
        verbose_name = 'External Link'
        verbose_name_plural = 'External Links'

    def __str__(self):
        return f"{self.title} - {self.tutorial.title}"


class HeroSettings(models.Model):
    """
    Settings for the hero section, including the dynamic button configuration.
    Only one instance should exist - managed by the admin.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    button_text = models.CharField(
        max_length=100, 
        default="Get Started",
        help_text="Text displayed on the hero button"
    )
    button_url = models.URLField(
        default="https://example.com",
        help_text="External URL the hero button links to"
    )
    button_enabled = models.BooleanField(
        default=True,
        help_text="Whether to show the button in the hero section"
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'hero_settings'
        verbose_name = 'Hero Settings'
        verbose_name_plural = 'Hero Settings'

    def __str__(self):
        return f"Hero Settings ({self.button_text})"
    
    @classmethod
    def get_settings(cls):
        """Get the singleton hero settings instance, creating if needed."""
        obj, created = cls.objects.get_or_create(
            id='00000000-0000-0000-0000-000000000001'
        )
        return obj


class SocialLinks(models.Model):
    """
    Social media links for the navbar.
    Only one instance should exist - managed by the admin.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    telegram_url = models.URLField(
        blank=True,
        null=True,
        help_text="Telegram group or channel link (e.g., https://t.me/yourchannel)"
    )
    whatsapp_url = models.URLField(
        blank=True,
        null=True,
        help_text="WhatsApp link for messaging or group (e.g., https://wa.me/1234567890)"
    )
    show_telegram = models.BooleanField(
        default=False,
        help_text="Whether to show the Telegram icon in the navbar"
    )
    show_whatsapp = models.BooleanField(
        default=False,
        help_text="Whether to show the WhatsApp icon in the navbar"
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'social_links'
        verbose_name = 'Social Links'
        verbose_name_plural = 'Social Links'

    def __str__(self):
        return "Social Links Settings"
    
    @classmethod
    def get_settings(cls):
        """Get the singleton social links instance, creating if needed."""
        obj, created = cls.objects.get_or_create(
            id='00000000-0000-0000-0000-000000000002'
        )
        return obj
