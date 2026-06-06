import fs from 'fs/promises';
import path from 'path';
import pool from './db';

const USERS_FILE = path.join(__dirname, 'data', 'users.json');

const LEVELS = [0, 300, 700, 1500, 3000];

function calculateLevel(xp: number): number {
  let level = 1;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i]) {
      level = i + 1;
    }
  }
  if (level > 5) level = 5;
  return level;
}

async function migrateUsers() {
  const client = await pool.connect();
  try {
    console.log('Creating users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1
      )
    `);
    console.log('Table users created or already exists.');

    console.log('Reading users.json...');
    let usersData = '[]';
    try {
      usersData = await fs.readFile(USERS_FILE, 'utf-8');
    } catch (e) {
      console.log('users.json not found or empty, skipping data migration.');
      return;
    }

    const users = JSON.parse(usersData);
    console.log(`Found ${users.length} users in users.json. Migrating...`);

    let migratedCount = 0;
    for (const user of users) {
      if (!user.email) continue;

      const checkResult = await client.query('SELECT id FROM users WHERE email = $1', [user.email]);
      if (checkResult.rows.length === 0) {
        const xp = user.xp || 0;
        const level = calculateLevel(xp);
        
        await client.query(
          `INSERT INTO users (name, email, password, xp, level)
           VALUES ($1, $2, $3, $4, $5)`,
          [user.name || null, user.email, user.password || null, xp, level]
        );
        migratedCount++;
      } else {
        console.log(`User ${user.email} already exists in DB, skipping.`);
      }
    }
    
    console.log(`Migration completed successfully! Migrated ${migratedCount} new users.`);
  } catch (error) {
    console.error('Error migrating users:', error);
  } finally {
    client.release();
  }
}

migrateUsers().then(() => process.exit(0));
