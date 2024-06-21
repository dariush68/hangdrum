from django.shortcuts import render


def index(request):
    return render(request, 'Core/index.html')


def sign_in(request):

    # Render the HTML template index.html with the data in the context variable
    return render(request, 'Core/signin.html')
