# Proyecto Full-Stack: Clínica

Este es un proyecto de aplicación web Full-Stack que gestiona información de una clínica, incluyendo pacientes, doctores y citas. Utiliza un backend con Node.js y Express, y un frontend con JavaScript puro (Vanilla JS).

## Arquitectura General

El proyecto está dividido en dos partes principales: `backend` y `frontend`.

-   **`backend`**: Una API RESTful construida con Node.js y Express para manejar la lógica de negocio y la comunicación con la base de datos PostgreSQL.
-   **`frontend`**: Una Single Page Application (SPA) construida con JavaScript puro que consume la API del backend para mostrar y gestionar los datos.

---

## Backend

El backend sigue una arquitectura modular y en capas para separar responsabilidades, facilitando el mantenimiento y la escalabilidad.

### Estructura de Archivos

```
backend/
│   ├───app.js              # Punto de entrada, configuración del servidor Express
│   ├───router.js           # Enrutador principal de la API
│   ├───config/
│   │   ├───appConfig.js    # Configuración de la app (puerto, pool de DB)
│   │   └───dbConfig.js     # Lógica de inicialización y CRUD genérico para la DB
│   ├───controllers/
│   │   ├───patientController.js # Enrutador para la entidad Pacientes
│   │   └───...             # Otros controladores
│   └───services/
│       ├───patientService.js # Lógica de negocio para Pacientes
│       └───...             # Otros servicios
```

### Flujo de una Petición

1.  **`app.js`**: Inicia el servidor Express, aplica middlewares como `cors` y `express.json()`, y establece la conexión con la base de datos PostgreSQL. Carga el enrutador principal.
2.  **`router.js`**: Dirige las peticiones entrantes (ej. `/api/patients`) al controlador correspondiente (`patientController.js`).
3.  **`controllers/{entidad}Controller.js`**: Define las rutas específicas para una entidad (GET, POST, PUT, DELETE). Cada ruta invoca una función del servicio correspondiente para manejar la lógica.
4.  **`services/{entidad}Service.js`**: Contiene la lógica de negocio. Interactúa con la base de datos utilizando las funciones genéricas definidas en `dbConfig.js`.
5.  **`config/dbConfig.js`**: Proporciona una capa de abstracción para la base de datos. Contiene funciones reutilizables como `getAll`, `getById`, `create`, `update`, y `remove` que ejecutan consultas SQL. También se encarga de crear las tablas si no existen al iniciar la aplicación.

---

## Frontend

El frontend es una aplicación de una sola página (SPA) que renderiza vistas dinámicamente sin recargar la página.

### Estructura de Archivos

```
frontend/
│   ├───index.html          # Archivo HTML principal
│   └───src/
│       ├───index.js        # Punto de entrada, renderiza la app
│       ├───api/
│       │   ├───api.js      # Funciones genéricas para peticiones HTTP (GET, POST, etc.)
│       │   └───patientService.js # Servicios específicos para la entidad Pacientes
│       ├───components/
│       │   ├───App.js      # Componente principal que inicializa el router
│       │   ├───router.js   # Maneja el enrutamiento del lado del cliente
│       │   ├───layout/     # Componentes reutilizables (Navbar, Modal)
│       │   └───views/      # Vistas de la aplicación (Patient, Doctor, etc.)
│       └───utils/
│           └───localStorage.js # Utilidades (ej. para manejar sesión de usuario)
```

### Flujo de Renderizado y Datos

1.  **`index.js`**: El script principal que se carga y renderiza el componente `App.js` en el `div#app` de `index.html`.
2.  **`App.js`**: Llama al `router` para determinar qué vista mostrar según la URL actual.
3.  **`router.js`**:
    *   Analiza el hash de la URL (ej. `#/patients`).
    *   Verifica si la ruta es privada y si el usuario ha "iniciado sesión" (usando `localStorage` para simular la autenticación).
    *   Si todo es correcto, importa y ejecuta el componente de la vista correspondiente (ej. `Patient.js`).
4.  **`components/views/{Entidad}.js`**:
    *   Este componente es responsable de la lógica y la UI de una entidad.
    *   Llama a las funciones del servicio correspondiente en `api/{entidad}Service.js` para obtener o enviar datos.
    *   Renderiza el HTML, incluyendo tablas, formularios y botones.
    *   Utiliza la delegación de eventos para manejar las interacciones del usuario (crear, editar, eliminar).
5.  **`api/{entidad}Service.js`**: Llama a las funciones genéricas de `api.js` con el endpoint específico (ej. `patients`).
6.  **`api/api.js`**: Realiza la petición `fetch` al backend, maneja la respuesta y los errores.

---

## Guía de Integración de Nuevas Features

Para añadir una nueva entidad (por ejemplo, **Doctores**), sigue el flujo modular utilizado para **Pacientes**.

| Paso | Archivo a Modificar/Crear (Backend) | Descripción de la Tarea |
| :--- | :--- | :--- |
| 1    | `config/dbConfig.js`                | Añade la estructura de la tabla `doctors` en la función `loadTables`. |
| 2    | `services/doctorService.js`         | Crea un nuevo archivo con la lógica de negocio para doctores (obtener, crear, etc.), similar a `patientService.js`. |
| 3    | `controllers/doctorController.js`   | Crea el controlador que define las rutas para `/doctors` y las conecta con `doctorService.js`. |
| 4    | `router.js`                         | Importa y utiliza el nuevo `doctorController` con la ruta base `/api/doctors`. |

| Paso | Archivo a Modificar/Crear (Frontend) | Descripción de la Tarea |
| :--- | :--- | :--- |
| 1    | `api/doctorService.js`              | Crea un nuevo archivo que consuma el endpoint `/doctors` del backend, usando las funciones de `api.js`. |
| 2    | `components/views/Doctor/Doctor.js` | Crea el componente de la vista para listar, crear, editar y eliminar doctores. Debe ser similar a `Patient.js`. |
| 3    | `components/router.js`              | Añade la nueva ruta `#/doctors` al objeto `routes`, apuntando al nuevo componente `Doctor`. |
| 4    | `components/layout/Navbar.js`       | Agrega un enlace en la barra de navegación que apunte a `#/doctors`. |

---

## Guía para Desarrolladores Junior: Integrando la Funcionalidad de "Doctores"

Esta guía detalla cómo puedes continuar el desarrollo implementando el CRUD (Crear, Leer, Actualizar, Borrar) para la entidad **Doctores**.

### Backend

El objetivo es crear un endpoint `/api/doctors` que responda a las peticiones HTTP.

1.  **Definir la Tabla en la Base de Datos**
    -   **Archivo**: `backend/config/dbConfig.js`
    -   **Acción**: Dentro de la función `loadTables`, ya existe la definición para la tabla `doctors`. ¡El primer paso ya está hecho!

2.  **Crear el Servicio**
    -   **Archivo**: `backend/services/doctorService.js`
    -   **Acción**: Este archivo contendrá la lógica. Reemplaza el contenido actual con funciones que usen los métodos de `dbConfig.js`. Inspírate en `patientService.js`.
    -   **Ejemplo**:
        ```javascript
        import * as db from '../config/dbConfig.js';
        const TABLE = 'doctors';

        export const getDoctors = async (req, res) => {
            try {
                const doctors = await db.getAll(TABLE);
                res.json(doctors);
            } catch (error) {
                res.status(500).json({ message: 'Error getting doctors' });
            }
        };

        // Implementa createDoctor, updateDoctor, y deleteDoctor de forma similar...
        ```

3.  **Configurar el Controlador**
    -   **Archivo**: `backend/controllers/doctorController.js`
    -   **Acción**: Este archivo ya conecta las rutas (`/`, `/:id`) a las funciones del servicio. Solo asegúrate de que los nombres de las funciones que importas coincidan con los que exportaste en `doctorService.js`.

4.  **Registrar en el Enrutador Principal**
    -   **Archivo**: `backend/router.js`
    -   **Acción**: El enrutador ya está configurado para usar `doctorController` en la ruta `/doctors`. ¡No necesitas hacer nada aquí!

### Frontend

Ahora, vamos a construir la interfaz para que los usuarios puedan interactuar con los datos de los doctores.

1.  **Crear el Servicio de API**
    -   **Archivo**: `frontend/src/api/doctorService.js` (debes crearlo).
    -   **Acción**: Este archivo se comunicará con tu API del backend. Será casi idéntico a `patientService.js`, pero apuntará al endpoint `doctors`.
    -   **Ejemplo**:
        ```javascript
        import { getData, sendData, updateData, deleteData } from "./api.js";
        const ENDPOINT = 'doctors';

        export const getDoctors = async () => await getData(ENDPOINT);
        export const createDoctor = async (doctor) => await sendData(ENDPOINT, doctor);
        // ...y así sucesivamente para update y delete.
        ```

2.  **Desarrollar la Vista (Componente)**
    -   **Archivo**: `frontend/src/components/views/Doctor/Doctor.js`
    -   **Acción**: Este es el paso más importante. Reemplaza el contenido actual para que haga lo siguiente:
        a.  Llame a `getDoctors()` del servicio que creaste para obtener los datos.
        b.  Renderice una tabla con la lista de doctores y botones de "Editar" y "Eliminar".
        c.  Añada un botón "Crear Nuevo" que abra un modal con un formulario para un nuevo doctor.
        d.  Implemente las funciones `handleCreate`, `handleEdit` y `handleDelete` que llamen a los servicios de la API y actualicen la vista.
    -   **Consejo**: Copia la estructura de `frontend/src/components/views/Patient/Patient.js` y adáptala para los doctores (cambia `name` y `email` por `name` y `specialty`).

3.  **Habilitar la Ruta**
    -   **Archivo**: `frontend/src/components/router.js`
    -   **Acción**: La ruta `#/doctors` ya está definida y apunta al componente `Doctor.js`. ¡No se requiere ningún cambio!

4.  **Añadir Enlace de Navegación**
    -   **Archivo**: `frontend/src/components/layout/Navbar.js`
    -   **Acción**: El enlace a "Doctors" ya existe en la barra de navegación. ¡Listo!

¡Al completar estos pasos, tendrás una funcionalidad full-stack completamente nueva en la aplicación!

## Instalación y Uso

### Prerrequisitos

-   Node.js (v18 o superior)
-   npm (o un gestor de paquetes similar)
-   PostgreSQL

### Backend

1.  Navega a la carpeta `backend`.
2.  Crea un archivo `.env` si es necesario para tus variables de entorno de base de datos o ajústalas en `config/appConfig.js`.
3.  Instala las dependencias: `npm install`.
4.  Inicia el servidor de desarrollo: `npm run dev`.

### Frontend

1.  Navega a la carpeta `frontend`.
2.  Instala las dependencias: `npm install`.
3.  Inicia el servidor de desarrollo: `npm run dev`.
4.  Abre tu navegador en la dirección indicada (normalmente `http://localhost:5173`).
