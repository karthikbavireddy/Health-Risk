import os
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), 'backend', '.env'))
import psycopg2
DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    print('ENV NOT SET')
    exit(1)
try:
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    cur.execute('SELECT 1')
    print('Result:', cur.fetchone())
    conn.close()
    print('Database connection successful!')
except Exception as e:
    print('Database connection failed:', e)

