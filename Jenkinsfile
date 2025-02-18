pipeline {
    agent any
    
    environment {
        // Replace 'your-dockerhub-username' with your actual Docker Hub username
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        APP_NAME = "sample-web-app"
        DOCKER_IMAGE = "akc27/${APP_NAME}"
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
                        docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} .
                        docker tag ${DOCKER_IMAGE}:${IMAGE_TAG} ${DOCKER_IMAGE}:latest
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
                    docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                    docker push ${DOCKER_IMAGE}:latest
                """
            }
        }
        
        stage('Deploy Container') {
            steps {
                script {
                    // Stop and remove existing container if it exists
                    sh '''
                        if docker ps -a | grep -q ${APP_NAME}; then
                            docker stop ${APP_NAME}
                            docker rm ${APP_NAME}
                        fi
                    '''
                    
                    // Run new container
                    sh """
                        docker run -d \
                            --name ${APP_NAME} \
                            -p 3000:3000 \
                            ${DOCKER_IMAGE}:${IMAGE_TAG}
                    """
                }
            }
        }
    }
    
    post {
        always {
            // Cleanup
            sh """
                docker logout
                docker rmi ${DOCKER_IMAGE}:${IMAGE_TAG} ${DOCKER_IMAGE}:latest || true
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
