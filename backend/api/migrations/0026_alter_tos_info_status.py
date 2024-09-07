# Generated by Django 5.0.6 on 2024-09-06 13:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0025_profile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tos_info',
            name='Status',
            field=models.IntegerField(choices=[(0, 'Saved'), (1, 'To review'), (2, 'Approved'), (3, 'Needs Revision')], default=0, null=True),
        ),
    ]
