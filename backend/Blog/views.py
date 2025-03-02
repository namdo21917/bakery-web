from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from .models import Post, Comment
from Web.models import User
from .serializers import PostSerializer, CommentSerializer


# @api_view(['GET', 'POST'])
# def post_list_create(request):
#     if request.method == 'GET':
#         posts = Post.objects.all().order_by('-created_at')
#         serializer = PostSerializer(posts, many=True)
#         return Response({
#             'posts': serializer.data
#         })

#     elif request.method == 'POST':
#         # Sử dụng permission IsAuthenticated chỉ cho POST
#         @permission_classes([IsAuthenticated])
#         def post_create(request):
#             serializer = PostSerializer(data=request.data)
#             if serializer.is_valid():
#                 serializer.save(author=request.user)
#                 return Response(serializer.data, status=status.HTTP_201_CREATED)
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#         return post_create(request)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def post_list_create(request):
    if request.method == 'GET':
        posts = Post.objects.all().order_by('-created_at')
        serializer = PostSerializer(posts, many=True)
        return Response({'posts': serializer.data})

    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return Response({'error': 'Bạn phải đăng nhập để đăng bài.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
@api_view(['GET', 'PUT', 'DELETE'])
# @permission_classes([IsAuthenticatedOrReadOnly])
def post_detail(request, pk):
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PostSerializer(post)
        return Response(serializer.data)

    elif request.method == 'PUT':
        if post.author != request.user and not request.user.is_staff:
            return Response({'error': 'You do not have permission to edit this post.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if post.author != request.user and not request.user.is_staff:
            return Response({'error': 'You do not have permission to delete this post.'}, status=status.HTTP_403_FORBIDDEN)

        post.delete()
        return Response({'message': 'Post deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Buộc người dùng phải đăng nhập mới có thể thích bài viết
def like_post(request, pk):
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.user in post.liked_by.all():
        post.liked_by.remove(request.user)
        message = 'You unliked this post'
    else:
        post.liked_by.add(request.user)
        message = 'You liked this post'
    
    # Lấy danh sách người dùng đã thích bài viết
    liked_by_users = post.liked_by.values('username')
    # Trả về message và danh sách liked_by
    return Response({
        'message': message,
        'liked_by': liked_by_users
    }, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
def comment_list_create(request, post_id):
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        comments = Comment.objects.filter(post=post).order_by('-created_at')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return Response({'error': 'Bạn phải đăng nhập để bình luận!'}, status=status.HTTP_403_FORBIDDEN)    #Yêu cầu đăng nhập để bình luận
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user, post=post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
# @permission_classes([IsAuthenticatedOrReadOnly])
def comment_detail(request, pk):
    try:
        comment = Comment.objects.get(pk=pk)
    except Comment.DoesNotExist:
        return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CommentSerializer(comment)
        return Response(serializer.data)

    elif request.method == 'PUT':
        if comment.author != request.user and not request.user.is_staff:
            return Response({'error': 'You do not have permission to edit this comment.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if comment.author != request.user and not request.user.is_staff:
            return Response({'error': 'You do not have permission to delete this comment.'}, status=status.HTTP_403_FORBIDDEN)

        comment.delete()
        return Response({'message': 'Comment deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

# Danh sách bài viết của riêng người dùng
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_posts(request):
    # Lấy thông tin người dùng đang đăng nhập
    user = request.user
    
    # Lọc các bài viết theo tác giả
    posts = Post.objects.filter(author=user).order_by('-created_at')  # Sắp xếp theo thời gian mới nhất
    
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)    

