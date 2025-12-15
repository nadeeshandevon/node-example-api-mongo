# Customer API

Simple Node.js/Express API to manage basic customer details.

## Setup (local)

Create a `.env` with your database connection (example):

```
MONGO_URI=mongodb://127.0.0.1:27017/customer_api
PORT=3000
```

Then install and run:

```bash
npm install
npm run dev          # ts-node + nodemon
# or
npm run build && npm start   # compiled dist
```

The server starts on `http://localhost:3000` by default. Set `PORT` to override.

## Endpoints

- `GET /health` — health check.
- `GET /customers` — list customers.
- `GET /customers/:id` — get a customer.
- `POST /customers` — create a customer. Body: `{ "firstName", "lastName", "email", "phone?" }`.
- `PUT /customers/:id` — update a customer (any of `firstName`, `lastName`, `email`, `phone`).
- `DELETE /customers/:id` — remove a customer.

Data is stored in MongoDB via Mongoose (see `src/services/customerStore.ts`).

## Docker

Build and run the image:

```bash
docker build -t customer-api .
docker run -p 3000:3000 --env-file .env customer-api
```

## Docker Compose

`docker-compose.yml` runs the API and Mongo together. Current mapping exposes the API on port 3001 (container also uses 3001). Adjust as needed.

```bash
docker-compose up --build
# stop
docker-compose down
# stop and remove volume/data
docker-compose down -v
```

Mongo inside compose is reachable at `mongodb://mongo:27017/customer_api`. If you set `MONGO_URI` in `.env`, ensure it points to `mongo:27017`, not localhost.

## Tests

Uses Jest + supertest with mongodb-memory-server:

```bash
npm test
```

