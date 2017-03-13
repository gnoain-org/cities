module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.initConfig( {
    mocha_istanbul: {
      coverage: {
        src:     [ 'server/**/*.spec.js' ],
        options: {
          coverageFolder: 'coverage/back',
          excludes:       [ 'server/**/*.spec.js' ],
        }
      }
    }
  } );
};
