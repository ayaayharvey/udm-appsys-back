import {Pool, PoolConfig } from "pg";
import dotenv from 'dotenv';
dotenv.config();

const config: PoolConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
    ssl: true
}

const database = new Pool(config);

database.on('connect', () => {
    console.log('connected to database');
})

database.on('error', (err) => {
    console.log('error connecting to databse: ', err);
})

export default database;