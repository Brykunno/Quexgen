# Generated by Django 5.0.6 on 2024-09-20 12:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0028_questions_context'),
    ]

    operations = [
        migrations.AddField(
            model_name='tos_content',
            name='study_guide',
            field=models.FileField(null=True, upload_to='study_guide/'),
        ),
    ]
