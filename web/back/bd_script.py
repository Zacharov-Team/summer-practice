import csv

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
        password=env('DB_PORT'),
        database=env('DB_PASSWORD')
    )

    connection.autocommit = True
    cursor = connection.cursor()

    with open("df_diff2.csv", 'r') as file:
        ID = 0
        csvreader = csv.reader(file)
        for row in csvreader:
            ID += 1
            time = row[0]
            values = row[1:]
            result = []
            for item in values:
                if item == "":
                    result.append(0.0)
                else:
                    result.append(float(item))
            result = tuple(result)
            float_array = "{" + ",".join(str(num) for num in result) + "}"

            insert_str = f"INSERT INTO app_aggregateddata VALUES ({ID},\'{time}\',\'{float_array}\');"
            insert_query = insert_str
            cursor.execute(insert_query)

    with open("new_df2.csv", 'r') as file:
        ID = 0
        csvreader = csv.reader(file)
        for row in csvreader:
            ID += 1
            time = row[0]
            values = row[1:]
            result = []
            for item in values:
                if item == "":
                    result.append(0.0)
                else:
                    result.append(int(item))
            result = tuple(result)
            float_array = "{" + ",".join(str(num) for num in result) + "}"

            insert_str = f"INSERT INTO app_modifieddata VALUES ({ID},\'{float_array}\');"
            insert_query = insert_str
            cursor.execute(insert_query)


except Exception as _ex:
    print("[INFO] Error", _ex)
finally:
    if connection:
        cursor.close()
        connection.close()
        print("[INFO] connection closed")
