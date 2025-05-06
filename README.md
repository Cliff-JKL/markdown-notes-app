# Markdown Notes App

## Description

This app is built with:
- NestJS framework
- MongoDB database
- ReactJS
- Docker Compose

## Installation

1. Download and start docker container in database folder:

```bash
cd database
docker-compose up -d
```

2. Install node modules in both server & client:
```bash
cd server
npm install
cd ../client
npm install
```

## Running the app

### Dev watch mode:
```bash
cd server
npm run start:dev
cd ../client
npm run dev
```

<a href="http://localhost:9000/auth" target="_blank">Open in browser</a>.

### Prod mode:
```bash
cd server
npm run start:prod
cd ../client
npm run build
npm run start
```

<a href="http://localhost:3002/auth" target="_blank">Open in browser</a>.