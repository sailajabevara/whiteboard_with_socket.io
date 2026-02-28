# Collaborative Real-Time Whiteboard

## Project Overview

This project is a production-ready real-time collaborative whiteboard application.

Users can:

- Login using session test login
- Create boards
- Save boards
- Load boards
- Draw using pen tool
- Draw rectangles
- See other users in real-time
- See live cursors
- Undo and redo actions

Technologies used:

- React
- Node.js
- Express
- Socket.io
- PostgreSQL
- Docker

---

## Architecture

Frontend:
React + Canvas API + Socket.io Client

Backend:
Node.js + Express + Socket.io Server

Database:
PostgreSQL

All services run using Docker Compose.

---

## Run Project

Run this command:

docker compose up --build

---

## Ports

Frontend:

http://localhost:4000

Backend:

http://localhost:3001

Database:

PostgreSQL Port 5432

---

## Health API

GET /health

Example:

http://localhost:3001/health

Response:

{
 "status":"ok",
 "timestamp":"ISO_DATE"
}

---

## Authentication APIs

### Test Login

GET /auth/test

Example:

http://localhost:3001/auth/test

Creates session user.

---

### Session API

GET /api/auth/session

Response:

{
 "user":{
   "id":"1",
   "name":"Test User",
   "email":"test@test.com",
   "image":""
 }
}

---

## Boards API

### Create Board

POST /api/boards

Response:

{
 "boardId":"uuid"
}

---

### Save Board

POST /api/boards/:boardId

Body:

{
 "objects":[]
}

Response:

{
 "success":true,
 "boardId":"uuid"
}

---

### Load Board

GET /api/boards/:boardId

Response:

{
 "boardId":"uuid",
 "objects":[],
 "updatedAt":"date"
}

---

## WebSocket Events

### Join Room

Client → Server

joinRoom

Payload:

{
 "boardId":"string"
}

---

### Draw Events

Client → Server

draw

Server → Client

drawUpdate

---

### Rectangle Events

Client → Server

addObject

Server → Client

objectAdded

---

### Cursor Events

Client → Server

cursorMove

Server → Client

cursorUpdate

---

### Users Events

Server → Client

roomUsers

Payload:

{
 "users":[
  {
   "id":"string",
   "name":"string"
  }
 ]
}

---

## Features

Drawing Tools:

- Pen Tool
- Rectangle Tool
- Color Picker
- Brush Size

Real-Time Features:

- Multi User Sync
- Live Drawing
- Live Rectangles
- Live Cursor

Board Storage:

- Save Board
- Load Board

Collaboration:

- Users List
- Room Join
- Multi User Support

State Management:

- Undo
- Redo

---

## Docker Services

Backend:

- Node.js API
- WebSocket Server

Frontend:

- React Application

Database:

- PostgreSQL
- Auto Seed Tables

---

## Folder Structure

whiteboard-app/

backend/
server.js
seeds/init.sql
Dockerfile

frontend/
src/Board.jsx
Dockerfile

docker-compose.yml

.env.example

submission.json

README.md

---

## Environment Variables (.env.example)

DATABASE_URL=postgresql://user:password@db:5432/whiteboard

POSTGRES_USER=user

POSTGRES_PASSWORD=password

POSTGRES_DB=whiteboard

PORT=3001

GOOGLE_CLIENT_ID=test

GOOGLE_CLIENT_SECRET=test

---

## submission.json

{
 "testUser":{
   "email":"testuser@example.com"
 },
 "oauthCredentials":{
   "google":{
     "clientId":"test-client-id",
     "clientSecret":"test-client-secret"
   }
 }
}

---

## Verification

Requirement 1

Docker compose starts:

- frontend OK
- backend OK
- db OK

Requirement 2

.env.example present OK

Requirement 3

submission.json present OK

Requirement 4

Health API works OK

Requirement 5

Session API works OK

Requirement 6

Board creation works OK

Requirement 7

Board save works OK

Requirement 8

Board load works OK

Requirement 9

WebSocket joinRoom works OK

Requirement 10

Users list works OK

Requirement 11

Cursor sync works OK

Requirement 12

Pen tool works OK

Requirement 13

Rectangle tool works OK

Requirement 14

Undo works OK

Requirement 15

Redo works OK

---

## Author

Collaborative Whiteboard Project

Real-time Canvas + WebSockets + Docker