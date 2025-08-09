import { Login } from './components/views/Login/Login.js';
import { Doctor } from './components/views/Doctor/Doctor.js';
import { Patient } from './components/views/Patient/Patient.js';
import { Appointment } from './components/views/Appointment/Appointment.js';
import { NotFound } from './components/NotFound.js';

import { Navbar } from './components/layout/Navbar.js';
import { Section } from './components/layout/Section.js';

const routes = {
  '#/': { sectionId: 'login', component: Login, private: false },
  '#/doctors': { sectionId: 'doctors', component: Doctor, private: true },
  '#/patients': { sectionId: 'patients', component: Patient, private: true },
  '#/appointments': { sectionId: 'appointments', component: Appointment, private: true },
  '#/notfound': { sectionId: 'notfound', component: NotFound, private: false }
};

const handleRouting = () => {
  const path = window.location.hash || '#/';
  const currentUser = null; // Replace with real auth check

  if (currentUser && path === '#/') {
    window.location.hash = '#/doctors';
    return null;
  }

  const route = routes[path];

  if (!route) {
    window.location.hash = '#/notfound';
    return null;
  }

  if (route.private && !currentUser) {
    window.location.hash = '#/';
    return null;
  }

  return route;
};

const renderComponent = (componentElement, isPrivate, sectionId) => {
  const content = document.getElementById('content');
  content.innerHTML = '';

  if (isPrivate) {
    content.appendChild(Navbar());
    const section = Section(sectionId, componentElement);
    content.appendChild(section);
  } else {
    content.appendChild(componentElement);
  }
};

const router = async () => {
  const route = handleRouting();
  if (!route) {
    return; // Redirection occurred
  }

  const componentResult = route.component();
  const componentElement = (componentResult instanceof Promise)
    ? await componentResult
    : componentResult;

  renderComponent(componentElement, route.private, route.sectionId);
};

const onHashChange = () => {
    router().catch(error => {
        console.error(error);
        document.getElementById('content').innerHTML = '<h1>Error loading page</h1>';
    });
}

window.addEventListener('hashchange', onHashChange);
window.addEventListener('load', onHashChange);

export default router;