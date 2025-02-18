pipeline {
    agent any
    
    environment {
        // Store Docker Hub credentials
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        // Define application name
        APP_NAME = "sample-web-app"
        // Define Docker image name
        DOCKER_IMAGE_NAME = "akc27/${APP_NAME}"
        // Define image tag
        IMAGE_TAG = "${BUILD_NUMBER}-${new Date().format('yyyyMMdd_HHmmss')}"
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
                    // Build with both specific tag and latest
                    sh """
                        docker build -t ${DOCKER_IMAGE_NAME}:${IMAGE_TAG} .
                        docker tag ${DOCKER_IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_IMAGE_NAME}:latest
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
                sh """
                    docker push ${DOCKER_IMAGE_NAME}:${IMAGE_TAG}
                    docker push ${DOCKER_IMAGE_NAME}:latest
                """
            }
        }
        
        stage('Deploy Container') {
            steps {
                script {
                    // Stop and remove existing container if it exists
                    sh """
                        if docker ps -a | grep -q ${APP_NAME}; then
                            docker stop ${APP_NAME} || true
                            docker rm ${APP_NAME} || true
                        fi
                    """
                    
                    // Run new container
                    sh """
                        docker run -d \
                            --name ${APP_NAME} \
                            -p 3000:3000 \
                            ${DOCKER_IMAGE_NAME}:${IMAGE_TAG}
                    """
                }
            }
        }
    }
    
    post {
        always {
            script {
                // Cleanup
                sh """
                    docker logout || true
                    docker rmi ${DOCKER_IMAGE_NAME}:${IMAGE_TAG} || true
                    docker rmi ${DOCKER_IMAGE_NAME}:latest || true
                """
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
