module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-coffee');

  grunt.initConfig({
    coffee: {
      compile: {
        options: {
          bare: true
        },
        files: {
          'lib/xhr-promise.js': 'src/xhr-promise.coffee'
        }
      }
    }
  });
};