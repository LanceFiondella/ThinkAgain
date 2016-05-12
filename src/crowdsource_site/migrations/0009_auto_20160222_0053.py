# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crowdsource_site', '0008_auto_20160222_0051'),
    ]

    operations = [
        migrations.AddField(
            model_name='multimove',
            name='p1',
            field=models.ForeignKey(related_name='parent1', default=1, to='crowdsource_site.MultiMove'),
        ),
        migrations.AddField(
            model_name='multimove',
            name='p2',
            field=models.ForeignKey(related_name='parent2', default=1, to='crowdsource_site.MultiMove'),
        ),
    ]
