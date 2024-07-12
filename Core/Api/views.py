from django.db.models import Q
from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from Core import models
from Core.Api import serializer
from Core.models import MusicSheetView


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 200


def index(request):
    return render(request, 'Core/index.html')


class MusicSheetViewset(viewsets.ModelViewSet):
    queryset = models.MusicSheet.objects.all()
    # serializer_class = serializer.MusicSheetSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,]

    def get_queryset(self):
        qs = super().get_queryset().order_by('-id')
        query = self.request.GET.get("q")
        if query is not None:
            qs = qs.filter(Q(title__icontains=query)).distinct()

        query_user = self.request.GET.get("userSheet")
        if query_user is not None:
            qs = qs.filter(Q(author=self.request.user)).distinct()
        return qs

    def get_serializer_class(self):
        if self.action == 'list':
            return serializer.MusicSheetListSerializer
        return serializer.MusicSheetDetailSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        # Increment the view count
        music_sheet_view, created = MusicSheetView.objects.get_or_create(music_sheet=instance)
        music_sheet_view.view_count += 1
        music_sheet_view.save()

        serializer = self.get_serializer(instance)
        return Response(serializer.data)
