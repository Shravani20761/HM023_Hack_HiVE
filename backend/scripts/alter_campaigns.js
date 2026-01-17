import pool from '../config/db.js';

const alterTable = async () => {
    try {
        const client = await pool.connect();
        try {
            console.log('Altering campaigns table...');

            await client.query(`
                ALTER TABLE campaigns 
                ADD COLUMN IF NOT EXISTS description TEXT,
                ADD COLUMN IF NOT EXISTS start_date DATE,
                ADD COLUMN IF NOT EXISTS end_date DATE;
            `);

            console.log('Campaigns table altered successfully.');
        } finally {
            client.release();
        }
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

alterTable();
