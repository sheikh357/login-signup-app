#!/usr/bin/env groovy

println "Setting up Login/Signup Application..."

// Create directories if they don't exist
def dirs = [
    "frontend", 
    "frontend/static", 
    "frontend/static/css", 
    "frontend/static/js", 
    "frontend/templates", 
    "backend", 
    "scripts"
]

dirs.each { dir ->
    new File(dir).mkdirs()
    println "Created directory: ${dir}"
}

// Create all necessary files from the GitHub repository
println "\nProject setup complete!"
println "Run 'groovy scripts/run.groovy' to start the application"