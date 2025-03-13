# Login/Signup Application with Docker Compose

## Project Documentation

### Table of Contents
1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Components](#components)
   - [Frontend](#frontend)
   - [Backend](#backend)
   - [Database](#database)
4. [Docker Configuration](#docker-configuration)
5. [Setup Process](#setup-process)
6. [Build and Run Process](#build-and-run-process)
7. [Troubleshooting](#troubleshooting)
8. [Testing and Verification](#testing-and-verification)
9. [Database Inspection](#database-inspection)
10. [Shutdown Process](#shutdown-process)

## Project Overview

This project creates a containerized login/signup application with three separate components:
- Frontend web interface (Flask)
- Backend API (Flask)
- Database (MongoDB)

The components communicate via a private Docker network, and the application demonstrates user registration, authentication, and session management using JWT tokens.

## Project Structure

```
login-signup-app/
├── docker-compose.yml          # Main configuration file for Docker Compose
├── frontend/                   # Frontend application
│   ├── Dockerfile              # Docker configuration for frontend
│   ├── app.py                  # Simple Flask server for frontend
│   ├── requirements.txt        # Python dependencies for frontend
│   ├── static/                 # Static assets
│   │   ├── css/
│   │   │   └── style.css       # CSS styles
│   │   └── js/
│   │       └── script.js       # Frontend JavaScript
│   └── templates/
│       └── index.html          # Main HTML page
├── backend/                    # Backend API
│   ├── Dockerfile              # Docker configuration for backend
│   ├── app.py                  # Flask API
│   └── requirements.txt        # Python dependencies for backend
└── scripts/                    # Helper scripts
    ├── setup.groovy            # Script to set up the project
    └── run.groovy              # Script to run the application
```

## Components

### Frontend

The frontend is a simple Flask web application that serves HTML, CSS, and JavaScript files. It provides a user interface for signing up, logging in, and logging out.

**Key Files:**
- `frontend/app.py`: Flask server that serves the frontend
- `frontend/templates/index.html`: HTML for the login/signup forms
- `frontend/static/js/script.js`: Client-side logic for form submission and token handling
- `frontend/static/css/style.css`: Styling for the application
- `frontend/requirements.txt`: Dependencies (Flask 2.0.1 and Werkzeug 2.0.1)
- `frontend/Dockerfile`: Container configuration

**Dependencies:**
```
flask==2.0.1
werkzeug==2.0.1
```

### Backend

The backend is a Flask API that handles user registration, authentication, and provides protected routes. It uses MongoDB for data storage and JWT for token-based authentication.

**Key Files:**
- `backend/app.py`: Flask API with routes for register, login, and protected resources
- `backend/requirements.txt`: Dependencies
- `backend/Dockerfile`: Container configuration

**Dependencies:**
```
flask==2.0.1
flask-cors==3.0.10
flask-pymongo==2.3.0
pymongo==3.12.0
pyjwt==2.1.0
werkzeug==2.0.1
```

**API Endpoints:**
- `POST /api/register`: Create a new user account
- `POST /api/login`: Authenticate a user and receive a JWT token
- `GET /api/protected`: Access protected resources (requires authentication)

### Database

MongoDB is used as the database to store user information. It runs in its own container and is configured with a username and password for security.

**Configuration:**
- Username: root
- Password: example
- Database: login_app
- Collection: users

## Docker Configuration

### Docker Compose File

```yaml
version: "3"

services:
  frontend:
    build: ./frontend
    ports:
      - "8080:8080"
    depends_on:
      - backend
    networks:
      - app-network

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGO_USERNAME=root
      - MONGO_PASSWORD=example
      - SECRET_KEY=your-secret-key-change-this-in-production
    depends_on:
      - mongodb
    networks:
      - app-network

  mongodb:
    image: mongo:latest
    environment:
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD=example
    volumes:
      - mongodb-data:/data/db
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  mongodb-data:
```

### Container Details

1. **Frontend Container**:
   - Exposes port 8080
   - Accessible at http://localhost:8080
   - Depends on the backend service

2. **Backend Container**:
   - Exposes port 5000
   - Accessible at http://localhost:5000
   - Connects to MongoDB
   - Depends on the MongoDB service

3. **MongoDB Container**:
   - Uses the official MongoDB image
   - Stores data in a persistent volume (mongodb-data)
   - Not directly exposed to the host

4. **Private Network**:
   - All containers communicate through a private bridge network
   - Only necessary ports are exposed to the host

## Setup Process

The project was set up using the following steps:

1. Created the project directory structure:
   ```
   mkdir frontend
   mkdir frontend\static
   mkdir frontend\static\css
   mkdir frontend\static\js
   mkdir frontend\templates
   mkdir backend
   mkdir scripts
   ```

2. Created empty files for all components:
   ```
   type nul > docker-compose.yml
   type nul > backend\app.py
   type nul > backend\requirements.txt
   type nul > backend\Dockerfile
   type nul > frontend\app.py
   type nul > frontend\requirements.txt
   type nul > frontend\Dockerfile
   type nul > frontend\templates\index.html
   type nul > frontend\static\css\style.css
   type nul > frontend\static\js\script.js
   type nul > scripts\setup.groovy
   type nul > scripts\run.groovy
   ```

3. Added content to each file using a text editor (Notepad)

## Build and Run Process

The application was built and run using Docker Compose with the following steps:

1. Initial build:
   ```
   docker-compose build --no-cache
   ```

2. Starting the containers:
   ```
   docker-compose up -d
   ```

3. Verifying the containers:
   ```
   docker ps
   ```

## Troubleshooting

During the setup process, two main issues were encountered and resolved:

### Issue 1: Frontend Container Failing

**Problem**: The frontend container was failing to start due to a dependency compatibility issue between Flask and Werkzeug.

**Error Message**:
```
ImportError: cannot import name 'url_quote' from 'werkzeug.urls'
```

**Solution**: Updated the frontend/requirements.txt file to pin the Werkzeug version to 2.0.1, which is compatible with Flask 2.0.1:
```
flask==2.0.1
werkzeug==2.0.1
```

### Issue 2: Docker Compose Configuration Error

**Problem**: There was an incorrect path in the docker-compose.yml file, causing the build to fail.

**Error Message**:
```
unable to prepare context: path "C:\\Users\\Admin\\Documents\\GitHub\\login-signup-app\\frontend\\frontend-app" not found
```

**Solution**: Fixed the docker-compose.yml file to use the correct path for the frontend build context:
```yaml
frontend:
  build: ./frontend  # Changed from ./frontend/frontend-app
```

## Testing and Verification

The application was tested using the following methods:

1. **Backend API Testing**:
   - Accessed http://localhost:5000/api/protected 
   - Received expected 401 Unauthorized response with message: `{"error": "Token is missing"}`
   - This confirmed the API's authentication mechanism was working properly

2. **Frontend Testing**:
   - Accessed http://localhost:8080
   - Successfully created a new user account with:
     - Name: Muhammad Younas Sohail
     - Email: ysohail357@gmail.com
     - Password: (securely hashed)

3. **MongoDB Inspection**:
   - Connected to the MongoDB container:
     ```
     docker exec -it login-signup-app-mongodb-1 mongosh -u root -p example
     ```
   - Switched to the application database:
     ```
     use login_app
     ```
   - Verified the user was successfully created:
     ```
     db.users.find()
     ```
   - Result showed the user record with a properly hashed password

## Database Inspection

The MongoDB database was inspected to verify data storage and security:

```
login_app> db.users.find()
[
  {
    _id: ObjectId('67d322aeb0af8472ebab95cf'),
    name: 'Muhammad Younas Sohail',
    email: 'ysohail357@gmail.com',
    password: 'pbkdf2:sha256:260000$YWLJmrYfjJB0UsH4$dff50230f05c621f2710057b7e57370482dd0b273823d2837ef6a51455e657a6',
    created_at: ISODate('2025-03-13T18:23:42.800Z')
  }
]
```

This confirmed that:
1. User data was properly stored in MongoDB
2. Passwords were securely hashed using pbkdf2
3. Timestamps were properly recorded

## Shutdown Process

The application was properly shut down using:

```
docker-compose down
```

This command:
1. Stopped all running containers
2. Removed the containers
3. Removed the network

The database volume remains intact, ensuring data persistence between runs.
