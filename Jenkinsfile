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
                echo '📥 Checking out code...'
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                dir("${FRONT_DIR}") {
                    echo '📦 Installing dependencies & building Angular...'
                    sh 'npm ci'
                    sh 'npm run build -- frontend --configuration production'
                }
            }
        }

        stage('Build & Run with Docker Compose') {
            steps {
                echo '🐳 Building and running containers...'
                sh 'docker-compose -f $COMPOSE_FILE down || true'  // Stop old containers if any
                sh 'docker-compose -f $COMPOSE_FILE build'
                sh 'docker-compose -f $COMPOSE_FILE up -d'
            }
        }
    }

    post {
        success {
            echo ' Application built and running via Docker Compose.'
        }
        failure {
            echo ' Build or deployment failed.'
        }
    }
}
