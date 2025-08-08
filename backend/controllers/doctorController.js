import express from 'express';

import { getDoctors, createDoctor, updateDoctor, deleteDoctor } from '../services/doctorService.js';

const router = express.Router();

router.get('/', getDoctors);
router.post('/', createDoctor);
router.put('/:id', updateDoctor);
router.delete('/:id', deleteDoctor);

export default router;