# Generated by Django 5.0.6 on 2024-08-08 15:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_questions_question_type'),
    ]

    operations = [
        migrations.RenameField(
            model_name='tos_info',
            old_name='AlumniYear',
            new_name='AcademicYear',
        ),
    ]
