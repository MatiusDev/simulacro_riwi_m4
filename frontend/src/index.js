import router from './router.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  const layout = `
    <nav>
      <a href="#/">Login</a>
      <a href="#/doctors">Doctors</a>
      <a href="#/patients">Patients</a>
      <a href="#/appointments">Appointments</a>
    </nav>
    <main id="content"></main>
  `;

  app.innerHTML = layout;

  router();
});
