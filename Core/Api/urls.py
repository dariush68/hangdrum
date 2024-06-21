
from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework.routers import DefaultRouter

from Core.Api import views
from Core.views import index

# Create a router and register our ViewSets with it.
router = DefaultRouter()

router.register(r'sheet-list', views.MusicSheetViewset, basename='sheet-list')
# router.register(r'users', views.UserViewSet, basename='user')

urlpatterns = [

    path('', include(router.urls)),
    # path('sheet-list/', views.MusicSheetViewset.as_view, name='sheet-list'),
]
