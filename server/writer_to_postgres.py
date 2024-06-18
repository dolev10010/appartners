import psycopg2
from psycopg2 import OperationalError, pool
import config


class DataBase:
    def __init__(self):
        self.connection_pool = None
        self.create_connection_pool()

    def create_connection_pool(self):
        try:
            # Initialize the connection pool
            self.connection_pool = psycopg2.pool.SimpleConnectionPool(
                1, 20,  # Minimum and maximum number of connections in the pool
                database=config.database,
                user=config.user,
                password=config.password,
                host=config.host,
                port=config.port
            )
            if self.connection_pool:
                print("Connection pool created successfully")
        except OperationalError as e:
            print(f"Couldn't create connection pool | reason: '{e}'")

    def get_connection(self):
        try:
            connection = self.connection_pool.getconn()
            if not self.is_connection_valid(connection):
                self.connection_pool.putconn(connection, close=True)
                connection = self.connection_pool.getconn()
            return connection
        except Exception as e:
            print(f"Error getting connection from pool | reason: '{e}'")

    def release_connection(self, connection):
        try:
            self.connection_pool.putconn(connection)
        except Exception as e:
            print(f"Error releasing connection back to pool | reason: '{e}'")

    def close_all_connections(self):
        try:
            self.connection_pool.closeall()
        except Exception as e:
            print(f"Error closing all connections | reason: '{e}'")

    def is_connection_valid(self, connection):
        try:
            cursor = connection.cursor()
            cursor.execute('SELECT 1')
            cursor.close()
            return True
        except OperationalError:
            return False

    def write_to_db(self, query, values):
        connection = self.get_connection()
        if connection:
            try:
                cursor = connection.cursor()
                cursor.execute(query, values if len(values) > 1 else (values[0],))
                connection.commit()
                cursor.close()
            except Exception as e:
                print(e)
            finally:
                self.release_connection(connection)

    def read_from_db(self, query, single_match=True):
        connection = self.get_connection()
        if connection:
            try:
                cursor = connection.cursor()
                cursor.execute(query)
                if single_match:
                    result = cursor.fetchone()
                    cursor.close()
                    return result[0] if result else None
                result = cursor.fetchall()
                cursor.close()
                return result
            except Exception as e:
                print(e)
            finally:
                self.release_connection(connection)
