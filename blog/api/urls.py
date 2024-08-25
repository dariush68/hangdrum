# blog/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .view import CategoryViewSet, PostViewSet, AttachmentViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'posts', PostViewSet)
router.register(r'attachments', AttachmentViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
