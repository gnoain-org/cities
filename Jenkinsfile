node {
    def nodeHome = tool name: 'node-5.10.1', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
    env.PATH = "${nodeHome}/bin:${env.PATH}"

    stage 'Check Environment'
        sh "docker ps"
        sh "node -v"
        sh "npm -v"
        sh "karma --version"
        sh "bower -v"
        echo sh(returnStdout: true, script: 'env')

    stage 'Checkout'
      checkout scm

    stage 'Install Dependencies'
        sh 'npm install'
        sh 'bower install'

    stage 'Backend Tests'
        sh 'npm test'

    stage 'Frontend Tests'
        sh 'karma start'
    
    stage('SonarQube analysis') {
        // requires SonarQube Scanner 2.8+
        def scannerHome = tool 'Sonar Scanner';
        withSonarQubeEnv('Sonar Server') {
            //   sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=moonshine -Dsonar.sources=. -Dsonar.inclusions=app/**/manager/**/* -Dsonar.analysis.mode=preview -Dsonar.github.pullRequest=7 -Dsonar.github.repository=gnoain-org/cities -Dsonar.github.oauth=6157182195c11ea969bdc556a13752163eec9c16 "
        sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=cities -Dsonar.sources=. -Dsonar.inclusions=server/**/*,public/**/*"
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
