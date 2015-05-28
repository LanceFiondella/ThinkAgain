# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crowdsource_site', '0005_auto_20150527_1741'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='incompletesolution',
            name='problem',
        ),
        migrations.RemoveField(
            model_name='incompletesolution',
            name='username',
        ),
        migrations.AddField(
            model_name='solution',
            name='abandoned',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='solution',
            name='complete',
            field=models.BooleanField(default=False),
        ),
        migrations.DeleteModel(
            name='IncompleteSolution',
        ),
    ]
