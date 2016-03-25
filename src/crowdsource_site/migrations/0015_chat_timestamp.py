# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('crowdsource_site', '0014_chat'),
    ]

    operations = [
        migrations.AddField(
            model_name='chat',
            name='timestamp',
            field=models.DateTimeField(default=datetime.datetime(2016, 3, 22, 19, 22, 0, 93231, tzinfo=utc), auto_now_add=True),
            preserve_default=False,
        ),
    ]
