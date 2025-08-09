import express from 'express';
import cors from 'cors';

import { config } from './config/appConfig.js';
import databaseConfig from './config/dbConfig.js'

import router from './router.js';

const app = express();
const { SV_PORT, DB_POOL } = config;

const corsOptions = {
   origin: '*'
};

app.use(cors(corsOptions));

app.use('/api', router);

DB_POOL.connect()
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection error:', err));

const { getAllData } = await databaseConfig(DB_POOL);

const users = await getAllData('users');
console.log(users);


app.listen(SV_PORT, () => {
    console.log(`Server is running on port ${SV_PORT}`);
})