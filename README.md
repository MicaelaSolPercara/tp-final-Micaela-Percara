# Servidor Backend – Express + MongoDB + JWT

Este proyecto es un servidor backend desarrollado con **Node.js**, **Express** y **MongoDB**, que implementa autenticación de usuarios mediante **JSON Web Tokens (JWT)** y sigue el patrón de arquitectura **MVC (Modelo – Vista – Controlador)**.

El sistema permite a los usuarios registrarse, iniciar sesión y gestionar una entidad protegida llamada **Eventos**, donde cada evento está asociado al usuario autenticado.

## Tecnologías utilizadas

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- dotenv

## Instalación y ejecución

### Requisitos previos
- Node.js instalado
- MongoDB en ejecución (local o mediante Docker)

### Pasos para ejecutar el proyecto

1. Clonar el repositorio:

git clone https://github.com/MicaelaSolPercara/tp-intermedio-Micaela-Percara.git

2. Instalar dependencias:

npm install

3. Crear el archivo .env en la raíz del proyecto siguiendo el ejemplo .env.example.

4. Ejecutar el servidor en modo desarrollo:

npm run dev

El servidor quedará escuchando en:

http://localhost:3000

## Variables de entorno

El proyecto utiliza variables de entorno para manejar datos sensibles y configuraciones.

Se debe crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

PORT=3000

JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1h

MONGODB_URI=mongodb://localhost:27017/tp_backend

## Endpoints disponibles

### Autenticación (públicos)

#### Registrar usuario
- **POST** `/api/auth/register`

Body (JSON):
{
  "name": "Micaela",
  "email": "mica@test.com",
  "password": "123456"
}

#### Login
**POST** /api/auth/login

Body (JSON):
{
  "email": "mica@test.com",
  "password": "123456"
}

Devuelve un token JWT que debe enviarse en los endpoints protegidos.

#### Eventos (protegidos)

Todos los endpoints de eventos requieren el header:

Authorization: Bearer <token>

#### Listar eventos del usuario

**GET** /api/eventos

#### Crear evento

**POST** /api/eventos

Body (JSON):

{
  "fecha": "2026-02-04",
  "hora": "15:30",
  "descripcion": "Control anual",
  "veterinario": "Dra. Lopez"
}

#### Actualizar evento

**PATCH** /api/eventos/:id

#### Eliminar evento

**DELETE** /api/eventos/:id

## Arquitectura (MVC)

El proyecto está organizado siguiendo el patrón **MVC**, separando responsabilidades:

- **Routes**: definen las rutas/endpoints y aplican middlewares.
- **Controllers**: reciben la request, extraen datos y responden.
- **Services**: contienen la lógica de negocio (por ejemplo: validar que el evento pertenezca al usuario).
- **Models**: definen la estructura de datos (DTOs y modelos de MongoDB con Mongoose).
- **Middlewares**: autenticación JWT y manejo de acceso.

Estructura de carpetas:

src/
controllers/
services/
models/
routes/
middlewares/
database/
types/


## Pruebas (Postman / Thunder Client)

Flujo recomendado para probar:

1. **POST** `/api/auth/register` 
2. **POST** `/api/auth/login` 
3. Usar el token en `Authorization: Bearer <token>`
4. Probar eventos:
   - **POST** `/api/eventos`
   - **GET** `/api/eventos`
   - **PATCH** `/api/eventos/:id`
   - **DELETE** `/api/eventos/:id`
