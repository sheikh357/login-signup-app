#!/usr/bin/env groovy

println "Starting Login/Signup Application..."

// Check if Docker is running
def dockerProcess = "docker info".execute()
dockerProcess.waitFor()
if (dockerProcess.exitValue() != 0) {
    println "Error: Docker is not running. Please start Docker Desktop first."
    System.exit(1)
}

// Build and run with Docker Compose
def dockerComposeProcess = "docker-compose up --build -d".execute()
dockerComposeProcess.waitFor()

if (dockerComposeProcess.exitValue() == 0) {
    println "\nApplication is now running!"
    println "Frontend: http://localhost:8080"
    println "Backend API: http://localhost:5000"
    println "\nTo stop the application, run: docker-compose down"
} else {
    println "Error starting the application:"
    println dockerComposeProcess.err.text
}