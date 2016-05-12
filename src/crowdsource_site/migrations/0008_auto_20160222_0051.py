# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crowdsource_site', '0007_auto_20160220_1901'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='multimove',
            name='p1',
        ),
        migrations.RemoveField(
            model_name='multimove',
            name='p2',
        ),
    ]
