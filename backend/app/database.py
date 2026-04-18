# =============================================================================
# YouTube Music SQL - Database connection
# =============================================================================
# Reads credentials from .env and creates a connection pool to PostgreSQL.
# All other modules import get_db() from here to get a database connection.
# =============================================================================

import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import os

# Load variable from .env file
load_dotenv()


def get_db():
    """
    Creates and returns a connection to the PostgreSQL database.
    Uses RealDictCursor so query results come back as dictionaries
    instead of tuples, making them easier to work with.
    """
    connection = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        cursor_factory=RealDictCursor,
    )
    return connection
