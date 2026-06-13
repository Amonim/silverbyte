import fs from 'fs';
import path from 'path';
import pool from './db';

async function runMigration() {
  try {
    const sqlFile = path.join(__dirname, 'migrations', 'init.sql');
    const sql = fs.readFileSync(sqlFile, 'utf-8');
    
    await pool.query(sql);

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
