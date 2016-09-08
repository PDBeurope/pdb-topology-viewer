/*global require*/
'use strict';

var gulp = require("gulp");

var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var prefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var del = require("del");
var bump = require("gulp-bump");
var git = require("gulp-git");
var rename = require("gulp-rename");
var header = require('gulp-header');

var srcBundle = [
	"bower_components/d3/d3.js",
    "bower_components/angular/angular.js",
	"lib/js/es6-promise.min.js",
	"lib/js/pdbRGBColorCodes.js",
	"lib/js/services.js",
	"lib/js/d3.core.service.js",
	"lib/js/directives.js",
	"lib/js/templates.js",
	"lib/js/init.js"
];

var srcCore = [
   "lib/js/es6-promise.min.js",
   "lib/js/pdbRGBColorCodes.js",
   "lib/js/d3.core.service.js",
   "lib/js/services.js",
   "lib/js/templates.js",
   "lib/js/directives.js"
];

var srcCss = 'lib/css';

var banner = ['/**',
  ' * PDB Topology Viewer',
  ' * @version v1.0.0',
  ' * @link https://github.com/mandarsd/pdb-topology-viewer',
  ' * @license Apache 2.0',
  ' */',
  ''].join('\n');

var license = ['/**',
  ' * Copyright 2015-2016 Mandar Deshpande <mandar@ebi.ac.uk>',
  ' * European Bioinformatics Institute (EBI, http://www.ebi.ac.uk/)',
  ' * European Molecular Biology Laboratory (EMBL, http://www.embl.de/)',
  ' * Licensed under the Apache License, Version 2.0 (the "License");',
  ' * you may not use this file except in compliance with the License.',
  ' * You may obtain a copy of the License at ',
  ' * http://www.apache.org/licenses/LICENSE-2.0',
  ' * ',
  ' * Unless required by applicable law or agreed to in writing, software',
  ' * distributed under the License is distributed on an "AS IS" BASIS, ',
  ' * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.',
  ' * See the License for the specific language governing permissions and ',
  ' * limitations under the License.',
  ' */',
  ''].join('\n');


gulp.task("clean", function (cb) {
    del('[build]', cb);
});

gulp.task("scriptsComplete", function () {
    return gulp.src(srcBundle)
        .pipe(concat("pdb.topology.viewer.bundle.min.js"))
        .pipe(uglify())
		.pipe(header(license, {} ))
		.pipe(header(banner, {} ))
        .pipe(gulp.dest("./build"));
});

gulp.task("scriptsCore", function () {
    return gulp.src(srcCore)
        .pipe(concat("pdb.topology.viewer.min.js"))
        .pipe(uglify())
		.pipe(header(license, {} ))
		.pipe(header(banner, {} ))
        .pipe(gulp.dest("./build"));
});

gulp.task('stylesComplete', function () {
    gulp.src(srcCss + '/*.css')
        .pipe(prefixer('last 5 versions'))
        .pipe(concat('pdb.topology.viewer.min.css'))
        .pipe(cleanCSS())
		.pipe(header(license, {} ))
		.pipe(header(banner, {} ))
        .pipe(gulp.dest("./build"));
});

gulp.task("bump", function(){
   return gulp.src(['./package.json', './bower.json'])
    .pipe(bump())
    .pipe(gulp.dest('./')); 
});

gulp.task("tag", function(){
    var pkg = require('./package.json');
    var v = pkg.version;
    var message = 'Release ' + v;
    
    return gulp.src('./')
        .pipe(git.commit(message))
        .pipe(git.tag(v, message))
        .pipe(git.push('origin', 'master', '--tags'))
        .pipe(gulp.dest('./'));
})

gulp.task('npm', ['bump','tag'], function (done) {
  require('child_process').spawn('npm', ['publish'], { stdio: 'inherit' })
    .on('close', done);
});

gulp.task("default", ["clean", "scriptsCore", "scriptsComplete", "stylesComplete"]);
//gulp.task("release",['default','npm']);