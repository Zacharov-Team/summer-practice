import datetime
import random
import csv
from datetime import time

import psycopg2
from config import host, user, password, db_name, port

connection = None
try:
    connection = psycopg2.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        database=db_name
    )
    connection.autocommit = True
    cursor = connection.cursor()

    sql = "CREATE TABLE tool_location(ID int PRIMARY KEY NOT NULL, location_name text NOT NULL, description text NOT NULL);CREATE TABLE tool( ID int PRIMARY KEY NOT NULL unique references tool_location(ID), tool_name text NOT NULL); CREATE TABLE aggregated_data( ID int PRIMARY KEY NOT NULL,data_date TIMESTAMP, data_values DECIMAL []); CREATE TABLE modified_data( ID int PRIMARY KEY NOT NULL unique references aggregated_data(ID),data_values INT []);"
    cursor.execute(sql)

    with open("df_diff2.csv", 'r') as file:
        id = 0
        csvreader = csv.reader(file)
        for row in csvreader:
            id += 1
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

            insert_str = (f"INSERT INTO aggregated_data VALUES ({id},\'{time}\',\'{float_array}\');")
            insert_query = (insert_str)
            cursor.execute(insert_query)

    with open("new_df2.csv", 'r') as file:
        id = 0
        csvreader = csv.reader(file)
        for row in csvreader:
            id += 1
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

            insert_str = (f"INSERT INTO modified_data VALUES ({id},\'{float_array}\');")
            insert_query = (insert_str)
            cursor.execute(insert_query)


except Exception as _ex:
    print("[INFO] Error", _ex)
finally:
    if connection:
        cursor.close()
        connection.close()
        print("[INFO] connection closed")