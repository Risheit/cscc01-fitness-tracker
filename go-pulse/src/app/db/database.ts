import { Pool } from 'pg';

import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.DB_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number.parseInt(process.env.DB_REMOTE_PORT ?? ''),
});

export default pool;