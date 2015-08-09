# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('businesses', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='business',
            name='category',
            field=models.CharField(default='Human Resources', max_length=200),
        ),
        migrations.AlterField(
            model_name='business',
            name='rating',
            field=models.IntegerField(default=0),
        ),
    ]
