import './index.css';

import router from './router.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  const layout = `
    <main id="content"></main>
  `;

  app.innerHTML = layout;

  router();
});
