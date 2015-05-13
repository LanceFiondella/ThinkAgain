# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crowdsource_site', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='solution',
            name='solution',
            field=models.TextField(default='', verbose_name=b' '),
            preserve_default=False,
        ),
    ]
