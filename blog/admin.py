from django.contrib import admin
from .models import Post, Category, Comment
from .models import Comment


class CommentAdmin(admin.ModelAdmin):
    list_display = ('name', 'post', 'created_on', 'active')
    list_filter = ('active', 'created_on')
    search_fields = ('name', 'email', 'body')
    actions = ['approve_comments']

    def approve_comments(self, request, queryset):
        queryset.update(active=True)


class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at', 'published')
    list_filter = ('published', 'author', 'categories')
    search_fields = ('title', 'content')
    prepopulated_fields = {'slug': ('title',)}  # For SEO-friendly URLs


admin.site.register(Comment, CommentAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Category)
# admin.site.register(Comment)
