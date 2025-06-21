Backend - Sistema de Gestión de Consolas
Este es el repositorio del backend para el Sistema de Gestión de Consolas. Proporciona la API RESTful para la gestión de datos.

Tecnologías Utilizadas
AdonisJS: Framework web Node.js.
TypeScript: Lenguaje de programación.
MySQL: Base de datos.
Requisitos Previos
Node.js (v18+ recomendado)
npm
MySQL Server (en ejecución)
Configuración y Ejecución
Sigue estos pasos para poner el backend en marcha:

Clonar el Repositorio:

Bash

git clone <URL_DEL_REPOSITORIO_BACKEND> backend-consolas
cd backend-consolas
Instalar Dependencias:

Bash

npm install
Configurar .env:
Crea un archivo .env en la raíz del proyecto y pega el siguiente contenido:

Fragmento de código

TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY=cnQ0Q5ujSGj08OyVrczxqFqlJYH4dzjt
NODE_ENV=development
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Gomez1824
DB_DATABASE=recuperacion
Importante: Asegúrate de que la base de datos recuperacion exista en tu servidor MySQL.

Ejecutar Migraciones de Base de Datos:
Esto creará las tablas necesarias.

Bash

node ace migration:run
Iniciar el Servidor:

Bash

node ace serve --watch
El backend estará funcionando en http://localhost:3333.
