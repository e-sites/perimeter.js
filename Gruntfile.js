/* global module:false */
module.exports = function (grunt) {

	'use strict';

	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner:
				'/*!\n' +
				' * Perimeter.js <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
				' * https://github.com/e-sites/perimeter.js\n' +
				' * MIT licensed\n' +
				' *\n' +
				' * Copyright (C) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>, <%= pkg.author.web %>\n' +
				' */'
		},

		concat: {
			options: {
				separator: "\n\n"
			},
			// used to copy to dist folder
			dist: {
				files: {
					'dist/perimeter.debug.js': ['src/perimeter.js', 'src/monitor.js', 'src/boundary.js'],
					'dist/perimeter.js': ['src/perimeter.js', 'src/monitor.js']
				}
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc',
				force: true
			},
			files: ['dist/perimeter.debug.js', 'dist/perimeter.js']
		},

		uglify: {
			options: {
				banner: '<%= meta.banner %>\n'
			},
			build: {
				files: {
					'dist/perimeter.debug.min.js': ['dist/perimeter.debug.js'],
					'dist/perimeter.min.js': ['dist/perimeter.js']
				}
			}
		},

		qunit: {
			all: {
				options: {
					timeout: 7000,
					urls: [
						'tests/index.html'
					]
				}
			}
		}

	});

	// Dependencies
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-qunit');

	// Default task
	grunt.registerTask( 'default', [ 'concat', 'jshint', 'uglify', 'qunit'] );

};