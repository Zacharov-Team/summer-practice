from app.models import *
import csv
from django.db.utils import IntegrityError
import os
from django.core.management.base import BaseCommand
from back.settings import BASE_DIR


class Command(BaseCommand):
    def handle(self, *args, **options):
        file_path = os.path.join(BASE_DIR, "uploads_dataset", "df_diff2.csv")
        with open(file_path, 'r') as file:
            csvreader = csv.reader(file)
            for row in csvreader:
                time = row[0]
                values = row[1:]
                result = []
                for item in values:
                    if item == "":
                        item = -100
                    result.append(float(item))
                aggregated_data = AggregatedData(date=time, data_values=result)
                try:
                    aggregated_data.save()
                except IntegrityError as e:
                    print(f"Error saving aggregated data: {e}")

        file_path = os.path.join(BASE_DIR, "uploads_dataset", "new_df2.csv")
        with open(file_path, 'r') as file:
            csvreader = csv.reader(file)
            id = 1
            for row in csvreader:
                time = row[0]
                values = row[1:]
                result = []
                for item in values:
                    if item == "":
                        item = -100
                    result.append(int(item))
                modified_data = ModifiedData(data=result, date=time)
                try:
                    modified_data.save()
                    id += 1
                except IntegrityError as e:
                    print(f"Error saving modified data: {e}")
