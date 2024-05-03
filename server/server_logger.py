import logging
import os


class Logger:
    if not os.path.exists('logs'):
        os.makedirs('logs')

    def __init__(self, log_level=logging.INFO):
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(log_level)

        # Handler for all logs
        handler_all = logging.FileHandler('logs/all_logs.log')
        formatter_all = logging.Formatter('%(asctime)s - %(levelname)s - %(name)s - %(message)s')
        handler_all.setFormatter(formatter_all)
        self.logger.addHandler(handler_all)

        # Handler for error logs
        handler_error = logging.FileHandler('logs/errors.log')
        formatter_error = logging.Formatter('%(asctime)s - %(levelname)s - %(name)s - %(message)s')
        handler_error.setFormatter(formatter_error)
        handler_error.setLevel(logging.ERROR)  # Only logs errors and above
        self.logger.addHandler(handler_error)

    def log_debug(self, message):
        self.logger.debug(message)

    def log_info(self, message):
        self.logger.info(message)

    def log_error(self, message):
        self.logger.error(message)

    def log_critical(self, message):
        self.logger.critical(message)
