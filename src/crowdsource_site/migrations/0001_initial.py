# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Problem',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=200)),
                ('source', models.CharField(max_length=200)),
                ('initial_state', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Solution',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('total_pieces', models.IntegerField()),
                ('time_taken', models.BigIntegerField()),
                ('problem', models.ForeignKey(to='crowdsource_site.Problem')),
                ('username', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
