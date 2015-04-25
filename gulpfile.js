var gulp = require("gulp");
var jsonminify = require("gulp-jsonminify");
var less = require("gulp-less");
var minifyCSS = require("gulp-minify-css");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var watch = require("gulp-watch");
var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var rimraf = require("rimraf");
var runSequence = require("run-sequence");
var sourceDir = "src";
var buildDir = "dist";

gulp.task("clean", function(done) {
  rimraf(buildDir, done);
});

gulp.task("build-content-script-js", function() {
  return browserify("./" + sourceDir + "/content-script/index.js")
    .transform(babelify)
    .bundle()
    .pipe(source("content-script.js")) // Convert from Browserify stream to vinyl stream.
    .pipe(buffer()) // Convert from streaming mode to buffered mode.
    .pipe(uglify({ mangle: false }))
    .pipe(gulp.dest(buildDir));
});

gulp.task("build-content-script-css", function() {
  return gulp
    .src(sourceDir + "/content-script/index.less")
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(rename("content-script.css"))
    .pipe(gulp.dest(buildDir));
});

gulp.task("build-manifest", function() {
  return gulp
    .src(sourceDir + "/manifest.json")
    .pipe(jsonminify())
    .pipe(gulp.dest(buildDir));
});

gulp.task("build", ["clean"], function(done) {
  runSequence(["build-content-script-js", "build-content-script-css", "build-manifest"], done);
});

gulp.task("watch", ["build"], function() {
  return watch(sourceDir, function() { gulp.start("build") });
});

gulp.task("default", ["build"]);
