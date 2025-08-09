export const Navbar = () => {
  const nav = document.createElement('nav');
  nav.innerHTML = `
    <a href="#/doctors">Doctors</a>
    <a href="#/patients">Patients</a>
    <a href="#/appointments">Appointments</a>
  `;
  return nav;
};
