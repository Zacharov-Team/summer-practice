# Generated by Django 5.0.7 on 2024-07-19 02:44

import django.contrib.auth.models
import django.contrib.postgres.fields
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='AggregatedData',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateTimeField()),
                ('data_values', django.contrib.postgres.fields.ArrayField(base_field=models.DecimalField(decimal_places=2, max_digits=10), size=None)),
            ],
        ),
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('user_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('role', models.CharField(max_length=50)),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            bases=('auth.user',),
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='ToolLocation',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('location_name', models.TextField()),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='ModifiedData',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('data', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), size=None)),
                ('aggregated_data', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='app.aggregateddata')),
            ],
        ),
        migrations.CreateModel(
            name='Tool',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('tool_name', models.TextField()),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.toollocation')),
            ],
        ),
    ]
