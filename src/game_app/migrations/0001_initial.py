# Generated by Django 2.1.1 on 2018-09-25 21:10

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import re


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Move',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('piece_key', models.CharField(max_length=1000, validators=[django.core.validators.RegexValidator(re.compile('^\\d+(?:\\,\\d+)*\\Z'), code='invalid', message='Enter only digits separated by commas.')])),
                ('time', models.DateTimeField(auto_now_add=True)),
                ('game_time', models.BigIntegerField(default=0)),
                ('p1', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='parent1', to='game_app.Move')),
                ('p2', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='parent2', to='game_app.Move')),
            ],
        ),
        migrations.CreateModel(
            name='Problem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('source', models.CharField(max_length=200)),
                ('initial_state', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Solution',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('abandoned', models.BooleanField(default=False)),
                ('complete', models.BooleanField(default=False)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('total_pieces', models.IntegerField()),
                ('time_taken', models.BigIntegerField()),
                ('solution', models.TextField()),
                ('problem', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='game_app.Problem')),
                ('username', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='move',
            name='solution',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='game_app.Solution'),
        ),
    ]
