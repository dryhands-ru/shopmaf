from django.db import models

class Category(models.Model):
    title = models.CharField(verbose_name="Название категории", max_length=200)

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

    def __str__(self):
        return self.title


class CategoryItem(models.Model):
    block = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='items', null=True)  # При удалении артикула категория не удаляется
    picture = models.ImageField(verbose_name='Картинка', upload_to='img', default='/../media/img/template_services.jpg')
    title = models.CharField(max_length=80, default="", verbose_name="Артикул")
    dimensions = models.CharField(max_length=80, default="", verbose_name="Габариты")
    yandex_disk_url = models.URLField(verbose_name='Ссылка на Яндекс.Диск', blank=True, null=True)

    class Meta:
        verbose_name = 'Артикул'
        verbose_name_plural = 'Артикулы'

    def __str__(self):
        return self.title
