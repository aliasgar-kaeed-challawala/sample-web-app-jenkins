pipeline {
    agent any
    
    environment {
        // Docker Hub credentials
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        // App name
        APP_NAME = 'sample-web-app'
        // Build tag with timestamp
        BUILD_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                cleanWs()
                git branch: 'main',
                    url: 'https://github.com/aliasgar-kaeed-challawala/sample-web-app-jenkins.git'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t ${DOCKERHUB_CREDENTIALS_USR}/${APP_NAME}:${BUILD_TAG} .
                    docker tag ${DOCKERHUB_CREDENTIALS_USR}/${APP_NAME}:${BUILD_TAG} ${DOCKERHUB_CREDENTIALS_USR}/${APP_NAME}:latest
                """
            }
        }
        
        stage('Login to DockerHub') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
            }
        }
        
        stage('Push to DockerHub') {
            steps {
                sh """
                    docker push ${DOCKERHUB_CREDENTIALS_USR}/${APP_NAME}:${BUILD_TAG}
                    docker push ${DOCKERHUB_CREDENTIALS_USR}/${APP_NAME}:latest
                """
            }
        }
        
        stage('Deploy Container') {
            steps {
                sh """
                    if docker ps -a | grep -q ${APP_NAME}; then
                        docker stop ${APP_NAME} || true
                        docker rm ${APP_NAME} || true
                    fi
                    
                    docker run -d \
                        --name ${APP_NAME} \
                        -p 3000:3000 \
                        ${DOCKERHUB_CREDENTIALS_USR}/${APP_NAME}:${BUILD_TAG}
                """
            }
        }
    }
    
    post {
        always {
            sh """
                docker logout || true
                docker rmi ${DOCKERHUB_CREDENTIALS_USR}/${APP_NAME}:${BUILD_TAG} || true
                docker rmi ${DOCKERHUB_CREDENTIALS_USR}/${APP_NAME}:latest || true
            """
            cleanWs()
        }
        success {
            echo "Success: Application deployed at http://localhost:3000"
        }
        failure {
            echo "Failed: Check the logs for details"
        }
    }
}
