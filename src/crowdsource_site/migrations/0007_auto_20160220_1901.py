# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings
import swampdragon.models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('crowdsource_site', '0006_auto_20150527_1748'),
    ]

    operations = [
        migrations.CreateModel(
            name='MultiMove',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('piece_key', models.CharField(max_length=200)),
                ('time', models.DateTimeField(auto_now_add=True)),
                ('p1', models.ForeignKey(related_name='parent1', to='crowdsource_site.MultiMove')),
                ('p2', models.ForeignKey(related_name='parent2', to='crowdsource_site.MultiMove')),
            ],
            bases=(swampdragon.models.SelfPublishModel, models.Model),
        ),
        migrations.CreateModel(
            name='MultiSol',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('abandoned', models.BooleanField(default=False)),
                ('complete', models.BooleanField(default=False)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('total_pieces', models.IntegerField()),
                ('time_taken', models.BigIntegerField()),
                ('initiator', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
                ('problem', models.ForeignKey(to='crowdsource_site.Problem')),
            ],
            bases=(swampdragon.models.SelfPublishModel, models.Model),
        ),
        migrations.CreateModel(
            name='UserData',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('last_level', models.CharField(max_length=200)),
                ('last_game_type', models.CharField(max_length=200)),
                ('username', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='multimove',
            name='solution',
            field=models.ForeignKey(to='crowdsource_site.MultiSol'),
        ),
        migrations.AddField(
            model_name='multimove',
            name='username',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
        ),
    ]
