pipeline {
    agent any

    environment {
        FRONT_DIR = 'frontend'   // Adjust if your frontend folder is different
        BACK_DIR = 'back'        // Adjust if your backend folder is different
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Install Angular Dependencies') {
            steps {
                dir(FRONT_DIR) {
                    sh 'npm install --legacy-peer-deps'
                }
            }
        }

        stage('Run Angular Frontend') {
            steps {
                dir(FRONT_DIR) {
                    sh 'nohup npx ng serve --host 0.0.0.0 --port 4200 &'
                }
            }
        }

        stage('Run Spring Boot Backend') {
            steps {
                dir(BACK_DIR) {
                    sh 'nohup mvn spring-boot:run &'
                }
            }
        }
    }

    post {
        success {
            echo 'Frontend and Backend are running in development mode.'
        }
        failure {
            echo 'Something went wrong.'
        }
    }
}
