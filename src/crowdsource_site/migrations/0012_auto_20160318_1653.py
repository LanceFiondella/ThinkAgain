# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crowdsource_site', '0011_auto_20160223_2110'),
    ]

    operations = [
        migrations.AddField(
            model_name='multimove',
            name='game_time',
            field=models.BigIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='multimove',
            name='piece_key',
            field=models.CommaSeparatedIntegerField(max_length=200),
        ),
    ]
