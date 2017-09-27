node {
    stage 'Starting'
        sh 'echo STARTiiiiiiiiiING'
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
        
        stage 'SonarQube analysis'
            def scannerHome = tool 'Sonar Scanner'; 
            //def token = 'b1946567ca51f530d76edf0cacef391634287b2e'; 
            withCredentials( [ [ $class: 'UsernamePasswordMultiBinding', credentialsId: 'sonar-token', 
                usernameVariable: 'SONAR_USERNAME', passwordVariable: 'SONAR_TOKEN' ] ] ) { 
                withSonarQubeEnv('Sonar Server') { 
                    sh "echo ${env.SONAR_USERNAME}"
                    sh "echo ${env.SONAR_TOKEN}"
                    sh "echo ${env.CHANGE_ID}"
                    sh "${scannerHome}/bin/sonar-scanner -X -Dsonar.login=admin -Dsonar.password=admin -Dsonar.projectKey=cities -Dsonar.sources=. -Dsonar.tests=. -Dsonar.exclusions=node_modules/**/*,bower_components/**/*,server/**/*.spec.js -Dsonar.test.inclusions=server/**/*.spec.js -Dsonar.analysis.mode=preview -Dsonar.github.oauth=907d72fb8d7ef6473532f60343e064e7ab0b6e92 -Dsonar.github.repository=gnoain-org/cities -Dsonar.github.pullRequest=${env.CHANGE_ID} -Dsonar.javascript.lcov.reportPaths=coverage/back/lcov.info" 
                } 
            }
        
        stage 'Results'
            sh 'echo WEEE'
        
    } catch( error ) {
        stage('Results') {
            sh 'echo OH NOOOOOO'
        }
    }
}
