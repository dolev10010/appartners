from flask import Flask, request, jsonify
import time
import datetime
import re
from server_logger import Logger
from writer_to_postgres import DataBase
from sql_queries import Queries
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
postgres_client = DataBase()
logger = Logger()


def is_email_already_exists(email):
    query = Queries.fetch_user_email_query("register_info", email)
    matching_email = postgres_client.read_from_db(query)
    if matching_email:
        return True
    return False


def validate_date_format(date_str):
    try:
        datetime.datetime.strptime(date_str, '%Y-%m-%d')
        return True
    except ValueError:
        return False


def validate_photo_format(photo_url):
    allowed_extensions = ['jpg', 'jpeg', 'png']
    return any(photo_url.lower().endswith(ext) for ext in allowed_extensions)


def is_name_unique(first_name, last_name):
    query = Queries.fetch_user_by_name_query("user_profile", first_name, last_name)
    matching_name = postgres_client.read_from_db(query)
    if matching_name:
        return False
    else:
        return True


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


@app.route('/registration-info', methods=['POST', 'OPTIONS'])
def register_info():
    try:
        if request.method == 'OPTIONS':  # browser needs a response before sending information
            return {}, 200
        creation_timestamp = time.time()
        registration_info = request.get_json()
        email = registration_info.get('email')
        password = registration_info.get('password')
        if is_email_already_exists(email):
            logger.log_error(f"registration failed with email {email} | reason: email already exists")
            return jsonify({"errorMessage": "Email already exists"}), 400

        # if not is_password_ok(password):  # TODO: probably delete it. can be solved in frontend side
        #     return {"errorMessage": "Password doesn't meet criteria"}, 400
        registration_query = Queries.insert_registration_info_query(table_name='register_info')
        postgres_client.write_to_db(registration_query, values=[creation_timestamp, email, password])
        # save a row for the new user in user_profile table
        user_id_query = Queries.fetch_user_id_query(table_name='register_info', email=email)
        user_id = postgres_client.read_from_db(user_id_query)
        new_user_query = Queries.insert_new_user_profile_query(table_name='user_profile')
        postgres_client.write_to_db(new_user_query, values=[user_id])
        logger.log_info(f"successful registration, email: {email}")
        return jsonify({"message": "successful registration"}), 200
    except Exception as e:
        logger.log_error(f"registration failed | reason: {e}")
        return jsonify({"errorMessage": str(e)}), 500


@app.route('/login', methods=['POST', 'OPTIONS'])
def login():
    try:
        if request.method == 'OPTIONS':  # browser needs a response before sending information
            return {}, 200
        login_info = request.get_json()
        email = login_info.get('email')
        password = login_info.get('password')
        password_query = Queries.fetch_user_password_query(table_name='register_info', email=email)
        registration_password = postgres_client.read_from_db(password_query)
        if registration_password == password:
            logger.log_info(f"successful login with email {email}")
            return jsonify({"message": "successful login"}), 200
        else:
            logger.log_info(f"login failed with email {email} | reason: wrong information")
            return jsonify({"errorMessage": "wrong info"}), 401
    except Exception as e:
        logger.log_error(f"login failed | reason: {e}")
        return jsonify({"errorMessage": str(e)}), 500


@app.route('/create-profile', methods=['POST', 'OPTIONS'])
def create_profile():
    try:
        if request.method == 'OPTIONS':
            return {}, 200
        profile_data = request.get_json()
        user_id = profile_data.get('user_id')
        profile_bio = profile_data.get('profile_bio')
        photo_url = profile_data.get('photo_url')
        first_name = profile_data.get('first_name')
        last_name = profile_data.get('last_name')
        sex = profile_data.get('sex')
        birthday = profile_data.get('birthday')
        age = profile_data.get('age')
        smoking = profile_data.get('smoking')
        like_animals = profile_data.get('like_animals')
        keeps_kosher = profile_data.get('keeps_kosher')
        first_roomate_appartment = profile_data.get('first_roomate_appartment')
        profession = profile_data.get('profession')
        status = profile_data.get('status')
        hobbies = profile_data.get('hobbies')
        has_animals = profile_data.get('has_animals')
        alergies = profile_data.get('alergies')

        if not first_name or not first_name.strip():
            logger.log_error(f"Profile creation falied for user - {user_id}. First name is mandatory value.")
            return jsonify({"errorMessage": "First name is required"}), 400
        if not last_name or not last_name.strip():
            logger.log_error(f"Profile creation falied for user - {user_id}. Last name is mandatory value.")
            return jsonify({"errorMessage": "Last name is required"}), 400
        if not sex or not sex.strip():
            logger.log_error(f"Profile creation falied for user - {user_id}. Gender is mandatory value.")
            return jsonify({"errorMessage": "Sex is required"}), 400
        if not birthday:
            logger.log_error(f"Profile creation falied for user - {user_id}. Birthday is mandatory value.")
            return jsonify({"errorMessage": "Birthday is required"}), 400
        if not validate_date_format(birthday):
            logger.log_error(f"Profile creation falied for user - {user_id}. The given birth date- "
                            f"{birthday} is in wrong format.")
            return jsonify({"errorMessage": f"Invalid birth date- {birthday}."
                                            f" Date should be in yyyy-mm-dd format."}), 400
        if not is_name_unique(first_name, last_name):
            logger.log_error(f"Profile creation falied for user - {user_id}. A user with the name- {first_name} "
                            f"{last_name} is already exists in the system.")
            return jsonify({"errorMessage": f"A user with the name- {first_name} {last_name}"
                                            f"is already exists in the system."}), 400
        if not validate_photo_format(photo_url):
            logger.log_error(f"Profile creation falied for user - {user_id}. Invalid photo file format.")
            return jsonify({"errorMessage": "Invalid photo format. Photo file should be in jpg/jpeg/png format."}), 400

        profile_query = Queries.insert_new_user_profile_query('user_profile')
        postgres_client.write_to_db(profile_query, [
            user_id, profile_bio, photo_url, first_name, last_name, sex, birthday, age,
            smoking, like_animals, keeps_kosher, first_roomate_appartment, profession,
            status, hobbies, has_animals, alergies
        ])

        logger.log_info(f"Profile created successfully for user_id: {user_id}, name: {first_name} {last_name}")
        return jsonify({"message": "Profile created successfully"}), 200

    except Exception as e:
        logger.log_error(f"Profile creation failed | reason: {e}")
        return jsonify({"errorMessage": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5433, debug=True)
