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
                        roommate_emails, creation_timestamp
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
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

    def find_emails_query(table_name, placeholders):
        return f"SELECT email FROM {table_name} WHERE email IN ({placeholders})"

    @staticmethod
    def fetch_photos_by_emails_query(table_name, placeholders):
        return f"SELECT email, photo_url FROM {table_name} WHERE email IN ({placeholders})"

    @staticmethod
    def insert_message_query():
        return f"""
            INSERT INTO messages (sender_email, receiver_email, message_text)
            VALUES (%s, %s, %s)
        """

    @staticmethod
    def fetch_latest_conversations_query():
        return f"""
            SELECT 
                GREATEST(sender_email, receiver_email) AS user_email,
                MAX(id) as last_message_id
            FROM messages
            WHERE sender_email = %s OR receiver_email = %s
            GROUP BY LEAST(sender_email, receiver_email), GREATEST(sender_email, receiver_email)
            ORDER BY last_message_id DESC;
        """

    @staticmethod
    def fetch_last_message_by_id_query():
        return f"""
            SELECT * FROM messages WHERE id = %s
        """

    @staticmethod
    def fetch_messages_between_users_query():
        return f"""
            SELECT sender_email, receiver_email, message_text, timestamp, is_read 
            FROM messages
            WHERE (sender_email = %s AND receiver_email = %s)
               OR (sender_email = %s AND receiver_email = %s)
            ORDER BY timestamp ASC;
        """

    @staticmethod
    def mark_messages_as_read_query():
        return f"""
            UPDATE messages
            SET is_read = TRUE
            WHERE receiver_email = %s AND sender_email = %s AND is_read = FALSE;
        """

    @staticmethod
    def fetch_unread_message_count_query():
        return f"""
            SELECT COUNT(*)
            FROM messages
            WHERE receiver_email = %s AND sender_email = %s AND is_read = FALSE
        """
