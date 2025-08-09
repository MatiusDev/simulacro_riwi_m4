import './Patients.css';
import { getPatients } from '../../../api/patientService.js';

const API_BASE_URL = 'http://localhost:3000/api/patients';

const isPrimitive = (value) => {
  return (
    value === null ||
    ['string', 'number', 'boolean'].includes(typeof value)
  );
};

const toDisplayValue = (value) => {
  if (isPrimitive(value)) return String(value);
  return JSON.stringify(value);
};

const getIdFromItem = (item) => item.id || item._id || item.uuid || item.ID || item.Id;

export const Patients = () => {
  const container = document.createElement('div');
  container.classList.add('patients-container');

  container.innerHTML = `
    <div class="patients-header">
      <div class="patients-title">
        <h1>Patients</h1>
        <p>Manage your patients with a clean, modern interface</p>
      </div>
      <div class="patients-actions">
        <button id="refresh-btn" title="Refresh list">Refresh</button>
        <button id="new-btn" class="ghost" title="Create patient">New Patient</button>
      </div>
    </div>
    <div id="feedback" class="feedback" aria-live="polite"></div>
    <div id="list" class="patients-list">
      <div class="loader">Loading patients…</div>
    </div>
    <div id="drawer" class="drawer hidden" role="dialog" aria-modal="true"></div>
  `;

  const feedback = container.querySelector('#feedback');
  const list = container.querySelector('#list');
  const drawer = container.querySelector('#drawer');
  const refreshBtn = container.querySelector('#refresh-btn');
  const newBtn = container.querySelector('#new-btn');

  const showFeedback = (message, type = 'info') => {
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
    if (message) {
      setTimeout(() => {
        feedback.textContent = '';
        feedback.className = 'feedback';
      }, 3000);
    }
  };

  const renderTable = (patients) => {
    if (!Array.isArray(patients)) {
      list.innerHTML = `<div class="empty">No data received from API.</div>`;
      return;
    }

    if (patients.length === 0) {
      list.innerHTML = `<div class="empty">No patients yet. Create the first one!</div>`;
      return;
    }

    // Determine columns from union of keys (prioritizing id and name-like fields)
    const keySet = new Set();
    const priorityKeys = ['id', '_id', 'name', 'fullName', 'firstName', 'lastName', 'email', 'phone', 'age'];
    patients.forEach((p) => Object.keys(p).forEach((k) => keySet.add(k)));
    const allKeys = Array.from(keySet);
    const sortedKeys = [
      ...priorityKeys.filter((k) => keySet.has(k)),
      ...allKeys.filter((k) => !priorityKeys.includes(k))
    ];
    // Limit number of columns for readability
    const columns = sortedKeys.slice(0, 6);

    const table = document.createElement('table');
    table.className = 'patients-table';

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    columns.forEach((col) => {
      const th = document.createElement('th');
      th.textContent = col;
      headRow.appendChild(th);
    });
    const thActions = document.createElement('th');
    thActions.textContent = 'Actions';
    headRow.appendChild(thActions);
    thead.appendChild(headRow);

    const tbody = document.createElement('tbody');
    patients.forEach((item) => {
      const tr = document.createElement('tr');
      columns.forEach((col) => {
        const td = document.createElement('td');
        td.textContent = toDisplayValue(item[col]);
        tr.appendChild(td);
      });

      const tdActions = document.createElement('td');
      tdActions.className = 'actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'ghost';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => openDrawer('edit', item));

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', async () => {
        const id = getIdFromItem(item);
        if (!id) return alert('Cannot determine patient id');
        if (!confirm('Are you sure you want to delete this patient?')) return;
        try {
          const res = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}`, {
            method: 'DELETE'
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          showFeedback('Patient deleted', 'success');
          await loadPatients();
        } catch (err) {
          console.error(err);
          showFeedback('Failed to delete patient', 'error');
        }
      });

      tdActions.appendChild(editBtn);
      tdActions.appendChild(deleteBtn);
      tr.appendChild(tdActions);
      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);

    list.innerHTML = '';
    list.appendChild(table);
  };

  const openDrawer = (mode, data = null) => {
    drawer.classList.remove('hidden');
    const isEdit = mode === 'edit';
    const title = isEdit ? 'Edit Patient' : 'New Patient';
    const id = data ? getIdFromItem(data) : null;
    const samplePayload = isEdit
      ? { ...data }
      : { name: '', email: '', phone: '' };

    // Do not allow direct editing of id fields in payload for PUT body if API rejects
    ['id', '_id', 'uuid', 'ID', 'Id'].forEach((k) => {
      if (samplePayload && k in samplePayload) delete samplePayload[k];
    });

    drawer.innerHTML = `
      <div class="drawer-backdrop"></div>
      <div class="drawer-content">
        <div class="drawer-header">
          <h2>${title}</h2>
          <button id="close-drawer" class="ghost" aria-label="Close">Close</button>
        </div>
        <div class="drawer-body">
          <p class="drawer-tip">Edit the JSON payload. Use valid JSON format.</p>
          <textarea id="payload" class="json-editor" spellcheck="false" rows="14">${
            JSON.stringify(samplePayload, null, 2)
          }</textarea>
          <div class="drawer-actions">
            <button id="save-btn">${isEdit ? 'Save changes' : 'Create patient'}</button>
          </div>
        </div>
      </div>
    `;

    const close = () => drawer.classList.add('hidden');
    drawer.querySelector('.drawer-backdrop').addEventListener('click', close);
    drawer.querySelector('#close-drawer').addEventListener('click', close);
    drawer.querySelector('#save-btn').addEventListener('click', async () => {
      const textarea = drawer.querySelector('#payload');
      let payload;
      try {
        payload = JSON.parse(textarea.value);
      } catch (e) {
        return showFeedback('Invalid JSON', 'error');
      }

      try {
        let res;
        if (isEdit) {
          if (!id) return showFeedback('Cannot determine patient id', 'error');
          res = await fetch(`${API_BASE_URL}/${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } else {
          res = await fetch(`${API_BASE_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        showFeedback(isEdit ? 'Patient updated' : 'Patient created', 'success');
        close();
        await loadPatients();
      } catch (err) {
        console.error(err);
        showFeedback('Request failed. Check console.', 'error');
      }
    });
  };

  const loadPatients = async () => {
    list.innerHTML = `<div class="loader">Loading patients…</div>`;
    try {
      const data = await getPatients();
      renderTable(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      list.innerHTML = `<div class="error">Failed to load patients.</div>`;
    }
  };

  refreshBtn.addEventListener('click', loadPatients);
  newBtn.addEventListener('click', () => openDrawer('create'));

  // Initial load
  loadPatients();

  return container;
};