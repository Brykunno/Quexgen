# Generated by Django 5.0.6 on 2024-07-17 15:05

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_tos_contents_delete_tos_content'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='TOS',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('topic', models.TextField()),
                ('learning_outcomes', models.TextField()),
                ('teaching_hours', models.IntegerField()),
                ('allocation', models.IntegerField()),
                ('items', models.IntegerField()),
                ('remembering', models.IntegerField()),
                ('understanding', models.IntegerField()),
                ('applying', models.IntegerField()),
                ('analyzing', models.IntegerField()),
                ('evaluating', models.IntegerField()),
                ('creating', models.IntegerField()),
                ('total', models.IntegerField()),
                ('placement', models.CharField(max_length=100)),
                ('tos_date_added', models.DateTimeField(auto_now_add=True, null=True)),
                ('teacher_tos', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='tos', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'tos',
            },
        ),
        migrations.DeleteModel(
            name='TOS_Contents',
        ),
    ]
