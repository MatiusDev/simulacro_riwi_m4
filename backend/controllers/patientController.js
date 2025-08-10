import express from 'express';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

import { getPatients, loadPatients, createPatient, updatePatient, deletePatient } from '../services/patientService.js';

const router = express.Router();

router.get('/', getPatients);
router.post('/', createPatient);
router.post('/upload', upload.single('file'), loadPatients);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

export default router;