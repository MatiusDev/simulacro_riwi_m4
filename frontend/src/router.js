import { Login } from './views/Login.js';
import { Doctors } from './views/Doctors.js';
import { Patients } from './views/Patients.js';
import { Appointments } from './views/Appointments.js';
import { NotFound } from './components/NotFound.js';

const routes = {
  '#/': Login,
  '#/doctors': Doctors,
  '#/patients': Patients,
  '#/appointments': Appointments,
};

const router = () => {
  const content = document.getElementById('content');
  const path = window.location.hash || '#/';

  content.innerHTML = routes[path] ? routes[path]() : NotFound();
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

export default router;