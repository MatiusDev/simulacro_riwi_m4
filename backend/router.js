import express from 'express';

import patientRouter from "./controllers/patientController.js";
import doctorRouter from "./controllers/doctorController.js";
import appointmentRouter from "./controllers/appointmentController.js";

const router = express.Router();

router.use('/patients', patientRouter);
router.use('/doctors', doctorRouter);
router.use('/appointments', appointmentRouter);

export default router;