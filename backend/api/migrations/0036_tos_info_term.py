# Generated by Django 5.0.6 on 2024-09-29 17:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0035_fileupload_tos_content'),
    ]

    operations = [
        migrations.AddField(
            model_name='tos_info',
            name='Term',
            field=models.TextField(null=True),
        ),
    ]