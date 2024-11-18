# Generated by Django 5.0.6 on 2024-11-11 08:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0038_courses'),
    ]

    operations = [
        migrations.CreateModel(
            name='Logs',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('log', models.TextField()),
                ('status', models.TextField()),
                ('log_date', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'logs',
            },
        ),
        migrations.CreateModel(
            name='Settings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('chairperson', models.TextField()),
                ('dean', models.TextField()),
                ('director', models.TextField()),
                ('academic_year', models.TextField()),
            ],
            options={
                'db_table': 'settings',
            },
        ),
    ]