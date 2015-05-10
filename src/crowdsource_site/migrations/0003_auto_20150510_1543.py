# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('crowdsource_site', '0002_solution_solution'),
    ]

    operations = [
        migrations.AlterField(
            model_name='solution',
            name='solution',
            field=models.TextField(),
        ),
    ]
