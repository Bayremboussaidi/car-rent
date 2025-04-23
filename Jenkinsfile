pipeline {
    agent any

    environment {
        FRONT_DIR = 'frontend'
        BACK_DIR = 'back'
        COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build & Run with Docker Compose') {
            steps {
                sh 'docker-compose -f $COMPOSE_FILE down' // Stop old containers if running
                sh 'docker-compose -f $COMPOSE_FILE build' // Build frontend & backend images
                sh 'docker-compose -f $COMPOSE_FILE up -d' // Run containers in detached mode
            }
        }
    }

    post {
        success {
            echo 'Application built and running via Docker Compose.'
        }
        failure {
            echo 'Build or deployment failed.'
        }
    }
}
