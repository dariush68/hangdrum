from rest_framework import serializers

from Core import models


class MusicSheetSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.MusicSheet
        fields = [
            'id',
            'title',
            'author',
            'created_date',
            'last_modified_date',
            'sheet',
        ]
