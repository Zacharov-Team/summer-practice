from django.db import models
from django.contrib.postgres.fields import ArrayField


# Create your models here.

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
    data_date = models.DateTimeField()

    data_values = ArrayField(models.DecimalField(max_digits=10, decimal_places=2))

    # def get_data_values(self):
    #     return [float(x) for x in self.data_values.split(',')]


class ModifiedData(models.Model):
    id = models.AutoField(primary_key=True)
    data_values = ArrayField(models.IntegerField())
    aggregated_data = models.OneToOneField(AggregatedData, on_delete=models.CASCADE)
