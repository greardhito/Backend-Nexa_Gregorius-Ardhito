# BackendTest Nexa - Gregorius Ardhito

env:
PORT=
JWT_SECRET=secret123
AES_KEY=
DB_HOST=
DB_PORT=
DB_USER=
DB_PASS=
DB_NAME=

Running docker
1. docker build -t backend-nexa
2. docker run -p 3000:3000 --env-file .env backend-nexa
