from django.db import models
from django.core.validators import FileExtensionValidator, MinLengthValidator
from django.core.exceptions import ValidationError
from django.conf import settings
import os


def validate_image_size(image):
    """Validate that uploaded image doesn't exceed max size"""
    if image.size > settings.MAX_IMAGE_SIZE:
        raise ValidationError(f'Image file too large ( > {settings.MAX_IMAGE_SIZE / (1024*1024)}MB )')


class Episode(models.Model):
    title = models.CharField(
        max_length=255,
        validators=[MinLengthValidator(1)]
    )
    about = models.TextField(
        max_length=5000,
        validators=[MinLengthValidator(10)]
    )
    telecast_date = models.DateField()
    image = models.ImageField(
        upload_to='episode_images/',
        null=True,
        blank=True,
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif', 'webp']),
            validate_image_size
        ]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-telecast_date']
        indexes = [
            models.Index(fields=['-telecast_date']),
            models.Index(fields=['title']),
        ]

    def __str__(self):
        return self.title


class Cast(models.Model):
    name = models.CharField(
        max_length=100,
        validators=[MinLengthValidator(2)]
    )
    profile = models.URLField(max_length=500, blank=True)
    description = models.TextField(
        max_length=2000,
        validators=[MinLengthValidator(10)]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['name']),
        ]
        verbose_name_plural = "Cast"

    def __str__(self):
        return self.name


class Comment(models.Model):
    episode = models.ForeignKey(
        'Episode',
        on_delete=models.CASCADE,
        related_name='comments'
    )
    comment_name = models.CharField(
        max_length=100,
        validators=[MinLengthValidator(2)]
    )
    content = models.TextField(
        max_length=2000,
        validators=[MinLengthValidator(5)]
    )
    comment_date = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=True)

    class Meta:
        ordering = ['-comment_date']
        indexes = [
            models.Index(fields=['episode', '-comment_date']),
            models.Index(fields=['-comment_date']),
        ]

    def __str__(self):
        return f"{self.comment_name}: {self.content[:50]}"
