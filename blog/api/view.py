# blog/views.py
from rest_framework import viewsets
from blog import models
from .serializer import CategorySerializer, PostSerializer, AttachmentSerializer, CommentSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = models.Category.objects.all()
    serializer_class = CategorySerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = models.Post.objects.filter(published=True).order_by('-created_at')
    serializer_class = PostSerializer


class AttachmentViewSet(viewsets.ModelViewSet):
    queryset = models.Attachment.objects.all()
    serializer_class = AttachmentSerializer


class CommentViewSet(viewsets.ModelViewSet):
    queryset = models.Comment.objects.filter(active=True).order_by('-created_on')
    serializer_class = CommentSerializer
