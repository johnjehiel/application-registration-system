
---

# Application Registration System

This is a MERN (MongoDB, Express.js, React.js, Node.js) stack application designed for managing registration of Applications. This README provides detailed instructions for setting up and running the project.

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Libraries Used](#libraries-used)
   - [Frontend](#frontend)
   - [Backend](#backend)
3. [Installation Instructions](#installation-instructions)
   - [Prerequisites](#prerequisites)
4. [Project Structure](#project-structure)
5. [Creating Necessary Directories](#creating-necessary-directories)
6. [Environment Variables](#environment-variables)
7. [Running the Application](#running-the-application)
8. [Docker Setup (optional)](#docker-setup)

## Tech Stack

- **MongoDB**: A NoSQL database for storing application data.
- **Express.js**: A minimal and flexible Node.js web application framework.
- **React.js**: A JavaScript library for building user interfaces.
- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **TailwindCSS**: A utility-first CSS framework for rapid UI development.

## Libraries Used

### Frontend

- `@reduxjs/toolkit`: For state management.
- `@testing-library/jest-dom`: Custom Jest matchers for asserting on DOM nodes.
- `@testing-library/react`: Simple and complete React DOM testing utilities.
- `axios`: Promise based HTTP client for the browser and node.js.
- `date-fns`: Modern JavaScript date utility library.
- `react`: A JavaScript library for building user interfaces.
- `react-dom`: Serves as the entry point to the DOM and server renderers for React.
- `react-helmet-async`: A reusable React component to manage changes to the document head.
- `react-icons`: Include popular icons in your React projects easily.
- `react-infinite-scroll-component`: An infinite scroll component for React.
- `react-redux`: Official React bindings for Redux.
- `react-router-dom`: DOM bindings for React Router.
- `react-scripts`: Scripts and configuration used by Create React App.
- `react-toastify`: Allows you to add notifications to your app with ease.
- `redux`: A Predictable State Container for JS Apps.
- `redux-thunk`: Thunk middleware for Redux.
- `tailwindcss`: A utility-first CSS framework.
- `web-vitals`: Essential metrics for a healthy site.

### Backend

- `bcryptjs`: Library to hash passwords.
- `cookie-parser`: Parse HTTP request cookies.
- `cors`: Middleware for enabling Cross-Origin Resource Sharing.
- `dotenv`: Loads environment variables from a .env file into process.env.
- `express`: Fast, unopinionated, minimalist web framework for Node.js.
- `jsonwebtoken`: For securely transmitting information between parties as a JSON object.
- `moongose`: MongoDB object modeling tool designed to work in an asynchronous environment.
- `multer`: Middleware for handling multipart/form-data, primarily used for uploading files.
- `nodemon`: Utility that will monitor for any changes in your source and automatically restart your server.

## Installation Instructions

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v20.x or later)
- **npm** (v8.x or later) or **yarn**

#### Install Node.js and npm

**Windows:**

1. Download the Node.js installer from the [official website](https://nodejs.org/en/download/package-manager).
2. Run the installer and follow the setup steps.
3. Verify the installation by running:
    ```sh
    node -v
    npm -v
    ```

**Linux:**

For Debian-based distributions:

```sh
sudo apt update
sudo apt install nodejs npm
node -v
npm -v
```

For other distributions, please refer to the official Node.js [installation guide](https://nodejs.org/en/download/package-manager/).

**macOS:**

1. Using Homebrew:
    ```sh
    brew install node
    node -v
    npm -v
    ```

2. Download the Node.js installer from the [official website](https://nodejs.org/).


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
│   ├── /uploads
│   └── ...
├── docker-compose.yaml
└── .env
```

## Creating Necessary Directories

### Create Uploads Directory for Multer

1. Navigate to the `server` directory:

    ```sh
    cd server
    ```

2. Create the `upload` directory:

    ```sh
    mkdir uploads
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

## Docker Setup (optional)

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
