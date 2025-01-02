from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from .views import generate_pdf

urlpatterns = [
    path('', views.cat_list, name='cat_list'),
    path('generate-table/', views.generate_table, name='generate_table'),
    path('generate-pdf/', generate_pdf, name='generate_pdf'),
]

# Добавляем статические маршруты после определения urlpatterns
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)