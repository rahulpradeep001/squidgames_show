from rest_framework import serializers
from .models import Episode, Cast, Comment
import bleach
import re


class EpisodeSerializer(serializers.ModelSerializer):
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Episode
        fields = ['id', 'title', 'about', 'telecast_date', 'image', 'comments_count', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def get_comments_count(self, obj):
        return obj.comments.filter(is_approved=True).count()

    def validate_title(self, value):
        """Validate and sanitize title"""
        if not value or not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")

        # Remove excessive whitespace
        value = ' '.join(value.split())

        # Check for reasonable length
        if len(value) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long.")
        if len(value) > 255:
            raise serializers.ValidationError("Title must not exceed 255 characters.")

        return value

    def validate_about(self, value):
        """Validate and sanitize about field"""
        if not value or not value.strip():
            raise serializers.ValidationError("About field cannot be empty.")

        # Sanitize HTML to prevent XSS
        allowed_tags = ['p', 'br', 'strong', 'em', 'u']
        value = bleach.clean(value, tags=allowed_tags, strip=True)

        if len(value) < 10:
            raise serializers.ValidationError("About must be at least 10 characters long.")
        if len(value) > 5000:
            raise serializers.ValidationError("About must not exceed 5000 characters.")

        return value


class CastSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cast
        fields = ['id', 'name', 'profile', 'description', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate_name(self, value):
        """Validate and sanitize name"""
        if not value or not value.strip():
            raise serializers.ValidationError("Name cannot be empty.")

        value = ' '.join(value.split())

        if len(value) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        if len(value) > 100:
            raise serializers.ValidationError("Name must not exceed 100 characters.")

        # Only allow letters, spaces, hyphens, and apostrophes
        if not re.match(r"^[a-zA-Z\s\-']+$", value):
            raise serializers.ValidationError("Name can only contain letters, spaces, hyphens, and apostrophes.")

        return value

    def validate_description(self, value):
        """Validate and sanitize description"""
        if not value or not value.strip():
            raise serializers.ValidationError("Description cannot be empty.")

        # Sanitize HTML
        allowed_tags = ['p', 'br', 'strong', 'em', 'u']
        value = bleach.clean(value, tags=allowed_tags, strip=True)

        if len(value) < 10:
            raise serializers.ValidationError("Description must be at least 10 characters long.")
        if len(value) > 2000:
            raise serializers.ValidationError("Description must not exceed 2000 characters.")

        return value


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'comment_name', 'episode', 'content', 'comment_date', 'is_approved']
        read_only_fields = ['comment_date', 'is_approved']

    def validate_comment_name(self, value):
        """Validate and sanitize comment name"""
        if not value or not value.strip():
            raise serializers.ValidationError("Name cannot be empty.")

        value = ' '.join(value.split())

        if len(value) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        if len(value) > 100:
            raise serializers.ValidationError("Name must not exceed 100 characters.")

        # Prevent script injection in name
        if '<' in value or '>' in value or 'script' in value.lower():
            raise serializers.ValidationError("Invalid characters in name.")

        return value

    def validate_content(self, value):
        """Validate and sanitize comment content"""
        if not value or not value.strip():
            raise serializers.ValidationError("Comment cannot be empty.")

        # Strip all HTML tags for comments (no HTML allowed)
        value = bleach.clean(value, tags=[], strip=True)

        if len(value) < 5:
            raise serializers.ValidationError("Comment must be at least 5 characters long.")
        if len(value) > 2000:
            raise serializers.ValidationError("Comment must not exceed 2000 characters.")

        # Check for spam patterns (repeated characters)
        if re.search(r'(.)\1{10,}', value):
            raise serializers.ValidationError("Comment contains suspicious patterns.")

        return value
