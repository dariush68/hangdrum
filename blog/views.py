from django.shortcuts import render, get_object_or_404, redirect
from .models import Post, Category, Comment
from .forms import CommentForm


def post_list(request):
    posts = Post.objects.filter(published=True).order_by('-created_at')
    return render(request, 'blog/post_list.html', {'posts': posts})


def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    comments = post.comments.filter(active=True, parent__isnull=True)

    new_comment = None
    reply_form = CommentForm()

    if request.method == 'POST' and 'comment_form' in request.POST:
        comment_form = CommentForm(request.POST)
        if comment_form.is_valid():
            new_comment = comment_form.save(commit=False)
            new_comment.post = post
            if request.user.is_authenticated:
                new_comment.user = request.user
            new_comment.save()
            return redirect(post.get_absolute_url())
    else:
        comment_form = CommentForm()

    return render(request, 'blog/post_detail.html', {
        'post': post,
        'comments': comments,
        'new_comment': new_comment,
        'comment_form': comment_form,
        'reply_form': reply_form
    })


def add_comment_reply(request, post_id, comment_id):
    post = get_object_or_404(Post, id=post_id)
    parent_comment = get_object_or_404(Comment, id=comment_id)

    if request.method == 'POST':
        reply_form = CommentForm(request.POST)
        if reply_form.is_valid():
            reply = reply_form.save(commit=False)
            reply.post = post
            reply.parent = parent_comment
            if request.user.is_authenticated:
                reply.user = request.user
            reply.save()
            return redirect(post.get_absolute_url())


def category_posts(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    posts = Post.objects.filter(categories=category, published=True).order_by('-created_at')
    return render(request, 'blog/category_posts.html', {'category': category, 'posts': posts})
