from django.db.models import Q
from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.pagination import PageNumberPagination

from Core import models
from Core.Api import serializer


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 200


def index(request):
    return render(request, 'Core/index.html')


class MusicSheetViewset(viewsets.ModelViewSet):
    queryset = models.MusicSheet.objects.all()
    serializer_class = serializer.MusicSheetSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,]

    def get_queryset(self):
        qs = super().get_queryset().order_by('-id')
        # qs = qs.filter(Q(is_show=True))

        query = self.request.GET.get("q")
        if query is not None:
            qs = qs.filter(
                Q(title__icontains=query)
            ).distinct()
        return qs