var gulp = require('gulp');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var merge = require('merge-stream');
var replace = require('gulp-replace');

gulp.task('clean', function() {
  return gulp.src('dist', {read: false}).pipe(clean());
});

gulp.task('copy', ['clean'], function() {
  return gulp.src('node_modules/materialize-css/fonts/*/**').pipe(gulp.dest('dist/fonts'));
});

var processors = [autoprefixer({
  browsers: ['last 2 versions', 'Chrome >= 30', 'Firefox >= 30', 'ie >= 10', 'Safari >= 8']
})];

var primaryColors = [
  'red',
  'pink',
  'purple',
  'deep-purple',
  'indigo',
  'blue',
  'light-blue',
  'cyan',
  'teal',
  'green',
  'light-green',
  'lime',
  'yellow',
  'amber',
  'orange',
  'deep-orange',
  'brown',
  'grey',
  'blue-grey'
];

var secondaryColors = primaryColors.slice(0, primaryColors.length - 3);

gulp.task('sass:expanded', ['copy'], function() {
  var themes = primaryColors.map(primaryColor => {
    return secondaryColors.map(secondaryColor => {
      return gulp.src('template.scss')
        .pipe(replace('PRIMARYCOLOR', primaryColor))
        .pipe(replace('SECONDARYCOLOR', secondaryColor))
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(rename(`materialize-${primaryColor}-${secondaryColor}.css`))
        .pipe(gulp.dest('dist/css'));
    });
  }).reduce((themes, colorThemes) => {
    return themes.concat(colorThemes);
  }, []);

  return merge(...themes);
});

gulp.task('sass:min', ['sass:expanded'], function() {
  var themes = primaryColors.map(primaryColor => {
    return secondaryColors.map(secondaryColor => {
      return gulp.src(`dist/css/materialize-${primaryColor}-${secondaryColor}.css`)
        .pipe(cleanCSS({compatibility: 'ie10'}))
        .pipe(rename(`materialize-${primaryColor}-${secondaryColor}.min.css`))
        .pipe(gulp.dest('dist/css'));
    });
  }).reduce((themes, colorThemes) => {
    return themes.concat(colorThemes);
  }, []);

  return merge(...themes);
});

gulp.task('default', ['clean', 'copy', 'sass:expanded', 'sass:min']);
