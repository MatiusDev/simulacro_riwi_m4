import express from 'express';

import { config } from './config/appConfig.js';

import router from './router.js';

const app = express();

app.use('/api', router);

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
})