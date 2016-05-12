# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crowdsource_site', '0009_auto_20160222_0053'),
    ]

    operations = [
        migrations.AlterField(
            model_name='multimove',
            name='p1',
            field=models.ForeignKey(related_name='parent1', to='crowdsource_site.MultiMove', null=True),
        ),
        migrations.AlterField(
            model_name='multimove',
            name='p2',
            field=models.ForeignKey(related_name='parent2', to='crowdsource_site.MultiMove', null=True),
        ),
    ]
