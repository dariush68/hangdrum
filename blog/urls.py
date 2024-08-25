from django.urls import path, include
from . import views

urlpatterns = [
    path('api/', include('blog.api.urls')),
    path('', views.post_list, name='post_list'),
    path('<int:pk>/', views.post_detail, name='post_detail'),
    path('category/<int:category_id>/', views.category_posts, name='category_posts'),
]
