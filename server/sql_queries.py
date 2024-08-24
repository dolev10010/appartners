class Queries:

    @staticmethod
    def insert_new_user_profile_query(table_name):
        return f"INSERT INTO {table_name} (email, creation_time) VALUES(%s, to_timestamp(%s))"

    @staticmethod
    def update_user_profile_query(table_name, email):
        return f"UPDATE {table_name} SET profile_bio = %s, photo_url = %s, first_name = %s, last_name = %s, sex = %s," \
               f" birthday = %s, age = %s, smoking = %s, like_animals = %s, keeps_kosher = %s," \
               f" first_roomate_appartment = %s, profession = %s, status = %s, hobbies = %s, has_animals = %s," \
               f" alergies = %s WHERE email = '{email}'"

    @staticmethod
    def insert_new_apartment_post_query(table_name):
        return f"""
                    INSERT INTO {table_name} (
                        email, city, street, number, floor, total_rooms, appartment_size, available_rooms,
                        num_of_toilets, price, post_bio, has_parking, has_elevator, has_mamad, num_of_roommates,
                        allow_pets, has_balcony, status, has_sun_water_heater, is_accessible_to_disabled,
                        has_air_conditioner, has_bars, entry_date, is_sublet, end_date, photos_url, 
                        roommate_emails, creation_timestamp, latitude, longitude
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """

    @staticmethod
    def update_apartment_post_query(table_name):
        return f"""
                    UPDATE {table_name}
                    SET city=%s, street=%s, number=%s, floor=%s, total_rooms=%s, appartment_size=%s, available_rooms=%s,
                        num_of_toilets=%s, price=%s, post_bio=%s, has_parking=%s, has_elevator=%s, has_mamad=%s, num_of_roommates=%s,
                        allow_pets=%s, has_balcony=%s, status=%s, has_sun_water_heater=%s, is_accessible_to_disabled=%s,
                        has_air_conditioner=%s, has_bars=%s, entry_date=%s, is_sublet=%s, end_date=%s, photos_url=%s, 
                        roommate_emails=%s, creation_timestamp=%s
                    WHERE email=%s AND post_id=%s
                    """

    @staticmethod
    def insert_roommates_info_by_appartment_query(table_name):
        return f"INSERT INTO {table_name} VALUES(%s, %s, %s)"

    @staticmethod
    def fetch_user_email_query(table_name, email):
        return f"SELECT email FROM {table_name} WHERE email = '{email}'"

    @staticmethod
    def fetch_user_profile_query(table_name, email):
        return f"SELECT * FROM {table_name} WHERE email = '{email}'"

    @staticmethod
    def fetch_all_user_profiles(table_name):
        return f"SELECT * FROM {table_name}"

    @staticmethod
    def fetch_apartment_query(table_name, email, post_id):
        return f"SELECT * FROM {table_name} WHERE email = '{email}' AND post_id = {post_id}"

    @staticmethod
    def fetch_user_apartments_query(table_name, email):
        return f"SELECT * FROM {table_name} WHERE email = '{email}'"

    @staticmethod
    def delete_user_apartment_query(table_name):
        return f"DELETE FROM {table_name} WHERE email = %s AND post_id = %s"

    @staticmethod
    def find_emails_query(table_name, placeholders):
        return f"SELECT email FROM {table_name} WHERE email IN ({placeholders})"

    @staticmethod
    def fetch_photos_by_emails_query(table_name, placeholders):
        return f"SELECT email, photo_url FROM {table_name} WHERE email IN ({placeholders})"

    @staticmethod
    def fetch_apartments_by_city_query(table_name, city):
        return f"""
            SELECT *
            FROM {table_name}
            WHERE city = '{city}'
        """
      
    @staticmethod
    def fetch_all_apartments_query(table_name):
        return f"SELECT * FROM {table_name} WHERE 1=1"

    @staticmethod
    def fetch_apartment_roomates_details(table_name, emails):
        return f"SELECT CONCAT(first_name, ' ', last_name) as full_name, profile_bio, photo_url " \
               f"FROM {table_name} WHERE email IN ({emails})"

    @staticmethod
    def fetch_base_apartments_query(table_name):
        query = f"""
            SELECT DISTINCT a.*, COUNT(r.email) AS matching_roommates_count
            FROM {table_name} a
            LEFT JOIN LATERAL (
                SELECT json_array_elements(a.roommate_emails)::text AS email
            ) AS email_list ON TRUE
            LEFT JOIN user_profile r ON r.email = TRIM(email_list.email)
            WHERE 1=1
            GROUP BY a.post_id, a.email, a.city, a.street, a.number, a.floor, a.total_rooms, 
                     a.appartment_size, a.available_rooms, a.num_of_toilets, a.price, a.post_bio, 
                     a.has_parking, a.has_elevator, a.has_mamad, a.num_of_roommates, a.allow_pets, 
                     a.has_balcony, a.status, a.has_sun_water_heater, a.is_accessible_to_disabled, 
                     a.has_air_conditioner, a.has_bars, a.entry_date, a.is_sublet, a.end_date, 
                     a.photos_url, a.roommate_emails, a.creation_timestamp
        """
        return query
