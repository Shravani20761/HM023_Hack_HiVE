import { Client, Users, Query } from "node-appwrite";
import dotenv from "dotenv";
import pool from '../config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const usersService = new Users(client);

const syncUsers = async () => {
    try {
        console.log("Starting User Sync...");

        // Fetch users from Appwrite using Query.limit
        const response = await usersService.list([
            Query.limit(100)
        ]);
        const users = response.users;

        console.log(`Found ${users.length} users in Appwrite.`);

        for (const user of users) {
            const upsertQuery = `
                INSERT INTO users (appwrite_user_id, email, name)
                VALUES ($1, $2, $3)
                ON CONFLICT (appwrite_user_id) 
                DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name, created_at = NOW()
                RETURNING id;
            `;

            await pool.query(upsertQuery, [user.$id, user.email, user.name]);
            console.log(`Synced user: ${user.email}`);
        }

        console.log("User Sync Completed Successfully.");
        process.exit(0);

    } catch (error) {
        console.error("User Sync Failed:", error);
        process.exit(1);
    }
};

syncUsers();
