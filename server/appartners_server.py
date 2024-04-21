from flask import Flask, request
import time
import re
from writer_to_postgres import DataBase
from sql_queries import Queries

app = Flask(__name__)
postgres_client = DataBase()


def is_email_already_exists(email):
    query = Queries.fetch_email_query("register_info", email)
    matching_email = postgres_client.read_from_db(query)
    if matching_email:
        return True
    return False


def is_password_ok(password):
    # Check the length of the password
    if len(password) < 8 or len(password) > 20:
        return False
    # Check for at least one uppercase letter
    if not re.search(r"[A-Z]", password):
        return False
    # Check for at least one lowercase letter
    if not re.search(r"[a-z]", password):
        return False
    # Check for at least one digit
    if not re.search(r"[0-9]", password):
        return False
    # If all conditions are met
    return True



# @app.route('/health', methods=['GET'])
# def health_check():
#     current_timestamp = time.time()
#     query = Queries.insert_health_query(table_name='health')
#     postgres_client.write_to_db(query, values=[current_timestamp])
#     return "OK", 200


@app.route('/registration-info', methods=['POST'])
def register_info():
    creation_timestamp = time.time()
    registration_info = request.get_json()

    email = registration_info.get('email')
    password = registration_info.get('password')

    if not email:
        return {"errorMessage": "Missing email"}, 400

    if not password:
        return {"errorMessage": "Missing password"}, 400

    if is_email_already_exists(email):
        return {"errorMessage": "Email already exists"}, 400

    if not is_password_ok(password):  # TODO: probably delete it. can be solved in frontend side
        return {"errorMessage": "Password doesn't meet criteria"}, 400

    registration_query = Queries.insert_registration_info_query(table_name='register_info')
    postgres_client.write_to_db(registration_query, values=[creation_timestamp, email, password])

    # save a row for the new user in user_profile table
    user_id_query = Queries.fetch_user_id_query(table_name='register_info', email=email)
    user_id = postgres_client.read_from_db(user_id_query)
    new_user_query = Queries.insert_new_user_profile_query(table_name='register_info')
    postgres_client.write_to_db(new_user_query, values=[user_id])
    return "OK", 200


@app.route('/login', methods=['GET'])
def login():
    login_info = request.get_json()
    email = login_info.get('email')
    password = login_info.get('password')
    registration_password = Queries.fetch_user_password(table_name='register_info', email=email)
    if registration_password == password:
        return "OK", 200
    else:
        return "Wrong password", 401


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5432)
