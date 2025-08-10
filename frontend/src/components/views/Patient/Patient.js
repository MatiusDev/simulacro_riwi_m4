import './Patient.css';

import Modal from '../../layout/Modal.js';

import { getPatients, createPatient, updatePatient, deletePatient } from '../../../api/patientService.js';

const Patient = () => {
  const container = document.createElement('div');
  container.className = 'patient-container p-4';
  // Estado de los pacientes
  let patients = [];

  const handleCreate = () => {
    const onCreate = async () => {
      const name = document.getElementById('patientNameInput').value;
      const email = document.getElementById('patientEmailInput').value;
      const patient = await createPatient({ name, email });
      patients.push(patient);
      render(patients);
    };

    const createComponent = `
      <form>
        <div class="field">
          <label class="label">Nombre</label>
          <div class="control">
            <input class="input" type="text" placeholder="Nombre del paciente" id="patientNameInput">
          </div>
        </div>
        <div class="field">
          <label class="label">Correo electrónico</label>
          <div class="control">
            <input class="input" type="text" placeholder="email@ejemplo.com"" id="patientEmailInput">
          </div>
        </div>
      </form>
    `;

    const modal = Modal({
      title: 'Crear Nuevo Paciente',
      content: createComponent,
      saveButtonText: 'Crear',
      onSave: onCreate
    });

    document.body.appendChild(modal.element);
    modal.open();
  }

  const handleEdit = (id) => {
    const patient = patients.filter(patient => patient.id === parseInt(id))[0];
    const { 
      id: patientId, 
      name: patientName, 
      email: patientEmail
    } = patient;

    const onUpdate = async () => {
      const name = document.getElementById('patientNameInput').value;
      const email = document.getElementById('patientEmailInput').value;
      await updatePatient(id , { name, email });
      patient.name = name;
      patient.email = email;
      render(patients);
    };

    const updateComponent = `
      <form>
        <input type="hidden" id="patientId" value="${patientId}">
  
        <div class="field">
          <label class="label" for="patientNameInput">Nombre</label>
          <div class="control">
            <input
              class="input"
              type="text"
              id="patientNameInput"
              placeholder="Nombre del paciente"
              value="${patientName}"
              required
            >
          </div>
        </div>
  
        <div class="field">
          <label class="label" for="patientEmailInput">Email</label>
          <div class="control">
            <input
              class="input"
              type="email"
              id="patientEmailInput"
              placeholder="email@ejemplo.com"
              value="${patientEmail}"
              required
            >
          </div>
        </div>
      </form>
    `;

    const modal = Modal({
      title: 'Actualizando Paciente',
      content: updateComponent,
      saveButtonText: 'Actualizar',
      onSave: onUpdate
    });

    document.body.appendChild(modal.element);
    modal.open();
  }

  const handleDelete = async (id) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar al paciente con ID ${id}?`)) {
      return;
    }

    try {
      await deletePatient(id);
      patients = patients.filter(p => p.id !== id);
      
      render(patients);
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('No se pudo eliminar al paciente.');
    }
  };

  // --- Delegación de Eventos ---
  container.addEventListener('click', (event) => {
    const createButton = event.target.closest('#btnCreate'); 
    const editButton = event.target.closest('#btnEdit');
    const deleteButton = event.target.closest('#btnDelete');

    if (createButton) {
      handleCreate();
    }

    if (editButton) {
      const id = editButton.dataset.id;
      handleEdit(id);
      return;
    }

    if (deleteButton) {
      const id = deleteButton.dataset.id;
      handleDelete(id);
      return;
    }
  });

  const loadPatients = async () => {
    try {
      container.innerHTML = '<p>Cargando pacientes...</p>';
      patients = await getPatients();
      render(patients);
    } catch (error) {
      console.error('Error loading patients:', error);
      container.innerHTML = '<p class="has-text-danger">Error al cargar los pacientes.</p>';
    }
  };

  loadPatients();

  const render = (patientList) => {
    const topSection = `
      <div class="level">
        <div class="level-left">
          <h1 class="title has-text-white">Pacientes</h1>
        </div>
        <div class="level-right">
          <button id="btnCreate" class="button is-primary">
            <span class="icon is-small"><i class="fas fa-plus"></i></span>
            <span>Crear Nuevo</span>
          </button>
        </div>
      </div>
    `;

    const tableHeader = `
      <div class="columns is-mobile has-background-grey-darker has-text-white p-2 is-hidden-mobile">
        <div class="column">Nombre</div>
        <div class="column">Email</div>
        <div class="column is-narrow has-text-centered">Acciones</div>
      </div>
    `;

    const patientRows = patientList.map((patient, index) => {
      const rowClass = index % 2 === 0 ? 'has-background-white-ter' : '';
      return `
        <div class="columns is-mobile is-vcentered p-2 ${rowClass}">
          <div class="column" data-label="Nombre">${patient.name}</div>
          <div class="column" data-label="Email">${patient.email}</div>
          <div class="column is-narrow">
            <div class="buttons are-small">
              <button id="btnEdit" class="button is-warning" data-id="${patient.id}">
                <span class="icon"><i class="fas fa-edit"></i></span>
                <span>Editar</span>
              </button>
              <button id="btnDelete" class="button is-danger" data-id="${patient.id}">
                <span class="icon"><i class="fas fa-trash-alt"></i></span>
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      ${topSection}
      <div class="box">
        ${tableHeader}
        ${patientRows}
      </div>
    `;
  };

  return container;
};

export default Patient;
