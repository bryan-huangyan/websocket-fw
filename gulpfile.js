/* global templatizer */
/*******************************************************************************
 * Copyright (c) 2016 esse.io.
 *
 * All rights reserved.
 *
 * Contributors:
 *   Bryan HUANG - Initial implementation
 *
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  		 http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *******************************************************************************/
 
///// Gulp Dependencies /////
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	minifyCss = require('gulp-minify-css'),
	rename = require("gulp-rename"),
	watch = require('gulp-watch'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	spawn = require('child_process').spawn,
	node;

////// Run Server Task ///////
gulp.task('server', function() {
	if (node) node.kill();
	node = spawn('node', ['app.js'], {stdio: 'inherit'});		//command, file, options
});

gulp.task('watch-server', ['server'], function () {
	gulp.watch('./routes/**/*.js', ['server']);
	gulp.watch(['./ws/**/*.js', '!./temp/**'], ['server']);
	gulp.watch('./setup.js', ['server']);
	gulp.watch('./app.js', ['server']);
});


////// Default //////
gulp.task('default', ['watch-server'], function(){});
