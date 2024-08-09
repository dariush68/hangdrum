import datetime

from django.contrib.auth.models import User
from django.db import models

# Create your models here.


class MusicSheet(models.Model):
    author = models.ForeignKey(User, related_name='musicsheet_user', on_delete=models.CASCADE, help_text='کاربر')
    created_date = models.DateTimeField(auto_now_add=True, blank=True)
    last_modified_date = models.DateTimeField(null=True, blank=True)
    sheet = models.TextField(max_length=10000, help_text="music sheet")
    title = models.CharField(max_length=700, null=False, blank=False, help_text="sheet name")
    tempo = models.IntegerField(default=120, help_text="tempo number")
    is_show = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class MusicSheetView(models.Model):
    music_sheet = models.ForeignKey(MusicSheet, related_name='views', on_delete=models.CASCADE)
    view_count = models.IntegerField(default=0)

