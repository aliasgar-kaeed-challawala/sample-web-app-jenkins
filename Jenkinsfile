pipeline {
    agent any

    environment {
        ENVIRONMENT = ''
    }

    stages {
        stage('Set Environment') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'main') {
                        ENVIRONMENT = 'production'
                    } else if (env.BRANCH_NAME == 'stage') {
                        ENVIRONMENT = 'staging'
                    } else if (env.BRANCH_NAME == 'dev') {
                        ENVIRONMENT = 'development'
                    } else {
                        error("Branch not allowed: ${env.BRANCH_NAME}")
                    }
                    echo "Deploying to ${ENVIRONMENT}"
                }
            }
        }

        stage('Build & Test') {
            steps {
                sh 'echo Building the project...'
            }
        }

        stage('Deploy') {
            steps {
                sh 'echo Deploying to ${ENVIRONMENT}...'
            }
        }
    }
}
