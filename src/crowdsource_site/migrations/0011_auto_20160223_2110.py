# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crowdsource_site', '0010_auto_20160222_0102'),
    ]

    operations = [
        migrations.AddField(
            model_name='multisol',
            name='connected_players',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='multimove',
            name='p1',
            field=models.ForeignKey(related_name='parent1', blank=True, to='crowdsource_site.MultiMove', null=True),
        ),
        migrations.AlterField(
            model_name='multimove',
            name='p2',
            field=models.ForeignKey(related_name='parent2', blank=True, to='crowdsource_site.MultiMove', null=True),
        ),
    ]
