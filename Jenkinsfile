pipeline {
    agent any

    environment {
        FRONT_DIR = 'frontend'
        BACK_DIR = 'back'
        COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('📥 Checkout Code') {
            steps {
                echo 'Checking out the project...'
                checkout scm
            }
        }

        stage('📦 Build Angular Frontend') {
            steps {
                dir("${FRONT_DIR}") {
                    echo 'Installing dependencies...'
                    sh 'npm install --legacy-peer-deps'

                    echo 'Building Angular app in production mode...'
                    sh 'sh 'npm run build -- frontend --configuration=production'
                }
            }
        }

        stage('🐳 Docker Compose Up') {
            steps {
                echo 'Stopping existing containers (if any)...'
                sh "docker-compose -f ${COMPOSE_FILE} down || true"

                echo 'Building Docker images...'
                sh "docker-compose -f ${COMPOSE_FILE} build"

                echo 'Starting containers...'
                sh "docker-compose -f ${COMPOSE_FILE} up -d"
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed.'
        }
    }
}
