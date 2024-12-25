from django.urls import path
from . import views

urlpatterns = [
    path('', views.mafs_list, name='mafs_list'),
]