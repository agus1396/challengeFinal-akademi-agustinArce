# challengeFinal-akademi-agustinArce

Proyecto final desarrollado para la Akademi de Vortex.

## 🚀 Descripción

Plataforma educativa fullstack con roles diferenciados (superadmin, profesor, alumno). Permite:

- Registro e inicio de sesión con JWT.
- Recuperación de contraseña por email.
- Paneles personalizados según rol.
- Gestión de cursos, inscripciones y calificaciones.
- Paginación, ordenamiento y filtros.
- Dashboard responsivo hecho con React, TailwindCSS y Redux.

---

## 🛠️ Tecnologías

**Frontend**

- React
- Redux clásico
- Redux Thunk
- TailwindCSS
- Axios
- React Router DOM

**Backend**

- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT
- Bcrypt
- Nodemailer

---

## 📦 Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/agus1396/challengeFinal-akademi-agustinArce.git
cd challengeFinal-akademi-agustinArce
```

### 2. Instalar dependencias

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

---

### 3. Configurar variables de entorno

#### Backend (`server/.env`)

Crear un archivo `.env` dentro de la carpeta `server` con el siguiente contenido:

```
MONGODB_URL=TU_URL_MONGO
JWT_SECRET=TU_SECRETO
EMAIL_USER=TU_EMAIL
EMAIL_PASS=TU_APP_PASSWORD
FRONTEND_URL=http://localhost:3001
```

#### Frontend (`client/.env`)

Crear un archivo `.env` dentro de la carpeta `client` con esta variable:

```
REACT_APP_API_URL=http://localhost:3000
```

---

### 4. Ejecutar el servidor y el cliente

#### Iniciar backend

```bash
cd server
npm run dev
```

#### Iniciar frontend

En otra terminal:

```bash
cd client
npm start
```

---

## 🧪 Extras

- Incluye colección de Postman para probar los endpoints.
- Base de datos ya configurada en MongoDB Atlas.
- Usuario Superadmin disponible para acceder y gestionar todo el sistema.

---

## ✅ Listo para entregar

Este proyecto fue testeado, documentado y validado para cumplir con todos los requisitos del desafío final.
