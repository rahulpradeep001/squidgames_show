# Generated by Django 5.1.1 on 2024-09-17 22:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tvshow', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comment',
            old_name='comment_text',
            new_name='content',
        ),
    ]
