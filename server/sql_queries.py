class Queries:

    @staticmethod
    def insert_health_query(table_name):
        return f"INSERT INTO {table_name} VALUES(to_timestamp(%s))"

    @staticmethod
    def insert_registration_info_query(table_name):
        # creation timestamp, email, password
        return f"INSERT INTO {table_name} (creation_time, email, password) VALUES(to_timestamp(%s), %s, %s)"

    @staticmethod
    def insert_new_user_profile_query(table_name):
        return f"INSERT INTO {table_name} (user_id) VALUES(%s)"

    @staticmethod
    def update_user_profile_query(table_name, profile_id):
        return f"UPDATE {table_name} SET profile_bio = %s, photo_url= %s, first_name = %s, last_name = %s," \
               f"sex = %s, birthday = %s, age = %s, smoking = %s, like_animals = %s, keep_kosher = %s," \
               f"first_Roomate_appartment = %s, profession = %s, status = %s, hobbies = %s, has_animals = %s," \
               f"alergies = %s WHERE profile_id = {profile_id}"

    @staticmethod
    def insert_new_appartment_post_query(table_name):
        return f"INSERT INTO {table_name} VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, " \
               f"%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"  # 24 params

    @staticmethod
    def insert_roomates_info_by_appartment_query(table_name):
        return f"INSERT INTO {table_name} VALUES(%s, %s, %s)"

    @staticmethod
    def fetch_user_email_query(table_name, email):
        return f"SELECT email FROM {table_name} WHERE email = '{email}'"

    @staticmethod
    def fetch_user_id_query(table_name, email):
        return f"SELECT user_id FROM {table_name} WHERE email = '{email}'"

    @staticmethod
    def fetch_user_password_query(table_name, email):
        return f"SELECT password FROM {table_name} WHERE email = '{email}'"

