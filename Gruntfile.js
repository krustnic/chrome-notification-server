module.exports = function(grunt) {

  grunt.initConfig({
    
    browserify : {
      background : {
        src  : "js/src/background.js",
        dest : "js/dist/background.js"
      },
      settings : {
        src  : "js/src/settings-page.js",
        dest : "js/dist/settings-page.js"
      },
      error : {
        src  : "js/src/error-page.js",
        dest : "js/dist/error-page.js"
      }
    },
 
    watch: {
      scripts: {
        files: ['js/src/**/*.js'],
        tasks: ['build', 'notify:watch'],
        options: {          
          spawn: false
        },
      },
    },

    jasmine_node: {
      options: {        
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'spec'
      },
      all: ["."]
    },

    notify: {  
      watch: {
        options : {
          title: "chrome-notification-server",
          message: "Browserify complite!"
        }
      },  
      production: {
        options: {
          message: 'Production ZIP complite!'
        }
      }
    },

    clean: [ "production" ],

    copy: {
      main: {
        files: [          
          { expand: true, src: ['css/*']          , dest: 'production' },
          { expand: true, src: ['html/*']         , dest: 'production' },
          { expand: true, src: ['images/*']       , dest: 'production' },
          { expand: true, src: ['js/dist/*']      , dest: 'production' },          
          { expand: true, src: ['./manifest.json'], dest: 'production' }          
        ],
      },
    },

    compress: {
      main: {
        options: {
          archive: 'chrome-notification-server.zip'
        },
        files: [          
          { expand: true, cwd: 'production/', src: ['**'], dest: '' } 
        ]
      }
    }

  });
  
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.loadNpmTasks('grunt-notify');
  
  grunt.registerTask( 'build', [ 'browserify' ] );  
  grunt.registerTask( 'test' , [ 'jasmine_node' ] );
  grunt.registerTask( 'production' , [ 'build', 'clean', 'copy', 'compress', 'notify:production' ] );   
};