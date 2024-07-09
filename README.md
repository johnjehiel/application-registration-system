
---

# Application Registration System

This is a MERN (MongoDB, Express.js, React.js, Node.js) stack application designed for managing registration of Applications. This README provides detailed instructions for setting up and running the project.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Creating Necessary Directories](#creating-necessary-directories)
3. [Environment Variables](#environment-variables)
4. [Running the Application](#running-the-application)
5. [Docker Setup](#docker-setup)

## Project Structure

```
application-registration-system/
├── client/
│   ├── .env
│   ├── Dockerfile
│   └── ...
├── server/
│   ├── .env
│   ├── Dockerfile
│   ├── /upload
│   └── ...
├── docker-compose.yaml
└── .env
```

## Creating Necessary Directories

### Create Upload Directory for Multer

1. Navigate to the `server` directory:

    ```sh
    cd server
    ```

2. Create the `upload` directory:

    ```sh
    mkdir upload
    ```

This directory will be used by Multer to store the uploaded PDF files.

## Environment Variables

### Client Environment Variables

Create a `.env` file inside the `client` directory with the following content:

```
REACT_APP_SERVER_URL=http://localhost:3500
```

### Server Environment Variables

Create a `.env` file inside the `server` directory with the following content:

```
NODE_ENV=development
DATABASE={MONGODB_URI}
SECRET_KEY={SECRET_KEY}
JWT_EXPIRES_TIME=7d
PORT=3500
CLIENT_URL=http://localhost:3000
BACKEND_URL=http://localhost:3500
COOKIE_EXPIRES_TIME=7
```

Replace `{MONGODB_URI}` with your actual MongoDB URI and `{SECRET_KEY}` with your actual JWT Secret Key .

### Root Environment Variables for Docker

Create a `.env` file in the root directory with the following content:

```
MONGODB_URI={MONGODB_URI}
```

Replace `{MONGODB_URI}` with your actual MongoDB URI.

## Running the Application

### Running the Client

1. Navigate to the `client` directory:

    ```sh
    cd client
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Start the client application:

    ```sh
    npm start
    ```

### Running the Server

1. Navigate to the `server` directory:

    ```sh
    cd server
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Start the server application:

    ```sh
    npm start
    ```

For development purposes, you can use `npm run dev` to start the server with `nodemon`.

## Docker Setup

### Building and Running with Docker Compose

1. Ensure you have Docker and Docker Compose installed.

2. Create the necessary `.env` files as described above.

3. Navigate to the root directory of the project.

4. Run Docker Compose:

    ```sh
    docker-compose up --build
    ```

This command will build and start the client and server containers. The client will be accessible at `http://localhost:3000` and the server at `http://localhost:3500`.


---