import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_lEYaNp30dKti@ep-summer-scene-ahz9sikm-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
    ssl: {
        rejectUnauthorized: false
    }
});

// Test connection
pool.connect()
    .then(() => console.log('Connected to PostgreSQL (Neon)'))
    .catch(err => console.error('Database connection error', err.stack));

export default pool;
