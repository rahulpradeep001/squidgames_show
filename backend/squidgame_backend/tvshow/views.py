from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from django.core.cache import cache
from .models import Episode, Cast, Comment
from .serializers import EpisodeSerializer, CastSerializer, CommentSerializer
import logging

logger = logging.getLogger(__name__)


class CommentRateThrottle(AnonRateThrottle):
    """Custom throttle for comment submissions"""
    rate = '10/hour'
    scope = 'comment'


class EpisodeList(generics.ListCreateAPIView):
    """
    List all episodes or create a new episode.
    GET: Public access
    POST: Authenticated users only
    """
    queryset = Episode.objects.all()
    serializer_class = EpisodeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_fields = ['title', 'telecast_date']
    search_fields = ['title', 'about']
    ordering_fields = ['telecast_date', 'created_at']
    ordering = ['-telecast_date']

    def get_queryset(self):
        """Optimize queryset with prefetch"""
        return Episode.objects.prefetch_related('comments').all()


class EpisodeDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete an episode.
    GET: Public access
    PUT/PATCH/DELETE: Authenticated users only
    """
    queryset = Episode.objects.all()
    serializer_class = EpisodeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """Optimize queryset with prefetch"""
        return Episode.objects.prefetch_related('comments').all()

    def retrieve(self, request, *args, **kwargs):
        """Add caching for episode retrieval"""
        episode_id = kwargs.get('pk')
        cache_key = f'episode_{episode_id}'

        # Try to get from cache
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)

        # If not in cache, get from database
        response = super().retrieve(request, *args, **kwargs)

        # Cache for 5 minutes
        cache.set(cache_key, response.data, 300)

        return response

    def perform_update(self, serializer):
        """Clear cache when episode is updated"""
        episode_id = serializer.instance.id
        cache_key = f'episode_{episode_id}'
        cache.delete(cache_key)
        serializer.save()
        logger.info(f"Episode {episode_id} updated by {self.request.user}")

    def perform_destroy(self, instance):
        """Clear cache and log when episode is deleted"""
        episode_id = instance.id
        cache_key = f'episode_{episode_id}'
        cache.delete(cache_key)
        logger.warning(f"Episode {episode_id} deleted by {self.request.user}")
        instance.delete()


class CastList(generics.ListAPIView):
    """
    List all cast members.
    Read-only endpoint with caching.
    """
    queryset = Cast.objects.all()
    serializer_class = CastSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        """Add caching for cast list"""
        cache_key = 'cast_list'

        # Try to get from cache
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)

        # If not in cache, get from database
        response = super().list(request, *args, **kwargs)

        # Cache for 10 minutes
        cache.set(cache_key, response.data, 600)

        return response


@api_view(['GET', 'POST'])
@throttle_classes([CommentRateThrottle])
def add_comment(request, episode_id):
    """
    GET: Retrieve all comments for an episode
    POST: Add a new comment to an episode (rate limited)
    """
    if request.method == 'GET':
        # Get approved comments only, optimized with select_related
        comments = Comment.objects.filter(
            episode_id=episode_id,
            is_approved=True
        ).select_related('episode').order_by('-comment_date')

        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        try:
            episode = Episode.objects.get(id=episode_id)
        except Episode.DoesNotExist:
            logger.warning(f"Attempt to comment on non-existent episode {episode_id}")
            return Response(
                {'error': 'Episode not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Create comment with data validation
        serializer = CommentSerializer(data={
            'episode': episode_id,
            'comment_name': request.data.get('comment_name'),
            'content': request.data.get('content'),
        })

        if serializer.is_valid():
            comment = serializer.save()
            logger.info(f"New comment added to episode {episode_id} by {comment.comment_name}")

            # Clear episode cache since comment count changed
            cache_key = f'episode_{episode_id}'
            cache.delete(cache_key)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        logger.warning(f"Invalid comment submission: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
