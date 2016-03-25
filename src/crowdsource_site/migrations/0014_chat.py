# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
from django.conf import settings
import swampdragon.models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('crowdsource_site', '0013_auto_20160318_1846'),
    ]

    operations = [
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('message', models.TextField()),
                ('solution', models.ForeignKey(to='crowdsource_site.MultiSol')),
                ('username', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            bases=(swampdragon.models.SelfPublishModel, models.Model),
        ),
    ]
