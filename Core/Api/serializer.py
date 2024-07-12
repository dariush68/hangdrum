from rest_framework import serializers

from Core import models


class MusicSheetSerializer(serializers.ModelSerializer):

    view_count = serializers.SerializerMethodField(read_only=True)
    author_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = models.MusicSheet
        fields = [
            'id',
            'title',
            # 'author',
            'created_date',
            'last_modified_date',
            'sheet',
            'author_name',
            'view_count',
        ]

    def get_author_name(self, obj):
        return obj.author.username

    def get_view_count(self, obj):
        return obj.views.first().view_count if obj.views.exists() else 0


class MusicSheetListSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField(read_only=True)
    view_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = models.MusicSheet
        fields = [
            'id',
            'title',
            'created_date',
            'last_modified_date',
            'author_name',
            'view_count',
        ]

    def get_author_name(self, obj):
        return obj.author.username

    def get_view_count(self, obj):
        return obj.views.first().view_count if obj.views.exists() else 0


class MusicSheetDetailSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField(read_only=True)
    view_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = models.MusicSheet
        fields = [
            'id',
            'title',
            'created_date',
            'last_modified_date',
            'sheet',
            'author_name',
            'view_count',
        ]

    def get_author_name(self, obj):
        return obj.author.username

    def get_view_count(self, obj):
        return obj.views.first().view_count if obj.views.exists() else 0