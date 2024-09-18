from rest_framework import generics
from rest_framework import viewsets
from .models import Episode, Cast, Comment
from .serializers import EpisodeSerializer, CastSerializer, CommentSerializer
# Django example using Django REST Framework
from rest_framework import serializers, viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Comment

# Episode List and Detail Views
class EpisodeList(generics.ListCreateAPIView):
    queryset = Episode.objects.all()
    serializer_class = EpisodeSerializer

class EpisodeDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Episode.objects.all()
    serializer_class = EpisodeSerializer

# Cast List View
class CastList(generics.ListAPIView):
    queryset = Cast.objects.all()
    serializer_class = CastSerializer

class EpisodeViewSet(viewsets.ModelViewSet):
    queryset = Episode.objects.all()
    serializer_class = EpisodeSerializer

@api_view(['GET'])
def get_episode(request, episode_id):
    try:
        episode = Episode.objects.get(id=episode_id)
        serializer = EpisodeSerializer(episode)
        return Response(serializer.data)
    except Episode.DoesNotExist:
        return Response({'error': 'Episode not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST'])
def add_comment(request, episode_id):
    if request.method == 'GET':
        comments = Comment.objects.filter(episode_id=episode_id)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        try:
            episode = Episode.objects.get(id=episode_id)
        except Episode.DoesNotExist:
            return Response({'error': 'Episode not found'}, status=status.HTTP_404_NOT_FOUND)

        comment_name = request.data.get('comment_name')
        if not comment_name:
            return Response({'error': 'Comment name is required'}, status=status.HTTP_400_BAD_REQUEST)

        content = request.data.get('content')
        if not content:
            return Response({'error': 'Comment content is required'}, status=status.HTTP_400_BAD_REQUEST)

        comment = Comment.objects.create(episode=episode, comment_name=comment_name, content=content)
        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
