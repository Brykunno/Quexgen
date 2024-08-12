# Generated by Django 5.0.6 on 2024-08-11 12:11

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_rename_alumniyear_tos_info_academicyear'),
    ]

    operations = [
        migrations.CreateModel(
            name='TestPart',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('test_type', models.TextField()),
                ('test_instruction', models.TextField()),
                ('test_part_num', models.IntegerField()),
                ('exam_id', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='test_exam_id', to='api.exam')),
            ],
            options={
                'db_table': 'test_part',
            },
        ),
        migrations.AddField(
            model_name='questions',
            name='test_part_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='test_part_id', to='api.testpart'),
        ),
    ]