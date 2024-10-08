from flask import Flask, request, jsonify
import datetime
import json
from server_logger import Logger
from writer_to_postgres import DataBase
from sql_queries import Queries
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room


app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
postgres_client = DataBase()
logger = Logger()


@socketio.on('connect')
def handle_connect():
    print('Client connected')


@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')


@socketio.on('join')
def on_join(data):
    room = data['email']  # Assuming the room name is the user's email
    join_room(room)
    print(f'User {room} has joined the room.')


@socketio.on('leave')
def on_leave(data):
    room = data['email']  # Assuming the room name is the user's email
    leave_room(room)
    print(f'User {room} has left the room.')


@socketio.on('send_message')
def handle_send_message(data):
    # Emit the message to the receiver's room
    emit('receive_message', data, room=data['receiver'])

    # Also emit the message to the sender's room
    emit('receive_message', data, room=data['sender'])


def get_current_timestamp():
    return datetime.datetime.now()


def is_email_already_exists(email):
    query = Queries.fetch_user_email_query("user_profile", email)
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
        creation_timestamp = get_current_timestamp().strftime('%Y-%m-%d %H:%M:%S')
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

        # New fields for latitude and longitude
        latitude = apartment_data.get('coordinates', {}).get('lat')
        longitude = apartment_data.get('coordinates', {}).get('lng')

        # Ensure all required fields are provided and not None
        required_fields = [
            email, city, street, number, floor, total_rooms, appartment_size, available_rooms,
            num_of_toilets, price, post_bio, has_parking, has_elevator, has_mamad, num_of_roommates,
            allow_pets, has_balcony, status, has_sun_water_heater, is_accessible_to_disabled,
            has_air_conditioner, has_bars, entry_date, is_sublet, roommate_emails, latitude, longitude
        ]
        for field in required_fields:
            if field is None:
                return jsonify({"errorMessage": f"{field} cannot be None"}), 400

        new_apartment_query = Queries.insert_new_apartment_post_query(table_name='apartments_post')
        postgres_client.write_to_db(new_apartment_query, values=[
            email, city, street, number, floor, total_rooms, appartment_size, available_rooms,
            num_of_toilets, price, post_bio, has_parking, has_elevator, has_mamad, num_of_roommates,
            allow_pets, has_balcony, status, has_sun_water_heater, is_accessible_to_disabled,
            has_air_conditioner, has_bars, entry_date, is_sublet, end_date, photos_url, roommate_emails,
            creation_timestamp, latitude, longitude
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
                   'end_date', 'photos_url', 'roommate_emails', 'creation_timestamp', 'latitude', 'longitude']

        existing_apartment_dict = {columns[i]: existing_apartment_list[0][i] for i in range(len(columns))}

        # Get latitude and longitude from apartment_data or keep the original ones if null
        latitude = apartment_data.get('coordinates', {}).get('lat')
        if latitude is None:
            latitude = existing_apartment_dict['latitude']
        longitude = apartment_data.get('coordinates', {}).get('lng')
        if longitude is None:
            longitude = existing_apartment_dict['longitude']
        # Updated apartment object with latitude and longitude
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
            'creation_timestamp': existing_apartment_dict['creation_timestamp'],
            'latitude': latitude,  # Use updated or original latitude
            'longitude': longitude  # Use updated or original longitude
        }

        # Update query with latitude and longitude included
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


def filter_roommates(roommates, filters):
    for roommate in roommates:
        if filters['ageMin'] and roommate[8] > int(filters['ageMin']):  # Assuming age is the 9th field
            return True
        if filters['ageMax'] and roommate[8] < int(filters['ageMax']):  # Assuming age is the 9th field
            return True
        if filters['profession'] and filters['profession'].lower() in roommate[13].lower():  # Assuming profession is the 14th field
            return True
        if filters['smoking'] and roommate[9] == filters['smoking']:  # Assuming smoking is the 10th field
            return True
        if filters['likeAnimals'] and roommate[10] == filters['likeAnimals']:  # Assuming like_animals is the 11th field
            return True
        if filters['hasAnimals'] and roommate[16] == filters['hasAnimals']:  # Assuming has_animals is the 17th field
            return True
        if filters['keepsKosherRoommate'] and roommate[11] == filters['keepsKosherRoommate']:  # Assuming keeps_kosher is the 12th field
            return True
        if filters['gender'] and roommate[6] == filters['gender']:  # Assuming gender is the 7th field
            return True
        if filters['allergies'] and filters['allergies'].lower() in roommate[17].lower():  # Assuming allergies is the 18th field
            return True
        if filters['hobbies'] and filters['hobbies'].lower() in roommate[15].lower():  # Assuming hobbies is the 16th field
            return True
        if filters['relationshipStatus'] and roommate[14] == filters['relationshipStatus']:  # Assuming relationship status is the 15th field
            return True
    return False


@app.route('/find-apartments', methods=['GET'])
def find_apartments():
    try:
        sort_order = request.args.get('sortOrder')
        # page = int(request.args.get('page', 1))
        # per_page = int(request.args.get('per_page', 10))

        filters = {
            'city': request.args.get('city'),
            'priceMin': request.args.get('priceMin'),
            'priceMax': request.args.get('priceMax'),
            'hasParking': request.args.get('hasParking'),
            'hasElevator': request.args.get('hasElevator'),
            'hasBalcony': request.args.get('hasBalcony'),
            'isFurnished': request.args.get('isFurnished'),
            'hasAirConditioner': request.args.get('hasAirConditioner'),
            'allowPets': request.args.get('allowPets'),
            'hasSunWaterHeater': request.args.get('hasSunWaterHeater'),
            'isAccessibleToDisabled': request.args.get('isAccessibleToDisabled'),
            'hasMamad': request.args.get('hasMamad'),
            'hasBars': request.args.get('hasBars'),
            'keepKosher': request.args.get('keepKosher'),
            'status': request.args.get('status'),
            'entryDate': request.args.get('entryDate'),
            'available_rooms': request.args.get('available_rooms'),
            'street': request.args.get('street'),
            'isSublet': request.args.get('isSublet'),
            'endDate': request.args.get('endDate')
        }

        roomate_filters = {
            'ageMin': request.args.get('ageMin'),
            'ageMax': request.args.get('ageMax'),
            'profession': request.args.get('profession'),
            'smoking': request.args.get('smoking'),
            'likeAnimals': request.args.get('likeAnimals'),
            'hasAnimals': request.args.get('hasAnimals'),
            'keepsKosherRoommate': request.args.get('keepsKosherRoommate'),
            'gender': request.args.get('gender'),
            'allergies': request.args.get('allergies'),
            'hobbies': request.args.get('hobbies'),
            'relationshipStatus': request.args.get('relationshipStatus'),
        }

        base_query = Queries.fetch_all_apartments_query('apartments_post')

        if filters['city']:
            base_query += f" AND city ILIKE '%{filters['city']}%'"
        if filters['street']:
            base_query += f" AND street ILIKE '%{filters['street']}%'"
        if filters['priceMin']:
            base_query += f" AND price >= {filters['priceMin']}"
        if filters['priceMax']:
            base_query += f" AND price <= {filters['priceMax']}"
        if filters['hasParking'] == 'true':
            base_query += " AND has_parking = TRUE"
        if filters['hasElevator'] == 'true':
            base_query += " AND has_elevator = TRUE"
        if filters['hasBalcony'] == 'true':
            base_query += " AND has_balcony = TRUE"
        if filters['isFurnished'] == 'true':
            base_query += " AND is_furnished = TRUE"
        if filters['hasAirConditioner'] == 'true':
            base_query += " AND has_air_conditioner = TRUE"
        if filters['allowPets'] == 'true':
            base_query += " AND allow_pets = TRUE"
        if filters['hasSunWaterHeater'] == 'true':
            base_query += " AND has_sun_water_heater = TRUE"
        if filters['isAccessibleToDisabled'] == 'true':
            base_query += " AND is_accessible_to_disabled = TRUE"
        if filters['hasMamad'] == 'true':
            base_query += " AND has_mamad = TRUE"
        if filters['hasBars'] == 'true':
            base_query += " AND has_bars = TRUE"
        if filters['keepKosher'] == 'true':
            base_query += " AND keep_kosher = TRUE"
        if filters['status']:
            base_query += f" AND status = '{filters['status']}'"
        if filters['entryDate']:
            base_query += f" AND entry_date >= '{filters['entryDate']}'"
        if filters['available_rooms']:
            base_query += f" AND available_rooms>= '{filters['available_rooms']}'"
        if filters['isSublet'] == 'true':
            base_query += " AND is_sublet = TRUE"
            if filters['endDate']:
                base_query += f" AND end_date >= '{filters['endDate']}'"

        if sort_order == 'priceHighToLow':
            query = base_query + " ORDER BY price DESC"
        elif sort_order == 'priceLowToHigh':
            query = base_query + " ORDER BY price ASC"
        elif sort_order == 'dateCloseToFar':
            query = base_query + " ORDER BY entry_date ASC"
        elif sort_order == 'dateFarToClose':
            query = base_query + " ORDER BY entry_date DESC"
        else:
            query = base_query

        # offset = (page - 1) * per_page
        # query += f" LIMIT {per_page} OFFSET {offset}"

        apartments = postgres_client.read_from_db(query, single_match=False)

        mapped_apartments = []

        for apt in apartments:
            apartment_dict = {
                "post_id": apt[0],
                "email": apt[1],
                "city": apt[2],
                "street": apt[3],
                "number": apt[4],
                "floor": apt[5],
                "total_rooms": apt[6],
                "appartment_size": apt[7],
                "available_rooms": apt[8],
                "num_of_toilets": apt[9],
                "price": apt[10],
                "post_bio": apt[11],
                "has_parking": apt[12],
                "has_elevator": apt[13],
                "has_mamad": apt[14],
                "num_of_roommates": apt[15],
                "allow_pets": apt[16],
                "has_balcony": apt[17],
                "status": apt[18],
                "has_sun_water_heater": apt[19],
                "is_accessible_to_disabled": apt[20],
                "has_air_conditioner": apt[21],
                "has_bars": apt[22],
                "entry_date": apt[23].isoformat() if apt[23] else None,
                "is_sublet": apt[24],
                "end_date": apt[25].isoformat() if apt[25] else None,
                "photos": apt[26],
                "roommate_emails": apt[27],
                "creation_timestamp": apt[28].isoformat() if apt[28] else None
            }
            mapped_apartments.append(apartment_dict)

        filtered_apartments = []
        if any(roomate_filters.values()):
            for apartment in mapped_apartments:
                roommate_emails = apartment['roommate_emails']
                if roommate_emails:
                    with app.test_request_context(json={"emails": roommate_emails}):
                        response, status_code = validate_emails()

                        if status_code != 200:
                            continue

                        validate_data = response.get_json()  # קבלת המידע המוחזר
                        valid_emails = validate_data.get('valid_emails', [])

                        if not valid_emails:
                            continue

                    email_placeholders = ', '.join([f"'{email}'" for email in valid_emails])
                    roomate_query = Queries.fetch_apartment_roommates_details('user_profile', email_placeholders)
                    roommates = postgres_client.read_from_db(roomate_query, single_match=False)

                    if filter_roommates(roommates, roomate_filters):
                        filtered_apartments.append(apartment)
            if filtered_apartments:
                return jsonify(filtered_apartments), 200
            else:
                return jsonify({"errorMessage": "No apartments found"}), 404

        if mapped_apartments:
            return jsonify(mapped_apartments), 200

    except Exception as e:
        logger.log_error(f"Fetching apartments list failed | reason: {e}")
        return jsonify({"errorMessage": str(e)}), 500


@app.route('/apartments-by-city', methods=['GET'])
def apartments_by_city():
    try:
        city = request.args.get('city')
        if not city:
            return jsonify({"errorMessage": "City is required"}), 400

        query = Queries.fetch_apartments_by_city_query("apartments_post", city)
        apartments = postgres_client.read_from_db(query, single_match=False)

        mapped_apartments = []
        for apt in apartments:
            apartment_dict = {
                "post_id": apt[0],
                "email": apt[1],
                "city": apt[2],
                "street": apt[3],
                "number": apt[4],
                "floor": apt[5],
                "total_rooms": apt[6],
                "appartment_size": apt[7],
                "available_rooms": apt[8],
                "num_of_toilets": apt[9],
                "price": apt[10],
                "post_bio": apt[11],
                "has_parking": apt[12],
                "has_elevator": apt[13],
                "has_mamad": apt[14],
                "num_of_roommates": apt[15],
                "allow_pets": apt[16],
                "has_balcony": apt[17],
                "status": apt[18],
                "has_sun_water_heater": apt[19],
                "is_accessible_to_disabled": apt[20],
                "has_air_conditioner": apt[21],
                "has_bars": apt[22],
                "entry_date": apt[23].isoformat() if apt[23] else None,
                "is_sublet": apt[24],
                "end_date": apt[25].isoformat() if apt[25] else None,
                "photos": apt[26],
                "roommate_emails": apt[27],
                "creation_timestamp": apt[28].isoformat() if apt[28] else None,
                "latitude": apt[29],
                "longitude": apt[30]
            }
            mapped_apartments.append(apartment_dict)

        return jsonify(mapped_apartments), 200
    except Exception as e:
        logger.log_error(f"Fetching apartments by city failed | reason: {e}")
        return jsonify({"errorMessage": str(e)}), 500


@app.route('/get-roommate-profiles', methods=['GET'])
def get_roommate_profiles():
    try:
        filters = {
            'ageMin': request.args.get('ageMin'),
            'ageMax': request.args.get('ageMax'),
            'profession': request.args.get('profession'),
            'smoking': request.args.get('smoking'),
            'likeAnimals': request.args.get('likeAnimals'),
            'hasAnimals': request.args.get('hasAnimals'),
            'keepsKosherRoommate': request.args.get('keepsKosherRoommate'),
            'gender': request.args.get('gender'),
            'allergies': request.args.get('allergies'),
            'hobbies': request.args.get('hobbies'),
            'relationshipStatus': request.args.get('relationshipStatus')
        }

        base_query = Queries.fetch_all_user_profiles('user_profile')

        if filters['ageMin']:
            base_query += f" AND age >= {filters['ageMin']}"
        if filters['ageMax']:
            base_query += f" AND age <= {filters['ageMax']}"
        if filters['profession']:
            base_query += f" AND profession ILIKE '%{filters['profession']}%'"
        if filters['smoking']:
            base_query += f" AND smoking = {filters['smoking']}"
        if filters['likeAnimals']:
            base_query += f" AND like_animals = {filters['likeAnimals']}"
        if filters['hasAnimals']:
            base_query += f" AND has_animals = {filters['hasAnimals']}"
        if filters['keepsKosherRoommate']:
            base_query += f" AND keeps_kosher = {filters['keepsKosherRoommate']}"
        if filters['gender']:
            base_query += f" AND sex = '{filters['gender']}'"
        if filters['allergies']:
            base_query += f" AND allergies ILIKE '%{filters['allergies']}%'"
        if filters['hobbies']:
            base_query += f" AND hobbies ILIKE '%{filters['hobbies']}%'"
        if filters['relationshipStatus']:
            base_query += f" AND status = '{filters['relationshipStatus']}'"

        profiles = postgres_client.read_from_db(base_query, single_match=False)
        if not profiles:
            return jsonify({"errorMessage": "No profiles found"}), 404

        formatted_profiles = [
            {
                "photo_url": profile[3],
                "full_name": f"{profile[4]} {profile[5]}",
                "age":profile[8],
                "profession": profile[13],
                "profile_email": profile[0]
            }
            for profile in profiles
        ]
        return jsonify(formatted_profiles), 200
    except Exception as e:
        logger.log_error(f"Fetching roommate profiles failed | reason: {e}")
        return jsonify({"errorMessage": str(e)}), 500


@app.route('/get-conversations', methods=['GET', 'OPTIONS'])
def get_conversations():
    try:
        if request.method == 'OPTIONS':  # Handling CORS preflight requests
            return {}, 200

        email = request.args.get('email')
        if not email:
            return jsonify({"errorMessage": "Email is required"}), 400

        # Fetch the latest message from each conversation
        query = Queries.fetch_latest_conversations_query()
        conversations = postgres_client.read_from_db(query, single_match=False, values=[email, email])

        total_unread_count = 0
        result = []
        for conversation in conversations:
            last_message_query = Queries.fetch_last_message_by_id_query()
            last_message = postgres_client.read_from_db(last_message_query, single_match=False, values=[conversation[1]])
            unread_count_query = Queries.fetch_unread_message_count_query()
            unread_count = postgres_client.read_from_db(unread_count_query, single_match=True, values=[email, last_message[0][1]])
            if unread_count:
                total_unread_count += unread_count
            opposite_email = last_message[0][1] if last_message[0][1] != email else last_message[0][2]
            user_profile_query = Queries.fetch_user_profile_query('user_profile', opposite_email)
            user_profile = postgres_client.read_from_db(user_profile_query, single_match=False)
            result.append({
                "email": opposite_email,
                "full_name": f"{user_profile[0][4]} {user_profile[0][5]}",
                "photo_url": user_profile[0][3],
                "last_message": last_message[0][3],
                "last_timestamp": last_message[0][4],
                "unread_count": unread_count if unread_count else 0  # Unread count from query
            })

        return jsonify({"conversations": result, "total_unread_count": total_unread_count}), 200
    except Exception as e:
        logger.log_error(f"Fetching conversations failed | reason: {e}")
        return jsonify({"errorMessage": str(e)}), 500


@app.route('/get-messages', methods=['GET', 'OPTIONS'])
def get_messages():
    try:
        if request.method == 'OPTIONS':  # Handling CORS preflight requests
            return {}, 200

        sender_email = request.args.get('sender')
        receiver_email = request.args.get('receiver')

        if not sender_email or not receiver_email:
            return jsonify({"errorMessage": "Both sender and receiver emails are required"}), 400

        query = Queries.fetch_messages_between_users_query()
        messages = postgres_client.read_from_db(query, single_match=False, values=[sender_email, receiver_email, receiver_email, sender_email])

        # Mark messages as read if the receiver is viewing the messages
        update_query = Queries.mark_messages_as_read_query()
        postgres_client.write_to_db(update_query, values=[sender_email, receiver_email])

        return jsonify(messages), 200
    except Exception as e:
        logger.log_error(f"Fetching messages failed | reason: {e}")
        return jsonify({"errorMessage": str(e)}), 500


@app.route('/send-message', methods=['POST', 'OPTIONS'])
def send_message():
    try:
        if request.method == 'OPTIONS':  # Handling CORS preflight requests
            return {}, 200

        data = request.get_json()
        sender_email = data.get('sender')
        receiver_email = data.get('receiver')
        message_text = data.get('message')

        if not sender_email or not receiver_email or not message_text:
            return jsonify({"errorMessage": "Sender, receiver, and message are required"}), 400

        query = Queries.insert_message_query()
        postgres_client.write_to_db(query, values=[sender_email, receiver_email, message_text])

        return jsonify({"message": "Message sent successfully"}), 200
    except Exception as e:
        logger.log_error(f"Sending message failed | reason: {e}")
        return jsonify({"errorMessage": str(e)}), 500


@app.route('/mark-messages-as-read', methods=['POST'])
def mark_messages_as_read():
    try:
        data = request.get_json()
        sender_email = data.get('sender')
        receiver_email = data.get('receiver')

        if not sender_email or not receiver_email:
            return jsonify({"errorMessage": "Both sender and receiver emails are required"}), 400

        # Update the messages in the database to mark them as read
        update_query = Queries.mark_messages_as_read_query()
        postgres_client.write_to_db(update_query, values=[sender_email, receiver_email])

        return jsonify({"message": "Messages marked as read successfully"}), 200
    except Exception as e:
        logger.log_error(f"Marking messages as read failed | reason: {e}")

        
@app.route('/get-roommate-details', methods=['POST', 'OPTIONS'])
def get_roommate_details():
    try:
        if request.method == 'OPTIONS':
            return jsonify({"status": "Options request processed"}), 200

        if request.method != 'POST' or request.content_type != 'application/json':
            return jsonify({"errorMessage": "Invalid request type or content type"}), 400

        data = request.get_json()
        if data is None:
            return jsonify({"errorMessage": "Failed to parse JSON"}), 400

        emails = data.get('emails', [])

        if not emails:
            return jsonify({"errorMessage": "No emails provided"}), 400

        with app.test_request_context(json={"emails": emails}):
            response, status_code = validate_emails()

            if status_code != 200:
                return jsonify({"errorMessage": "Failed to validate emails"}), 500

            validate_data = response.get_json()
            valid_emails = validate_data.get('valid_emails', [])

            if not valid_emails:
                return jsonify({"errorMessage": "No valid emails provided"}), 400

        email_placeholders = ', '.join([f"'{email}'" for email in valid_emails])
        if not email_placeholders:
            return jsonify({"errorMessage": "No valid emails provided after formatting"}), 400

        query = Queries.fetch_apartment_roomates_details_for_popup('user_profile', email_placeholders)
        roommate_details = postgres_client.read_from_db(query, single_match=False)

        if not roommate_details:
            return jsonify({"errorMessage": "No matching profiles found"}), 404

        formatted_profiles = [
            {
                "full_name": detail[0],
                "bio": detail[1],
                "photo_url": detail[2],
                "email": detail[3]
            }
            for detail in roommate_details
        ]
        return jsonify(formatted_profiles), 200
    except Exception as e:
        logger.log_error(f"Fetching roommate details failed | reason: {e}")
        return jsonify({"errorMessage": str(e)}), 500


if __name__ == "__main__":
    # socket io
    socketio.run(app, host="0.0.0.0", port=5433, debug=True, allow_unsafe_werkzeug=True)
