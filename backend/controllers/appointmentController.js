import express from 'express';

import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from '../services/appointmentService.js';

const router = express.Router();

router.get('/', getAppointments);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

export default router;