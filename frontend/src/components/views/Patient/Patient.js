import './Patient.css';
import { getPatients } from '../../../api/patientService.js';

const Patient = () => {
  const container = document.createElement('div');

  const loadPatients = async () => {
    try {
      const patients = await getPatients();
      console.log(patients);
    } catch (error) {
      console.log('Error loading patients:', error);
    }
  }
  loadPatients();
  container.innerHTML = `
    <h1>Patients</h1>
  `;
  return container;
};

export default Patient;