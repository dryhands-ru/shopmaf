# Generated by Django 5.1.4 on 2024-12-27 08:38

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mafs', '0009_alter_categoryitem_block'),
    ]

    operations = [
        migrations.AlterField(
            model_name='categoryitem',
            name='block',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='items', to='mafs.category'),
        ),
    ]
