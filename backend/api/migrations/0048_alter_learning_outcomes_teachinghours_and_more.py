# Generated by Django 5.0.6 on 2024-12-12 14:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0047_remove_learning_outcomes_totalitems'),
    ]

    operations = [
        migrations.AlterField(
            model_name='learning_outcomes',
            name='teachingHours',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='tos_content',
            name='teachingHours',
            field=models.FloatField(null=True),
        ),
    ]
