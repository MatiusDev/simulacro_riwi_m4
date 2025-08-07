import { setUserData } from '../utils/localStorage';

export const Login = () => {
  const container = document.createElement('div');
  container.className = 'section';

  const render = (view = 'login') => {
    container.innerHTML = `
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-half">
            <div class="card">
              <div class="card-header">
                <p class="card-header-title is-centered">
                  Portal Médico
                </p>
              </div>
              <div class="card-content">
                <div class="tabs is-centered is-fullwidth">
                  <ul>
                    <li class="${view === 'login' ? 'is-active' : ''}" id="login-tab"><a>Iniciar Sesión</a></li>
                    <li class="${view === 'register' ? 'is-active' : ''}" id="register-tab"><a>Registrarse</a></li>
                  </ul>
                </div>

                <div id="form-container"></div>
                <div id="message" class="has-text-centered mt-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const formContainer = container.querySelector('#form-container');
    if (view === 'login') {
      formContainer.innerHTML = `
        <div class="field">
          <label class="label">Email</label>
          <div class="control has-icons-left">
            <input class="input" type="email" placeholder="sucorreo@ejemplo.com" id="login-email">
            <span class="icon is-small is-left"><i class="fas fa-envelope"></i></span>
          </div>
        </div>
        <div class="field">
          <label class="label">Contraseña</label>
          <div class="control has-icons-left">
            <input class="input" type="password" placeholder="********" id="login-password">
            <span class="icon is-small is-left"><i class="fas fa-lock"></i></span>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <button class="button is-primary is-fullwidth" id="login-button">Iniciar Sesión</button>
          </div>
        </div>
      `;
    } else {
      formContainer.innerHTML = `
        <div class="field">
          <label class="label">Nombre</label>
          <div class="control">
            <input class="input" type="text" placeholder="Nombre Completo" id="register-name">
          </div>
        </div>
        <div class="field">
          <label class="label">Email</label>
          <div class="control has-icons-left">
            <input class="input" type="email" placeholder="sucorreo@ejemplo.com" id="register-email">
            <span class="icon is-small is-left"><i class="fas fa-envelope"></i></span>
          </div>
        </div>
        <div class="field">
          <label class="label">Contraseña</label>
          <div class="control has-icons-left">
            <input class="input" type="password" placeholder="********" id="register-password">
            <span class="icon is-small is-left"><i class="fas fa-lock"></i></span>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <button class="button is-success is-fullwidth" id="register-button">Crear Cuenta</button>
          </div>
        </div>
      `;
    }
    addEventListeners();
  };

  const addEventListeners = () => {
    // Tab switching
    container.querySelector('#login-tab').addEventListener('click', () => render('login'));
    container.querySelector('#register-tab').addEventListener('click', () => render('register'));

    // Form buttons
    const loginButton = container.querySelector('#login-button');
    if (loginButton) {
      loginButton.addEventListener('click', handleLogin);
    }

    const registerButton = container.querySelector('#register-button');
    if (registerButton) {
      registerButton.addEventListener('click', handleRegister);
    }
  };

  const showMessage = (text, type = 'danger') => {
    const messageEl = container.querySelector('#message');
    messageEl.innerHTML = `<span class="tag is-${type} is-medium">${text}</span>`;
    setTimeout(() => messageEl.innerHTML = '', 3000);
  };

  const handleLogin = () => {
    const email = container.querySelector('#login-email').value;
    const password = container.querySelector('#login-password').value;

    if (!email || !password) {
      return showMessage('Por favor, complete todos los campos.');
    }

    const users = JSON.parse(localStorage.getItem('clinicUsers') || '[]');
    const foundUser = users.find(user => user.email === email && user.password === password);

    if (foundUser) {
      setUserData(foundUser);
      showMessage('Inicio de sesión exitoso!', 'success');
      setTimeout(() => window.location.hash = '#/', 500);
    } else {
      showMessage('Email o contraseña incorrectos.');
    }
  };

  const handleRegister = () => {
    const name = container.querySelector('#register-name').value;
    const email = container.querySelector('#register-email').value;
    const password = container.querySelector('#register-password').value;

    if (!name || !email || !password) {
      return showMessage('Por favor, complete todos los campos.');
    }

    const users = JSON.parse(localStorage.getItem('clinicUsers') || '[]');
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
      return showMessage('Este correo electrónico ya está registrado.');
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('clinicUsers', JSON.stringify(users));
    
    showMessage('¡Registro exitoso! Ahora puede iniciar sesión.', 'success');
    render('login');
  };

  render(); // Initial render
  return container;
};