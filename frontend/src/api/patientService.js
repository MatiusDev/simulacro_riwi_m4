import { getData, sendData, updateData, deleteData } from "./api.js";

const ENDPOINT = 'patients';

const getPatients = async () => {
    try {
        const data = await getData(ENDPOINT);
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching patients:', error);
    }
};

const createPatient = async (patient) => {
    try {
        const data = await sendData(ENDPOINT, patient);
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error posting patients:', error);
    }
}

const updatePatient = async (id, patient) => {
    try {
        const data = await updateData(ENDPOINT, id, patient);
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error updating patients:', error);
    }
}

const deletePatient = async (id) => {
    try {
        await deleteData(ENDPOINT, id);
    } catch (error) {
        console.log('Error deleting a patient', error);
    }
}

export { getPatients, createPatient, updatePatient, deletePatient };
