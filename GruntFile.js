/*global module*/
module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    // LESS CSS TASKS
    less: {
      development: {
        options: {
          paths: ['public/stylesheets/']
        },
        files: {
          'public/stylesheets/main.css': 'public/stylesheets/main.less'
        }
      }
    },
    // MINIFY CSS
    cssmin: {
      options: {
        keepSpecialComments: false
      },
      compress: {
        files: {
          // core
          'public/stylesheets/main.min.css': ['public/stylesheets/main.css','public/stylesheets/modal.css']
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %>  */\n',
        // mangle: false,
        // banner: '/*! <%= pkg.name %> BUILD <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        comments: false,
        // beautify: true
      },
      app: {
         files: {
          'public/javascripts/app.min.js': ['public/javascripts/app.js'],
        }
      }
    },
  });

  // Module checker
  

  // Load the plugin that provides the "less" task.
  grunt.loadNpmTasks('grunt-contrib-less');
  
   // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Load the plugin that provides the "cssmin" task.
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // TASKS

  // DEFAULT TEST ENVIRONMENT
  grunt.registerTask('default', ['less:development', 'cssmin', 'uglify:app']);

};