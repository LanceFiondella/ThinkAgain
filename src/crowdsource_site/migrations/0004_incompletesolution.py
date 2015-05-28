# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('crowdsource_site', '0003_auto_20150510_1543'),
    ]

    operations = [
        migrations.CreateModel(
            name='IncompleteSolution',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('abandoned', models.BooleanField(default=False)),
                ('total_pieces', models.IntegerField()),
                ('time_taken', models.BigIntegerField()),
                ('solution', models.TextField()),
                ('problem', models.ForeignKey(to='crowdsource_site.Problem')),
                ('username', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
