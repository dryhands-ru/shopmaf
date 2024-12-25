from django.contrib import admin
from .models import Category, CategoryItem


class InlineCategoryItem(admin.TabularInline):
    model = CategoryItem
    fields = ['title', 'picture', 'yandex_disk_url']
    extra = 1  # Число пустых строк для добавления новых позиций

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['title']  # Поля для отображения в списке категорий
    inlines = [InlineCategoryItem]  # Вложенные элементы
