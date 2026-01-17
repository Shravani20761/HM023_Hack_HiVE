import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrate = async () => {
    try {
        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const sqlsql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running migration...');
        await pool.query(sqlsql);
        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
