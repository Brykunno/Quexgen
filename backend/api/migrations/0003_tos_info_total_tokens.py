# Generated by Django 5.0.6 on 2025-07-07 11:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_user_username'),
    ]

    operations = [
        migrations.AddField(
            model_name='tos_info',
            name='total_tokens',
            field=models.IntegerField(default=0, null=True),
        ),
    ]
