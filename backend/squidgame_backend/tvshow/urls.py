from django.urls import path
from .views import EpisodeList, EpisodeDetail, CastList, add_comment

urlpatterns = [
    # Endpoint for listing all episodes and creating a new episode
    path('episodes/', EpisodeList.as_view(), name='episode-list'),

    # Endpoint for retrieving, updating, or deleting a specific episode
    path('episodes/<int:pk>/', EpisodeDetail.as_view(), name='episode-detail'),

    # Endpoint for listing and creating comments related to a specific episode
   path('episodes/<int:episode_id>/comments/', add_comment, name='add_comment'),

    # Endpoint for listing all cast members
    path('cast/', CastList.as_view(), name='cast-list'),
]
