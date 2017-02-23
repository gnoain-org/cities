node {
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
            sh "sed -i 's/.*\/server/SF:server/' coverage/back/lcov.info"
            def f = readFile('coverage/back/lcov.info');
             echo "${f}"
        } else {
            echo "POLLACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        }

    stage 'Frontend Tests'
        sh 'karma start'
    
    stage('SonarQube analysis') {
        def scannerHome = tool 'Sonar Scanner';
        def token = '4faf69e71bbd8ce12ecb997138e224fdd429431f';
        withCredentials( [ [ $class: 'UsernamePasswordMultiBinding', credentialsId: 'sonar-token',
            usernameVariable: 'SONAR_USERNAME', passwordVariable: 'SONAR_TOKEN' ] ] ) {
            withSonarQubeEnv('Sonar Server') {
                //   sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=moonshine -Dsonar.sources=. -Dsonar.inclusions=app/**/manager/**/* -Dsonar.analysis.mode=preview -Dsonar.github.pullRequest=7 -Dsonar.github.repository=gnoain-org/cities -Dsonar.github.oauth=6157182195c11ea969bdc556a13752163eec9c16 "
                sh "${scannerHome}/bin/sonar-scanner -X -Dsonar.projectKey=cities -Dsonar.sources=. -Dsonar.exclusions=node_modules/**/*,bower_components/**/*,server/**/*.spec.js -Dsonar.tests=. -Dsonar.test.inclusions=server/**/*.spec.js -Dsonar.analysis.mode=preview -Dsonar.github.pullRequest=${env.CHANGE_ID} -Dsonar.github.oauth=${env.SONAR_TOKEN} -Dsonar.github.repository=gnoain-org/cities -Dsonar.javascript.lcov.reportPaths=coverage/back/lcov.info"
            }
        }
    }

    // stage 'Build'
    //     sh 'NODE_ENV=uat webpack --config ./app/angular/manager/config/webpack.config.js'
    //     sh 'grunt less'
    //
    // stage 'Start App'
    //     sh 'NODE_ENV=uat npm start --site=manager'

    // docker.withRegistry('https://registry.quantion.com') {
    //     stage 'Build Docker Image'
    //         def cities = docker.build "gnoain/cities:${env.BUILD_TAG}"

    //     cities.inside {
    //         stage 'Run Back End Test In Container'
    //             sh 'npm test'
    //         stage 'Run Front End Test In Container'
    //             sh 'karma start'
    //     }

    //     stage 'Push to registry.quantion.com'
    //         cities.push()
    // }
}
