from flask import Flask, request, jsonify
import datetime
import re
import json
from server_logger import Logger
from writer_to_postgres import DataBase
from sql_queries import Queries
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
postgres_client = DataBase()
logger = Logger()


def get_current_timestamp():
    return datetime.datetime.now()


def is_email_already_exists(email):
    query = Queries.fetch_user_email_query("register_info", email)
    matching_email = postgres_client.read_from_db(query)
    return bool(matching_email)


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
        if is_email_already_exists(email):
            logger.log_error(f"Profile creation failed | reason: Email already exists: {email}")
            return jsonify({"errorMessage": "Email already exists"}), 400
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
        existing_profile_list = list(postgres_client.read_from_db(existing_profile_query, single_match=False))
        if not existing_profile_list:
            logger.log_error(f"Profile update failed for {email} | reason: Profile does not exist")
            return jsonify({"errorMessage": "Profile does not exist"}), 400
        columns = ['email', 'creation_time', 'profile_bio', 'photo_url', 'first_name', 'last_name', 'sex',
                   'birthday', 'age', 'smoking', 'like_animals', 'keeps_kosher',
                   'first_roomate_appartment', 'profession', 'status', 'hobbies',
                   'has_animals', 'alergies']
        existing_profile_dict = {columns[i]: existing_profile_list[0][i] for i in range(len(columns))}
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
            return jsonify({"errorMessage": "Invalid date format for birthday. Date should be in yyyy-mm-dd format."}), 400
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


@app.route('/get-profile', methods=['GET', 'OPTIONS'])
def get_profile():
    try:
        if request.method == 'OPTIONS':
            return {}, 200

        email = request.args.get('email')
        if not email:
            return jsonify({"errorMessage": "Email is required"}), 400

        existing_profile_query = Queries.fetch_user_profile_query('user_profile', email)
        existing_profile_data = postgres_client.read_from_db(existing_profile_query, single_match=False)
        if not existing_profile_data:
            logger.log_error(f"Get profile failed for {email} | reason: Profile does not exist")
            return jsonify({"errorMessage": "Profile does not exist"}), 400

        existing_profile_data_list = existing_profile_data[0]
        profile = {
            "profile_bio": existing_profile_data_list[2],
            "photo_url": existing_profile_data_list[3],
            "first_name": existing_profile_data_list[4],
            "last_name": existing_profile_data_list[5],
            "sex": existing_profile_data_list[6],
            "birthday": existing_profile_data_list[7],
            "age": existing_profile_data_list[8],
            "smoking": existing_profile_data_list[9],
            "like_animals": existing_profile_data_list[10],
            "keeps_kosher": existing_profile_data_list[11],
            "first_roomate_appartment": existing_profile_data_list[12],
            "profession": existing_profile_data_list[13],
            "status": existing_profile_data_list[14],
            "hobbies": existing_profile_data_list[15],
            "has_animals": existing_profile_data_list[16],
            "alergies": existing_profile_data_list[17],
        }
        return jsonify(profile), 200
    except Exception as e:
        logger.log_error(f"Profile retrieval failed | reason: {e}")
        return jsonify({"errorMessage": str(e)}), 500


@app.route('/post-apartment', methods=['POST', 'OPTIONS'])
def post_apartment():
    try:
        if request.method == 'OPTIONS':
            return {}, 200
        apartment_data = request.get_json()
        print(apartment_data)
        email = apartment_data.get('email')
        city = apartment_data.get('city')
        street = apartment_data.get('street')
        number = apartment_data.get('number')
        floor = apartment_data.get('floor')
        total_rooms = apartment_data.get('total_rooms')
        appartment_size = apartment_data.get('appartment_size')
        available_rooms = apartment_data.get('available_rooms')
        num_of_toilets = apartment_data.get('num_of_toilets')
        price = apartment_data.get('price')
        post_bio = apartment_data.get('post_bio')
        has_parking = apartment_data.get('has_parking')
        has_elevator = apartment_data.get('has_elevator')
        has_mamad = apartment_data.get('has_mamad')
        num_of_roommates = apartment_data.get('num_of_roommates')
        allow_pets = apartment_data.get('allow_pets')
        has_balcony = apartment_data.get('has_balcony')
        status = apartment_data.get('status')
        has_sun_water_heater = apartment_data.get('has_sun_water_heater')
        is_accessible_to_disabled = apartment_data.get('is_accessible_to_disabled')
        has_air_conditioner = apartment_data.get('has_air_conditioner')
        has_bars = apartment_data.get('has_bars')
        entry_date = apartment_data.get('entry_date')
        is_sublet = apartment_data.get('is_sublet')
        end_date = apartment_data.get('end_date') if apartment_data.get('end_date') else None
        photos_url = json.dumps(apartment_data.get('photos_url') if apartment_data.get('photos_url') else [])
        roommate_emails = apartment_data.get('roommate_emails') if apartment_data.get('roommate_emails') else []
        creation_timestamp = get_current_timestamp()

        # Ensure all required fields are provided and not None
        required_fields = [
            email, city, street, number, floor, total_rooms, appartment_size, available_rooms,
            num_of_toilets, price, post_bio, has_parking, has_elevator, has_mamad, num_of_roommates,
            allow_pets, has_balcony, status, has_sun_water_heater, is_accessible_to_disabled,
            has_air_conditioner, has_bars, entry_date, is_sublet, roommate_emails
        ]
        for field in required_fields:
            if field is None:
                return jsonify({"errorMessage": f"{field} cannot be None"}), 400

        new_apartment_query = Queries.insert_new_apartment_post_query(table_name='apartments_post')
        print(new_apartment_query)
        postgres_client.write_to_db(new_apartment_query, values=[
            email, city, street, number, floor, total_rooms, appartment_size, available_rooms,
            num_of_toilets, price, post_bio, has_parking, has_elevator, has_mamad, num_of_roommates,
            allow_pets, has_balcony, status, has_sun_water_heater, is_accessible_to_disabled,
            has_air_conditioner, has_bars, entry_date, is_sublet, end_date, photos_url, roommate_emails,
            creation_timestamp,
        ])
        logger.log_info(f"Apartment posted successfully by email: {email}")
        return jsonify({"message": "Apartment posted successfully"}), 200
    except Exception as e:
        logger.log_error(f"Apartment posting failed | reason: {e}")
        return jsonify({"errorMessage": str(e)}), 500





@app.route('/user-apartments', methods=['GET'])
def user_apartments():
    try:
        email = request.args.get('email')
        if not email:
            return jsonify({"errorMessage": "Email is required"}), 400

        fetch_apartments_query = Queries.fetch_user_apartments_query('apartments_post', email)
        apartments = postgres_client.read_from_db(fetch_apartments_query, single_match=False)
        return jsonify(apartments), 200
    except Exception as e:
        logger.log_error(f"Fetching user apartments failed | reason: {e}")
        return jsonify({"errorMessage": str(e)}), 500

@app.route('/update-apartment', methods=['POST', 'OPTIONS'])
def update_apartment():
    try:
        if request.method == 'OPTIONS':
            return {}, 200
        apartment_data = request.get_json()
        email = apartment_data.get('email')
        post_id = apartment_data.get('post_id')

        # Fetch existing apartment data
        existing_apartment_query = Queries.fetch_apartment_query('apartments_post', email, post_id)
        existing_apartment_list = list(postgres_client.read_from_db(existing_apartment_query, single_match=False))
        if not existing_apartment_list:
            logger.log_error(f"Apartment update failed for post_id: {post_id} | reason: Apartment does not exist")
            return jsonify({"errorMessage": "Apartment does not exist"}), 400

        columns = ['post_id', 'email', 'city', 'street', 'number', 'floor', 'total_rooms', 'appartment_size',
                   'available_rooms', 'num_of_toilets', 'price', 'post_bio', 'has_parking', 'has_elevator', 'has_mamad',
                   'num_of_roommates', 'allow_pets', 'has_balcony', 'status', 'has_sun_water_heater',
                   'is_accessible_to_disabled', 'has_air_conditioner', 'has_bars', 'entry_date', 'is_sublet',
                   'end_date', 'photos_url', 'roommate_emails', 'creation_timestamp']

        existing_apartment_dict = {columns[i]: existing_apartment_list[0][i] for i in range(len(columns))}

        updated_apartment = {
            'city': apartment_data.get('city'),
            'street': apartment_data.get('street'),
            'number': apartment_data.get('number'),
            'floor': apartment_data.get('floor'),
            'total_rooms': apartment_data.get('total_rooms'),
            'appartment_size': apartment_data.get('appartment_size'),
            'available_rooms': apartment_data.get('available_rooms'),
            'num_of_toilets': apartment_data.get('num_of_toilets'),
            'price': apartment_data.get('price'),
            'post_bio': apartment_data.get('post_bio'),
            'has_parking': apartment_data.get('has_parking'),
            'has_elevator': apartment_data.get('has_elevator'),
            'has_mamad': apartment_data.get('has_mamad'),
            'num_of_roommates': apartment_data.get('num_of_roommates'),
            'allow_pets': apartment_data.get('allow_pets'),
            'has_balcony': apartment_data.get('has_balcony'),
            'status': apartment_data.get('status'),
            'has_sun_water_heater': apartment_data.get('has_sun_water_heater'),
            'is_accessible_to_disabled': apartment_data.get('is_accessible_to_disabled'),
            'has_air_conditioner': apartment_data.get('has_air_conditioner'),
            'has_bars': apartment_data.get('has_bars'),
            'entry_date': apartment_data.get('entry_date'),
            'is_sublet': apartment_data.get('is_sublet'),
            'end_date': apartment_data.get('end_date') if apartment_data.get('is_sublet') else None,
            'photos_url': json.dumps(apartment_data.get('photos_url') if apartment_data.get('photos_url') else []),
            'roommate_emails': apartment_data.get('roommate_emails') if apartment_data.get('roommate_emails') else [],
            'creation_timestamp': existing_apartment_dict['creation_timestamp']}

        update_apartment_query = Queries.update_apartment_post_query('apartments_post')
        postgres_client.write_to_db(update_apartment_query, list(updated_apartment.values()) + [email, post_id])
        logger.log_info(f"Apartment updated successfully for post_id: {post_id}")
        return jsonify({"message": "Apartment updated successfully"}), 200
    except Exception as e:
        logger.log_error(f"Apartment updating failed | reason: {e}")
        return jsonify({"errorMessage": str(e)}), 500

@app.route('/get-roommate-photos', methods=['POST', 'OPTIONS'])
def get_roommate_photos():
    if request.method == 'OPTIONS':
        return {}, 200
    try:
        data = request.json
        emails = data['emails']
        placeholders = ','.join(['%s'] * len(emails))
        query = Queries.fetch_photos_by_emails_query('user_profile', placeholders)
        result = postgres_client.read_from_db(query, single_match=False, values=emails)
        photos = {row[0]: row[1] for row in result} if result else {}
        return jsonify(photos), 200
    except Exception as e:
        logger.log_error(f"Fetching roommate photos failed | reason: {e}")
        return jsonify({"errorMessage": str(e)}), 500

@app.route('/delete-apartment', methods=['POST', 'OPTIONS'])
def delete_apartment():
    if request.method == 'OPTIONS':  # browser needs a response before sending information
        return {}, 200
    try:
        data = request.json
        email = data['email']
        post_id = data['post_id']
        delete_apartment_query = Queries.delete_user_apartment_query('apartments_post')
        postgres_client.delete_from_db(delete_apartment_query, [email, post_id])

        return jsonify({"message": "Apartment deleted successfully"}), 200
    except Exception as e:
        logger.log_error(f"Post deletion failed | reason: {e}")
        return jsonify({"errorMessage": str(e)}), 500

@app.route('/validate-emails', methods=['POST', 'OPTIONS'])
def validate_emails():
    if request.method == 'OPTIONS':  # browser needs a response before sending information
        return {}, 200
    try:
        data = request.json
        emails = data['emails']
        placeholders = ','.join(['%s'] * len(emails))
        query = Queries.find_emails_query('user_profile', placeholders)
        result = postgres_client.read_from_db(query, single_match=False, values=emails)
        valid_emails = [row[0] for row in result] if result else []
        invalid_emails = [email for email in emails if email not in valid_emails]
        return jsonify({"valid_emails": valid_emails, "invalid_emails": invalid_emails}), 200
    except Exception as e:
        logger.log_error(f"Email validation failed | reason: {e}")
        return jsonify({"errorMessage": str(e)}), 500




@app.route('/find-apartments', methods=['GET'])
def find_apartments():
    try:
        city = request.args.get('city')
        max_price = request.args.get('max_price')
        query = Queries.fetch_apartments_query("apartments", city, max_price)
        apartments = postgres_client.read_from_db(query, single_match=False)
        return jsonify(apartments), 200
    except Exception as e:
        logger.log_error(f"Finding apartments failed | reason: {e}")
        return jsonify({"errorMessage": str(e)}), 500

@app.route('/apartments-in-my-area', methods=['GET'])
def apartments_in_my_area():
    try:
        user_location = request.args.get('location')
        query = Queries.fetch_apartments_nearby_query("apartments", user_location)
        apartments = postgres_client.read_from_db(query, single_match=False)
        return jsonify(apartments), 200
    except Exception as e:
        logger.log_error(f"Fetching apartments in my area failed | reason: {e}")
        return jsonify({"errorMessage": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5433, debug=True)
