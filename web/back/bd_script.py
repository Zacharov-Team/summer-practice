import csv
import os
from datetime import datetime
from decimal import Decimal

from environs import Env
import psycopg2

env = Env()
env.read_env()  # Загрузить переменные из файла .env

connection = None
try:
    connection = psycopg2.connect(
        host=env('DB_HOST'),
        port=env('DB_PORT'),
        user=env('DB_USER'),
        password=env('DB_PASSWORD'),
        database=env('DB_NAME')
    )

    connection.autocommit = True
    cursor = connection.cursor()
    script_dir = os.path.dirname(__file__)
    file_path = os.path.join(script_dir, "uploads_dataset", "df_diff2.csv")

    with open(file_path, 'r') as file:
        csvreader = csv.reader(file)
        aggregated_data_ids = []
        for row in csvreader:
            time = datetime.strptime(row[0], '%Y-%m-%d %H:%M:%S')  # assume this is the format of your date string
            values = row[1:]
            result = [Decimal(item) if item != "" else Decimal(0.0) for item in values]
            insert_str = (f"INSERT INTO app_aggregateddata "
                          f"(date, data_values) "
                          f"VALUES (%s, %s) "
                          f"RETURNING id")
            cursor.execute(insert_str, (time, result))
            aggregated_data_id = cursor.fetchone()[0]
            aggregated_data_ids.append(aggregated_data_id)

    script_dir = os.path.dirname(__file__)
    file_path = os.path.join(script_dir, "uploads_dataset", "new_df2.csv")
    with open(file_path, 'r') as file:
        csvreader = csv.reader(file)
        for row, aggregated_data_id in zip(csvreader, aggregated_data_ids):
            time = datetime.strptime(row[0], '%Y-%m-%d %H:%M:%S')  # assume this is the format of your date string
            values = row[1:]
            result = [int(item) if item != "" else 0 for item in values]
            insert_str = (f"INSERT INTO app_modifieddata "
                          f"(data, aggregated_data_id) "
                          f"VALUES (%s, %s)")
            cursor.execute(insert_str, (result, aggregated_data_id))

except Exception as _ex:
    print("[INFO] Error", _ex)
finally:
    if connection:
        cursor.close()
        connection.close()
        print("[INFO] connection closed")