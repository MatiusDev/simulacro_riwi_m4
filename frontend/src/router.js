import { Login } from './components/views/Login/Login.js';
import { Doctors } from './components/views/Doctors.js';
import { Patients } from './components/views/Patients/Patients.js';
import { Appointments } from './components/views/Appointments.js';
import { NotFound } from './components/NotFound.js';

const routes = {
  '#/': { sectionId: 'login', component: Login },
  '#/doctors': { sectionId: 'doctors', component: Doctors },
  '#/patients': { sectionId: 'patients', component: Patients },
  '#/appointments': { sectionId: 'appointments', component: Appointments }
};

const router = () => {
  const path = window.location.hash || '#/';
  const component = routes[path] ? routes[path]['component']() : NotFound();
  setView(component);
};

const setView = (view) => {
  const content = document.getElementById('content');

  if (typeof view === 'string') {
    content.innerHTML = view;
  } else if (view instanceof HTMLElement) {
    content.innerHTML = '';
    content.appendChild(view);
  } else {
    throw new Error('An error ocurred while rendering the view');
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

export default router;