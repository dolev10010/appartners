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
        existing_profile_query = Queries.fetch_user_profile_query('user_profile', email)
        existing_profile_list = list(postgres_client.read_from_db(existing_profile_query, single_match=False)[0])
        if not existing_profile_list:
            logger.log_error(f"Profile update failed for {email} | reason: Profile does not exist")
            return jsonify({"errorMessage": "Profile does not exist"}), 400
        columns = ['email', 'creation_time', 'profile_bio', 'photo_url', 'first_name', 'last_name', 'sex',
                   'birthday', 'age', 'smoking', 'like_animals', 'keeps_kosher',
                   'first_roomate_appartment', 'profession', 'status', 'hobbies',
                   'has_animals', 'alergies']
        existing_profile_dict = {columns[i]: existing_profile_list[i] for i in range(len(columns))}
        updated_profile = {
            'profile_bio': profile_data.get('profile_bio', existing_profile_dict['profile_bio']),
            'photo_url': profile_data.get('photo_url', existing_profile_dict['photo_url']),
            'first_name': profile_data.get('first_name', existing_profile_dict['first_name']),
            'last_name': profile_data.get('last_name', existing_profile_dict['last_name']),
            'sex': profile_data.get('sex', existing_profile_dict['sex']),
            'birthday': profile_data.get('birthday', existing_profile_dict['birthday']),
            'age': profile_data.get('age', existing_profile_dict['age']),
            'smoking': profile_data.get('smoking', existing_profile_dict['smoking']),
            'like_animals': profile_data.get('like_animals', existing_profile_dict['like_animals']),
            'keeps_kosher': profile_data.get('keeps_kosher', existing_profile_dict['keeps_kosher']),
            'first_roomate_appartment': profile_data.get('first_roomate_appartment',
                                                         existing_profile_dict['first_roomate_appartment']),
            'profession': profile_data.get('profession', existing_profile_dict['profession']),
            'status': profile_data.get('status', existing_profile_dict['status']),
            'hobbies': profile_data.get('hobbies', existing_profile_dict['hobbies']),
            'has_animals': profile_data.get('has_animals', existing_profile_dict['has_animals']),
            'alergies': profile_data.get('alergies', existing_profile_dict['alergies']),
        }
        mandatory_fields = ['first_name', 'last_name', 'sex', 'birthday']
        missing_fields = [field for field in mandatory_fields if not updated_profile[field]]
        if missing_fields:
            logger.log_error(f"Profile update failed for {email} | reason: Missing mandatory fields: "
                             f"{', '.join(missing_fields)}")
            return jsonify({"errorMessage": f"Missing mandatory fields: {', '.join(missing_fields)}"}), 400
        if not validate_date_format(updated_profile['birthday']):
            logger.log_error(f"Profile update failed for {email} | reason: Invalid date format for birthday")
            return jsonify({"errorMessage": "Invalid date format for birthday."
                                            " Date should be in yyyy-mm-dd format."}), 400
        if updated_profile['photo_url'] and not validate_photo_format(updated_profile['photo_url']):
            logger.log_error(f"Profile update failed for {email} | reason: Invalid photo format")
            return jsonify({"errorMessage": "Invalid photo format. Photo file should be in jpg/jpeg/png format."}), 400
        update_profile_query = Queries.update_user_profile_query('user_profile', email)
        postgres_client.write_to_db(update_profile_query, list(updated_profile.values()))
        logger.log_info(f"Profile updated successfully for {email}, name: {updated_profile['first_name']}"
                        f" {updated_profile['last_name']}")
        return jsonify({"message": "Profile updated successfully"}), 200

    except Exception as e:
        logger.log_error(f"Profile update failed | reason: {e}")
        return jsonify({"errorMessage": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5433, debug=True)
