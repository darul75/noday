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
      },
      production: {
        options: {
          paths: ['public/javascripts/bootstrap/less/', 'public/stylesheets/less/'],
          yuicompress: true
        },
        files: {
          'public/javascripts/bootstrap/css/bootstrap.css': 'public/javascripts/bootstrap/less/bootstrap.less',
          'public/stylesheets/css/style.css': 'public/stylesheets/less/style.less'
        }
      }
    }
  });

  // Module checker
  

  // Load the plugin that provides the "less" task.
  grunt.loadNpmTasks('grunt-contrib-less');

  // TASKS

  // DEFAULT TEST ENVIRONMENT
  grunt.registerTask('default', ['less:development']);

};