pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'your-dockerhub-username/docker-jenkins-app:latest'
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/aliasgar-kaeed-challawala/sample-web-app-jenkins.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t $DOCKER_IMAGE .'
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    withCredentials([string(credentialsId: DOCKER_CREDENTIALS_ID, variable: 'DOCKER_PASSWORD')]) {
                        sh "echo $DOCKER_PASSWORD | docker login -u your-dockerhub-username --password-stdin"
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    sh 'docker push $DOCKER_IMAGE'
                }
            }
        }

        stage('Deploy and Run Container') {
            steps {
                script {
                    sh 'docker run -d -p 3000:3000 $DOCKER_IMAGE'
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }
    }
}
