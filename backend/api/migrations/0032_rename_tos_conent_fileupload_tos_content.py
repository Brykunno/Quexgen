# Generated by Django 5.0.6 on 2024-09-21 04:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0031_rename_file_fileupload_study_guide_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='fileupload',
            old_name='tos_conent',
            new_name='tos_content',
        ),
    ]