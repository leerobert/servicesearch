# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Business',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True, serialize=False)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('name', models.CharField(max_length=50)),
                ('url', models.CharField(max_length=200)),
                ('zip_code', models.IntegerField()),
                ('rating', models.IntegerField()),
            ],
        ),
    ]
