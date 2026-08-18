from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Product, Stock

@receiver(post_save, sender=Product)
def create_product_stock(sender, instance, created, **kwargs):
    """
    Auto-creates a Stock instance when a new Product is created.
    Ensures every product has a stock record initialized.
    """
    if created:
        Stock.objects.create(product=instance)

@receiver(post_save, sender=Product)
def save_product_stock(sender, instance, **kwargs):
    """
    Saves the Stock when the Product is saved.
    Maintains synchronization between parent and child models.
    """
    if hasattr(instance, 'stock'):
        instance.stock.save()
