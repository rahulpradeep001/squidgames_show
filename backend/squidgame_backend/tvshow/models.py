from django.db import models


class Episode(models.Model):
    title = models.CharField(max_length=255)
    about = models.TextField()
    telecast_date = models.DateField()
    image = models.ImageField(upload_to='episode_images/', null=True, blank=True)  # Add this line

    def __str__(self):
        return self.title


class Cast(models.Model):
    name = models.CharField(max_length=100)
    profile = models.URLField(max_length=200, blank=True)
    description = models.TextField()

    def __str__(self):
        return self.name


class Comment(models.Model):
    episode = models.ForeignKey('Episode', on_delete=models.CASCADE, related_name='comments')
    comment_name = models.CharField(max_length=100)
    content = models.TextField()
    comment_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content[:20]  # Display part of the comment



