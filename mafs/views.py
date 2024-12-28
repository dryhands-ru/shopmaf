import requests
import os
from io import BytesIO
from PIL import Image as PILImage
from openpyxl import Workbook
from openpyxl.drawing.image import Image
from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from .models import Category
import json
import traceback
import urllib.parse
import time  # Импортируем time для генерации уникальных имен файлов


def cat_list(request):
    context = {
        'categories': Category.objects.prefetch_related('items')  # Оптимизированная загрузка связанных моделей
    }
    return render(request, 'mafs/cat_list.html', context)


def generate_table(request):
    if request.method == 'POST':
        try:
            # Получаем данные с клиента
            data = json.loads(request.body)
            items = data.get('items', [])

            # Создаём новый рабочий лист
            wb = Workbook()
            ws = wb.active
            ws.append(["Категория", "Артикул", "Габариты", "Изображение"])

            for item in items:
                category = item['category']
                article = item['article']
                dimensions = item['dimensions']

                # Получаем URL изображения
                image_url = item['imageUrl']

                # Если image_url относительный, добавляем базовый URL с использованием request.build_absolute_uri
                if image_url.startswith('/media'):
                    image_url = request.build_absolute_uri(image_url)

                # Получаем изображение по URL
                image_data = requests.get(image_url).content
                img = PILImage.open(BytesIO(image_data))

                # Уменьшаем изображение до 164x164 пикселей
                img.thumbnail((164, 164))

                # Создаем уникальное имя для временного файла, используя текущее время
                timestamp = str(int(time.time() * 1000))  # Уникальное значение времени в миллисекундах
                temp_image_filename = f"temp_image_{timestamp}.png"
                temp_image_path = os.path.join(settings.MEDIA_ROOT, temp_image_filename)

                # Сохраняем изображение с уникальным именем
                img.save(temp_image_path)

                # Добавляем данные в таблицу
                ws.append([category, article, dimensions])

                # Вставляем изображение в ячейку D
                img_to_insert = Image(temp_image_path)
                img_to_insert.anchor = 'D' + str(ws.max_row)
                ws.add_image(img_to_insert)

            # Сохраняем файл Excel
            file_path = os.path.join(settings.MEDIA_ROOT, 'generated_table.xlsx')
            wb.save(file_path)

            # Возвращаем ссылку для скачивания с правильным URL
            file_url = os.path.join(settings.MEDIA_URL, 'generated_table.xlsx')
            return JsonResponse({'file_url': file_url})

        except Exception as e:
            return JsonResponse({'error': str(e), 'trace': traceback.format_exc()})

    return JsonResponse({'error': 'Invalid method'}, status=405)
