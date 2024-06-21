
from django.contrib import admin
from django.urls import path

from Core import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.sign_in, name='login'),
]
