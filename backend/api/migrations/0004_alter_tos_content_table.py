# Generated by Django 5.0.6 on 2024-07-17 14:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_tos_content_teacher_tos_tos_content_tos_date_added'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='tos_content',
            table='tos_contents',
        ),
    ]
