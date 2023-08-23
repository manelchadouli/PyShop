from django.http import HttpResponse
from django.shortcuts import render, redirect
from .models import Product, Cart
from django.http import JsonResponse
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect

from django.shortcuts import get_object_or_404


def index(request):
    products = Product.objects.all()
    cart = Cart(request)

    if request.method == 'POST':
        product_id = request.POST.get('product_id')
        cart.add_product(product_id)
    return render(request, 'index.html',
                  {'products': products})


def new(request):
    return HttpResponse('New Products')


def cart_view(request):
    cart = Cart(request)
    cart_items = cart.get_cart_items()
    return render(request, 'cart.html', {'cart_items': cart_items})


def remove_from_cart(request, product_id):
    cart = Cart(request)
    cart.remove_product(product_id)
    return JsonResponse({'success': True})


def add_to_cart(request, product_id):
    cart = Cart(request)
    cart.add_product(product_id)
    return JsonResponse({'success': True})


def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('index')  # Redirect to home after registration
    else:
        form = UserCreationForm()
    return render(request, 'registration/register.html', {'form': form})


def user_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('index')  # Redirect to home after login
    else:
        form = AuthenticationForm()
    return render(request, 'registration/login.html', {'form': form})
