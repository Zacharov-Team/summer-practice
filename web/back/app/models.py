from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.

class CustomUser(models.Model):
    role = models.CharField(max_length=50)
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username


class ToolLocation(models.Model):
    id = models.AutoField(primary_key=True)
    location_name = models.TextField()
    description = models.TextField()


class Tool(models.Model):
    id = models.AutoField(primary_key=True)
    tool_name = models.TextField()
    location = models.ForeignKey(ToolLocation, on_delete=models.CASCADE)


class AggregatedData(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateTimeField()

    data_values = ArrayField(models.DecimalField(max_digits=20, decimal_places=15))


class ModifiedData(models.Model):
    id = models.AutoField(primary_key=True)
    data = ArrayField(models.DecimalField(max_digits=20, decimal_places=15))
    date = models.DateTimeField()


class InitialData(models.Model):
    id = models.AutoField(primary_key=True)
    data = ArrayField(models.DecimalField(max_digits=20, decimal_places=15))
    date = models.DateTimeField()