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


def get_current_timestamp():
    return time.time()


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


@app.route('/create-profile', methods=['POST', 'OPTIONS'])
def create_profile():
    try:
        if request.method == 'OPTIONS':  # browser needs a response before sending information
            return {}, 200
        creation_timestamp = get_current_timestamp()
        user_info = request.get_json()
        email = user_info.get('email')
        new_user_query = Queries.insert_new_user_profile_query(table_name='user_profile')
        postgres_client.write_to_db(new_user_query, values=[email, creation_timestamp])
        logger.log_info(f"successful profile creation, email: {email}")
        return jsonify({"message": "successful profile creation"}), 200
    except Exception as e:
        logger.log_error(f"profile creation failed | reason: {e}")
        return jsonify({"errorMessage": str(e)}), 500


@app.route('/update-profile', methods=['POST', 'OPTIONS'])
def update_profile():
    try:
        if request.method == 'OPTIONS':
            return {}, 200
        profile_data = request.get_json()
        email = profile_data.get('email')
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
            logger.log_error(f"Profile creation falied for user - {email}. First name is mandatory value.")
            return jsonify({"errorMessage": "First name is required"}), 400
        if not last_name or not last_name.strip():
            logger.log_error(f"Profile creation falied for user - {email}. Last name is mandatory value.")
            return jsonify({"errorMessage": "Last name is required"}), 400
        if not sex or not sex.strip():
            logger.log_error(f"Profile creation falied for user - {email}. Gender is mandatory value.")
            return jsonify({"errorMessage": "Sex is required"}), 400
        if not birthday:
            logger.log_error(f"Profile creation falied for user - {email}. Birthday is mandatory value.")
            return jsonify({"errorMessage": "Birthday is required"}), 400
        if not validate_date_format(birthday):
            logger.log_error(f"Profile creation falied for user - {email}. The given birth date- "
                            f"{birthday} is in wrong format.")
            return jsonify({"errorMessage": f"Invalid birth date- {birthday}."
                                            f" Date should be in yyyy-mm-dd format."}), 400
        if not validate_photo_format(photo_url):
            logger.log_error(f"Profile creation falied for user - {email}. Invalid photo file format.")
            return jsonify({"errorMessage": "Invalid photo format. Photo file should be in jpg/jpeg/png format."}), 400

        profile_query = Queries.update_user_profile_query('user_profile', email)
        postgres_client.write_to_db(profile_query, [
            email, profile_bio, photo_url, first_name, last_name, sex, birthday, age,
            smoking, like_animals, keeps_kosher, first_roomate_appartment, profession,
            status, hobbies, has_animals, alergies
        ])

        logger.log_info(f"Profile updated successfully for {email}, name: {first_name} {last_name}")
        return jsonify({"message": "Profile updated successfully"}), 200

    except Exception as e:
        logger.log_error(f"Profile update failed | reason: {e}")
        return jsonify({"errorMessage": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5433, debug=True)
