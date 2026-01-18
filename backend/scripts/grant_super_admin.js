import pool from '../config/db.js';

const grantAdmin = async () => {
    try {
        const client = await pool.connect();
        try {
            const appwriteId = '696beaa9000ed842d814';
            console.log(`Assigning super_admin to Appwrite User ID: ${appwriteId}`);

            const query = `
                INSERT INTO user_system_roles (user_id, system_role_id)
                SELECT u.id, sr.id
                FROM users u, system_roles sr
                WHERE u.appwrite_user_id = $1
                AND sr.name = 'super_admin'
                ON CONFLICT (user_id, system_role_id) DO NOTHING
            `;

            const res = await client.query(query, [appwriteId]);

            // Check if it actually worked (if rowCount 0, maybe user not found or conflict)
            // Let's verify
            const checkQuery = `
                SELECT u.name, sr.name as role
                FROM users u
                JOIN user_system_roles usr ON u.id = usr.user_id
                JOIN system_roles sr ON usr.system_role_id = sr.id
                WHERE u.appwrite_user_id = $1
            `;
            const checkRes = await client.query(checkQuery, [appwriteId]);

            if (checkRes.rows.length > 0) {
                console.log(`Success! User '${checkRes.rows[0].name}' now has roles: ${checkRes.rows.map(r => r.role).join(', ')}`);
            } else {
                console.error("Failed. User might not exist in local DB (try running syncUsers.js) or Role not found.");
            }

        } finally {
            client.release();
        }
        process.exit(0);
    } catch (error) {
        console.error("Grant Admin Failed:", error);
        process.exit(1);
    }
};

grantAdmin();
