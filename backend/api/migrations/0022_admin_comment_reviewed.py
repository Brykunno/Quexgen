# Generated by Django 5.0.6 on 2024-08-25 13:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_tos_info_status_admin_comment'),
    ]

    operations = [
        migrations.AddField(
            model_name='admin_comment',
            name='reviewed',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
