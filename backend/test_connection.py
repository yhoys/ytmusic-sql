# Temporary file to verify database connection
# Can be deleted after confirming the connection works

import sys
import os

# Add the backend folder to the path so we can import from app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import get_db

try:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as total FROM songs;")
    result = cursor.fetchone()
    print(f"Connection successful Songs in database: {result['total']}")
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Connection failed: {e}")
