from django.urls import path
from .views import (
    post_list_create,
    post_detail,
    like_post,
    comment_list_create,
    comment_detail,
    my_posts
)

urlpatterns = [
    path('posts/', post_list_create, name='post-list-create'),
    path('posts/<int:pk>/', post_detail, name='post-detail'),
    path('posts/<int:pk>/like/', like_post, name='post-like'),
    path('posts/<int:post_id>/comments/', comment_list_create, name='comment-list-create'),
    path('comments/<int:pk>/', comment_detail, name='comment-detail'),
    path('my-posts/', my_posts, name='my-posts')
]
