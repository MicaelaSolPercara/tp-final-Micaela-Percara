# 🐾 Patitas Felices – Sistema de Gestión Veterinaria

Trabajo Práctico Final – Backend Developer

Aplicación backend desarrollada con Node.js, Express y MySQL para la gestión de turnos veterinarios, con autenticación JWT y control de acceso por roles.

---

## 🚀 Tecnologías utilizadas

- Node.js
- Express
- TypeScript
- MySQL
- JWT (jsonwebtoken)
- bcrypt
- express-validator
- dotenv
- express-rate-limit

Configuración TypeScript:
- Compilación a carpeta `dist`
- Modo desarrollo con `ts-node-dev`

---

## 🏗️ Arquitectura

El proyecto sigue el patrón **MVC (Model - View - Controller)**:
src/
├── controllers/
├── services/
├── models/
├── routes/
├── middlewares/
├── database/
├── types/
└── index.ts


Incluye:
- Middleware de autenticación con JWT
- Middleware centralizado de manejo de errores
- Validaciones robustas con express-validator
- Control de acceso basado en roles

---

## 👥 Sistema de Roles

| Rol       | ID | Permisos |
|------------|----|----------|
| ADMIN      | 1  | Puede crear, editar y eliminar turnos |
| VET        | 2  | Puede crear y modificar turnos |
| DUENO      | 3  | Solo puede visualizar turnos |

---

## 🔐 Autenticación

Se utiliza JWT para autenticación.

El token debe enviarse en cada request protegida:


---

## 🗄️ Base de Datos

El proyecto utiliza MySQL.

Se incluye un dump de la base de datos:

Este archivo contiene:
- Estructura de tablas
- Relaciones (Foreign Keys)
- Roles preconfigurados
- Usuarios de prueba

### Restaurar base de datos

Desde phpMyAdmin:
1. Crear base de datos nueva
2. Ir a Importar
3. Seleccionar `veterinaria_patitas_felices.sql`
4. Ejecutar

---

## 👤 Usuarios de prueba

ADMIN:
- Email: administradora@patitas.com
- Password: 123456

VETERINARIO:
- Email: veterinario@patitas.com
- Password: 123456

DUENO:
- Email: dueno@patitas.com
- Password: 123456

---

## ⚙️ Instalación

1. Clonar repositorio
2. Instalar dependencias:

3. Crear archivo `.env` basado en `.env.example`

4. Ejecutar proyecto:

Modo desarrollo: npm run dev

Modo producción: npm run dev build
                 npm start


Servidor disponible en: http://localhost:3000


---

## 📌 Endpoints principales

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`

### Eventos (protegidos)
- GET `/api/eventos`
- POST `/api/eventos`
- PATCH `/api/eventos/:id`
- DELETE `/api/eventos/:id`

---

## 🎨 Frontend

La carpeta `public/` contiene las vistas HTML, CSS y JavaScript del sistema.

El diseño visual fue realizado utilizando **Stitch** para la maquetación inicial y posteriormente adaptado manualmente al proyecto.

---

## 🤖 Uso de Inteligencia Artificial

Se utilizó Inteligencia Artificial como asistente técnico para:

- Resolución de errores
- Explicación de conceptos
- Mejora estructural del código
- Optimización de validaciones
- Apoyo en debugging

El código fue comprendido, adaptado y validado manualmente.

---

## 📚 Conceptos aplicados

- Arquitectura MVC
- Autenticación con JWT
- Hash de contraseñas con bcrypt
- Control de acceso por roles
- Manejo centralizado de errores
- Validaciones con express-validator
- Conexión a MySQL mediante pool de conexiones

---

## ✨ Autora

Micaela Percara  
Trabajo Práctico Final – Backend