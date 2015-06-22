module.exports = function(grunt) {

  grunt.initConfig({

  	config: {
  		src:'src',
		  dist: 'dist'
        },

  	flats: {
	    build: {
  			options: {
  		        basePath: '<%= config.src %>/templates',
  		        layoutPath: 'layouts',
  		        partialPath: 'views',
  		        masterSrc: 'index.html',
  		        destPath: '<%= config.dist %>'
  			}
	    }
  	},
  	
    sass: {
		dist:{
                options:{
                    sourcemap:'none',
                    //includePaths: require('node-bourbon').with('node_modules/node-bourbon/node-modules/bourbon/app/assets/stylesheets')
                    //includePaths: require('node-bourbon').includePaths
                },
                files:{'<%= config.dist %>/core.css':'<%= config.src %>/scss/core.scss'
                }
		}
		
    },
	
	//grunt-contrib-connect
    connect: {
            options: {
                spawn: false,
                livereload: true,
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: {
                        target: 'http://localhost:8000/app.html'
                    },
                    base: [
                        '<%= config.dist %>'
                    ]
                }
            }
        },

    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },

    copy:{
        fonts:{
            files:[
                {
                    expand: true,
                    cwd: 'assets/font-awesome',
                    src: ['**'],
                    dest: '<%= config.dist %>/fonts/fa'
                },
                {
                    src: 'assets/logox32.png',
                    dest:'<%= config.dist %>/images/logox32.png'
                },
            ]
      },
      
      html:{
                files:[{
                    expand: true,
                    cwd: 'src/templates/views',
                    src: ['**'],
                    dest: 'dist/views'
                }]
      },

      js:{
        files:[
                {
                    expand: true,
                    cwd: 'src/scripts/',
                    src: ['**'],
                    dest: 'dist/js/'
                },
                {
                    expand: true,
                    cwd: 'src/templates/data',
                    src: ['**'],
                    dest: 'dist/data/'
                },
                {
                    src: 'bower_components/angular-full/angular.js',
                    dest:'dist/js/angular.min.js'
                },
                {
                    src: 'bower_components/angular-full/angular-resource.min.js',
                    dest:'dist/js/angular-resource.min.js'
                },
                {
                    src: 'bower_components/angular-full/angular-sanitize.min.js',
                    dest:'dist/js/angular-sanitize.min.js'
                },
                {
                    src: 'bower_components/angular-full/angular-animate.min.js',
                    dest:'dist/js/angular-animate.min.js'
                },
                {
                    src: 'bower_components/angular-full/angular-route.min.js',
                    dest:'dist/js/angular-route.min.js'
                },
                {
                    src: 'bower_components/angular-full/angular-touch.min.js',
                    dest:'dist/js/angular-touch.min.js'
                },
                {
                    src: 'bower_components/angular-local-storage/dist/angular-local-storage.js',
                    dest:'dist/js/angular-local-storage.min.js'
                }
              ]
      },


    },

    watch: {

      options: {livereload: true},

      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['flats'],
      },

    	htmlRebuild: {
        files: ['<%= config.src %>/**/*.html'],
        tasks: ['flats','copy'],
      },

      jsRebuild: {
        files: ['<%= config.src %>/**/*.js','<%= config.src %>/**/*.json'],
        tasks: ['copy:js'],
		  },

      cssRebuild:{
        files: ['<%= config.src %>/**/*.scss'],
        tasks: ['sass','copy']
      },

  		livereload: {
                  options: {
                      livereload: '<%= connect.livereload.options %>'
                  },
                  files: [
                      '<%= config.src %>/_templates/**/*.html',
                  ]
  		},

    }


  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-flats');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
 

  grunt.registerTask('default', [
								'flats' ,
								'sass' ,
								'connect',
								'copy',
								'watch']);

};