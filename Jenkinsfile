pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "akc27/docker-jenkins-app:latest"
        DOCKER_CREDENTIALS_ID = "docker-hub-credentials"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/aliasgar-kaeed-challawala/sample-web-app-jenkins.git'
            }
        }

        stage('Build & Test') {
            parallel {
                stage('Build Docker Image') {
                    steps {
                        script {
                            sh "docker build -t ${DOCKER_IMAGE} ."
                        }
                    }
                }

                stage('Run Unit Tests') {
                    steps {
                        script {
                            sh '''
                                docker run --rm -v $(pwd):/app -w /app node:18-alpine sh -c "
                                npm ci &&
                                npm test
                                "
                            '''
                        }
                    }
                }

                stage('Run Security Tests') {
                    steps {
                        script {
                            sh '''
                                docker run --rm -v $(pwd):/app -w /app node:18-alpine sh -c "
                                npm ci &&
                                npx audit-ci --high
                                "
                            '''
                        }
                    }
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'docker-hub-credentials', variable: 'DOCKER_PASSWORD')]) {
                        sh '''
                            echo "$DOCKER_PASSWORD" | docker login -u akc27 --password-stdin
                        '''
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    sh "docker push ${DOCKER_IMAGE}"
                }
            }
        }

        stage('Deploy and Run Container') {
            steps {
                script {
                    sh "docker run -d -p 3000:3000 ${DOCKER_IMAGE}"
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
