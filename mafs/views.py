from django.shortcuts import render
from .models import Category

def cat_list(request):
    context = {
        'categories': Category.objects.prefetch_related('items')  # Оптимизированная загрузка связанных моделей
    }
    return render(request, 'mafs/cat_list.html', context)