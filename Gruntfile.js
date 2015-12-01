module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('test', [
    'coffee',
    'browserify',
    'shell'
  ]);

  grunt.initConfig({
    coffee: {
      compile: {
        options: {
          bare: true
        },
        files: {
          'lib/index.js':  'src/index.coffee',
          'lib/bundle.js': 'src/bundle.coffee',
        }
      }
    },

    browserify: {
      test: {
        src: [],
        dest: './test/bundle.js',
        options: {
          alias: [
            './lib/bundle.js:xhr-promise'
          ],
          transform: [
            'coffeeify'
          ]
        }
      }
    },

    shell: {
      test: {
        command: 'test/run.sh'
      }
    }
  });
};
