# Generated by Django 5.0.6 on 2024-10-08 13:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0036_tos_info_term'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExamDates',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('midterm_exam', models.TextField()),
                ('finals_exam', models.TextField()),
                ('summer_exam', models.TextField()),
            ],
            options={
                'db_table': 'exam_dates',
            },
        ),
    ]