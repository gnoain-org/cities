node {
    stage 'Starting'
        sh 'echo STARTIIIIIIIIIIIIIIIIIIIIIIIIIIIIING'
    try {
        def nodeHome = tool name: 'node-5.10.1', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
        env.PATH = "${nodeHome}/bin:${env.PATH}"

        stage 'Check Environment'
            sh "docker ps"
            sh "node -v"
            sh "npm -v"
            sh "karma --version"
            sh "bower -v"
            sh "grunt --version"

        stage 'Checkout'
            checkout scm

        stage 'Install Dependencies'
            sh 'npm install'
            sh 'bower install'

        stage 'Backend Tests'
            sh 'npm test'
            def exists = fileExists( 'coverage/back/lcov.info' );
            if ( exists ) {
                sh "sed -i 's/.*\\/server/SF:server/' coverage/back/lcov.info"
            }

        stage 'Frontend Tests'
            sh 'karma start'

        stage('Results') {
            sh 'echo WEEE'
        }
    } catch( error ) {
        stage('Results') {
            sh 'echo OH NOOOOOO'
        }
    }
}
