# Generated by Django 5.0.6 on 2024-07-18 13:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_rename_teaching_hours_tos_content_teachinghours_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='tos_content',
            name='totalItems',
            field=models.IntegerField(null=True),
        ),
    ]
