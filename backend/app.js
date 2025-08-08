import express from 'express';

import { config } from './config/appConfig.js';

import router from './router.js';

const app = express();
const { SV_PORT, DB_POOL } = config;

app.use('/api', router);

DB_POOL.connect()
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection error:', err));

app.listen(SV_PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
})