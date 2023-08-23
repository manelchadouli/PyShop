from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.FloatField()
    stock = models.IntegerField()
    image_url = models.CharField(max_length=2083)


class Offer(models.Model):
    code = models.CharField(max_length=10)
    description = models.CharField(max_length=255)
    discount = models.FloatField()


# products/cart.py

class Cart:
    def __init__(self, request):
        self.session = request.session
        cart = self.session.get('cart')
        if 'cart' not in self.session or not cart:
            cart = self.session['cart'] = {}
        self.cart = cart

    def add_product(self, product_id, quantity=1):
        product_id = str(product_id)
        if product_id in self.cart:
            self.cart[product_id]['quantity'] += quantity
        else:
            self.cart[product_id] = {
                'quantity': quantity
            }
        self.save()

    def remove_product(self, product_id):
        product_id = str(product_id)
        if product_id in self.cart:
            del self.cart[product_id]
            self.save()

    def get_cart_items(self):
        product_ids = self.cart.keys()
        products = Product.objects.filter(id__in=product_ids)
        for product in products:
            product.quantity = self.cart[str(product.id)]['quantity']
        return products

    def save(self):
        self.session.modified = True

