from django.contrib import admin
from .models import Category, CategoryItem

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['title']  # Поля для отображения в списке категорий
    list_filter = ['title']  # Фильтрация по категориям

# Регистрация артикулов в админке, чтобы можно было их удалять отдельно от категорий
@admin.register(CategoryItem)
class CategoryItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'block', 'dimensions', 'yandex_disk_url']
    list_filter = ['block']  # Фильтрация по категории
    search_fields = ['title']  # Поиск по артикулу

    # Возможность удалить артикул
    def has_delete_permission(self, request, obj=None):
        return True
