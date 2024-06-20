# Bdeo Task Manager Application

## Description
This project is a task management application developed using Angular for the frontend and Node.js with Express for the backend. It utilizes MongoDB as the database for storing tasks.

## Prerequisites
Before running the application, ensure you have the following installed:
- Node.js
- npm
- MongoDB

## Frontend Setup and Run

### Installation
1. Navigate to the `bdeo-task-manager-frontend` directory:
   ```bash
   cd bdeo-task-manager-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server
Run the frontend server in development mode:
   ```bash
   npm start
   ```
Navigate to `http://localhost:4200/` in your browser.

## Backend Setup and Run

### Installation
1. Navigate to the `bdeo-task-manager-backend` directory:
   ```bash
   cd bdeo-task-manager-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server
Run the backend server:
   ```bash
   npm start
   ```
The backend will start running on `http://localhost:3000/`.

## MongoDB Setup

### Installation
1. Install MongoDB Community Edition by following the instructions on the official MongoDB documentation: [MongoDB Installation](https://docs.mongodb.com/manual/installation/).

### Running MongoDB
1. Start the MongoDB server:
   ```bash
   mongod
   ```
   By default, MongoDB will run on `mongodb://localhost:27017`.

## Running Tests

### Frontend Tests
Run frontend unit tests using Karma and Jasmine:
   ```bash
   npm test
   ```

### Backend Tests
Run backend tests using Mocha and Chai:
   ```bash
   npm test
   ```

## Additional Notes
- Adjust MongoDB connection settings in the backend (`bdeo-task-manager-backend/src/config/db.js`) if necessary.
- Ensure both frontend and backend servers are running simultaneously to use the application correctly.
