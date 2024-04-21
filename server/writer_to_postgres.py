import psycopg2
from psycopg2 import OperationalError
import config


class DataBase:

    def __init__(self):
        self.connection = None
        self.db_cursor = None
        self.create_connection_to_db()

    def create_connection_to_db(self):
        try:
            # Connect to an existing database
            self.connection = psycopg2.connect(
                database=config.database,
                user=config.user,
                password=config.password,
                host=config.host,
                port=config.port
            )
            self.connection.autocommit = True
            # Open a cursor to perform database operations
            self.db_cursor = self.connection.cursor()
        except OperationalError as e:
            print(f"Couldn't connect to DB | reason: '{e}'")

    def close_connection(self):
        # Close communication with the database
        self.db_cursor.close()
        self.connection.close()

    def write_to_db(self, query, values):
        try:
            if len(values) > 1:
                self.db_cursor.executemany(query, values)
            else:
                self.db_cursor.execute(query, (values[0],))
        except Exception as e:
            print(e)

    def read_from_db(self, query):
        try:
            self.db_cursor.execute(query)
        except Exception as e:
            print(e)
