import csv from 'csv-parser';
import { Readable } from 'stream';

import * as db from '../config/dbConfig.js';

const TABLE = 'patients';

const getPatients = async (req, res) => {
    try {
        const patients = await db.getAll(TABLE);
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Error getting patients', error: error.message });
    }
};

const loadPatients = async (req, res) => {
    try {
        const patients = [];
        const { file } = req;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }
        
        if (file.mimetype !== 'text/csv' && file.mimetype !== 'application/vnd.ms-excel') {
            return res.status(400).json({ message: 'Invalid file type. Please upload a CSV file.' });
        }

        // Using Readable.from to create a readable stream from the file buffer
        const ReadableFileStream = Readable.from(file.buffer); 
        ReadableFileStream
            .pipe(csv({
                bom: true,
                mapHeaders: ({ header }) => {
                    const trimmedHeader = header.trim();
                    if (trimmedHeader === 'Id_paciente') return null;
                    if (trimmedHeader === 'Nombre') return 'name';
                    if (trimmedHeader === 'Correo') return 'email';
                    return trimmedHeader;
                }
            }))
            .on('data', (data) => {              
                if (Object.keys(data).length > 0) {
                    patients.push(data);
                }
            })
            .on('end', async () => {
                try {
                    if (patients.length > 0) {
                        await db.loadData({ 'patients': patients });
                        res.status(200).json({ message: 'Patients loaded successfully from local file' });
                    } else {
                        res.status(400).json({ message: 'No data to load' });
                    }
                } catch (dbError) {
                    res.status(500).json({ message: 'Error loading patients to DB', error: dbError.message });
                }
            });
    } catch (error) {
        res.status(500).json({ message: 'Error loading patients', error: error.message });
    }
}

const createPatient = async (req, res) => {
    try {
        const newPatient = await db.create(TABLE, req.body);
        res.status(201).json(newPatient);
    } catch (error) {
        res.status(500).json({ message: 'Error creating patient', error: error.message });
    }
};

const updatePatient = async (req, res) => {
    try {
        const updatedPatient = await db.update(TABLE, req.params.id, req.body);
        if (!updatedPatient) return res.status(404).json({ message: 'Patient not found' });
        res.json(updatedPatient);
    } catch (error) {
        res.status(500).json({ message: 'Error updating patient', error: error.message });
    }
};

const deletePatient = async (req, res) => {
    try {
        const deletedPatient = await db.remove(TABLE, req.params.id);
        if (!deletedPatient) return res.status(404).json({ message: 'Patient not found' });
        res.json({ message: 'Patient deleted successfully', patient: deletedPatient });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting patient', error: error.message });
    }
};

export { getPatients, loadPatients, createPatient, updatePatient, deletePatient };