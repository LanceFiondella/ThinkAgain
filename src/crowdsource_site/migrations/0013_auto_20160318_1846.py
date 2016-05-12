# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crowdsource_site', '0012_auto_20160318_1653'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userdata',
            name='last_level',
            field=models.ForeignKey(to='crowdsource_site.Problem'),
        ),
    ]
