pipeline {
    agent any
    
    environment {
        // Store Docker Hub credentials
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        // Define application name
        APP_NAME = "sample-web-app"
        // Define Docker image details
        DOCKER_REGISTRY = "akc27"
        IMAGE_NAME = "${APP_NAME}"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Clean workspace
                cleanWs()
                // Replace with your actual GitHub repository URL
                git branch: 'main',
                    url: 'https://github.com/aliasgar-kaeed-challawala/sample-web-app-jenkins.git'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    def fullImageName = "${DOCKER_REGISTRY}/${IMAGE_NAME}"
                    // Build with both specific tag and latest
                    sh """
                        docker build -t ${fullImageName}:${IMAGE_TAG} .
                        docker tag ${fullImageName}:${IMAGE_TAG} ${fullImageName}:latest
                    """
                }
            }
        }
        
        stage('Login to DockerHub') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
            }
        }
        
        stage('Push to DockerHub') {
            steps {
                script {
                    def fullImageName = "${DOCKER_REGISTRY}/${IMAGE_NAME}"
                    sh """
                        docker push ${fullImageName}:${IMAGE_TAG}
                        docker push ${fullImageName}:latest
                    """
                }
            }
        }
        
        stage('Deploy Container') {
            steps {
                script {
                    def fullImageName = "${DOCKER_REGISTRY}/${IMAGE_NAME}"
                    // Stop and remove existing container if it exists
                    sh """
                        if docker ps -a | grep -q ${APP_NAME}; then
                            docker stop ${APP_NAME} || true
                            docker rm ${APP_NAME} || true
                        fi
                        
                        docker run -d \
                            --name ${APP_NAME} \
                            -p 3000:3000 \
                            ${fullImageName}:${IMAGE_TAG}
                    """
                }
            }
        }
    }
    
    post {
        always {
            script {
                try {
                    def fullImageName = "${DOCKER_REGISTRY}/${IMAGE_NAME}"
                    sh """
                        docker logout || true
                        docker rmi ${fullImageName}:${IMAGE_TAG} || true
                        docker rmi ${fullImageName}:latest || true
                    """
                } catch (Exception e) {
                    echo "Error during cleanup: ${e.message}"
                }
                cleanWs()
            }
        }
        success {
            echo "Success: Application deployed at http://localhost:3000"
        }
        failure {
            echo "Failed: Check the logs for details"
        }
    }
}

