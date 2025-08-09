import { getData, sendData } from "./api.js";

const ENDPOINT = 'patients/';

const getPatients = async () => {
    try {
        const data = await getData(ENDPOINT);
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching patients:', error);
    }
};

const createPatient = async () => {};

export { getPatients, createPatient}
