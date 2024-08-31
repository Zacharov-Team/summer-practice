from app.models import *
import csv
from django.db.utils import IntegrityError
import os
from django.core.management.base import BaseCommand
from back.settings import BASE_DIR




class Command(BaseCommand):
    def handle(self, *args, **options):
        print('Перед запуском скрипта, убедитесь, что в папке uploads_dataset содержатся соответствующие csv-файлы"')

        if input('Нужно заполнение таблицы AggregatedData? (yes/no)?\n') == 'yes':
            f  = input('Введите путь к csv-файлу (пустое если дефолт значение df_diff2.csv): ')
            if f == "":
                f = "df_diff2.csv"

            file_path = os.path.join(BASE_DIR, "uploads_dataset", f)
            with open(file_path, 'r') as file:
                csvreader = csv.reader(file)
                for row in csvreader:
                    time = row[0]
                    values = row[1:]
                    result = []
                    for item in values:
                        if item == "":
                            item = -1000
                        result.append(float(item))
                    aggregated_data = AggregatedData(date=time, data_values=result)
                    try:
                        aggregated_data.save()
                    except IntegrityError as e:
                        print(f"Error saving aggregated data: {e}")

        f2 = input('Введите путь к csv-файлу (пустое если дефолт значение df_target_positive2.csv): ')
        if f2 == "":
            f2 = "df_target_positive2.csv"
        if input('Нужно заполнение таблицы ModifiedData?(yes/no)\n') == 'yes':
            file_path = os.path.join(BASE_DIR, "uploads_dataset", f2)
            with open(file_path, 'r') as file:
                csvreader = csv.reader(file)
                for row in csvreader:
                    time = row[0]
                    values = row[1:]
                    result = []
                    for item in values:
                        if item == "":
                            item = -1000
                        result.append(float(item))
                    modified_data = ModifiedData(data=result, date=time)
                    try:
                        modified_data.save()
                    except IntegrityError as e:
                        print(f"Error saving modified data: {e}")

        f3 = input('Введите путь к csv-файлу (пустое если дефолт значение final_combined_df2.csv): ')
        if f3 == "":
            f3 = "final_combined_df2.csv"
        if input('Нужно заполнение таблицы InitialData?(yes/no)\n') == 'yes':
            file_path = os.path.join(BASE_DIR, "uploads_dataset",f3)
            with open(file_path, 'r') as file:
                csvreader = csv.reader(file)
                for row in csvreader:
                    time = row[0]
                    values = row[1:]
                    result = []
                    for item in values:
                        if item == "":
                            item = -1000
                        result.append(float(item))
                    initial_data = InitialData(data=result, date=time)
                    try:
                        initial_data.save()
                    except IntegrityError as e:
                        print(f"Error saving modified data: {e}")