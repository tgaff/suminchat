var gulp            = require('gulp');
var sass            = require('gulp-sass');
var autoprefixer    = require('gulp-autoprefixer');
var minifyCSS       = require('gulp-minify-css');
var connect         = require('gulp-connect');
var openPage        = require("gulp-open");
var getTranslatorKey = require('./translator-key.js');
var redirectToChat = require('./redirect.js')(/\/$/, '/chat.html');
var naverTranslator = require('./naverTranslatorServer.js');

// middleware function to pass to connect
function middlewares(connect, opt) {
  return [getTranslatorKey, naverTranslator.route, redirectToChat]
}


/**
*  RELOAD
*
*  reload page
*/

gulp.task("reload", function() {
  var stream = gulp.src('*.html')
    .pipe(connect.reload());

  return stream;
});

/**
*  CSS PREPROCESSING
*
*  Sass, vender prefix, minify, move
*/

gulp.task('css', function() {
  var stream = gulp.src('scss/**/*.scss')
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(minifyCSS({ noAdvanced: true }))
      .pipe(gulp.dest('css'))
      .pipe(connect.reload());

  return stream;
});


/**
*  WATCH
*
*  Rerun process after any of these files are edited
*/

gulp.task('watch', function() {
  gulp.watch('scss/**/*.scss', ['css']);
  gulp.watch('js/**/*.js', ['reload']);
  gulp.watch('images/**/*.{jpg,png,gif}', ['reload']);
  gulp.watch('*.html', ['reload']);
});

/**
*  CONNECT SERVER
*
*  Loads the server locally and reloads when
*  connect.reload() is called.
*/

gulp.task('connect', function() {
  connect.server({
    //root: '.', //setting this reveals a bug in gulp-connect that returns Forbidden+stacktrace
    port: 8000,
    livereload: true,
    middleware: middlewares
  });
});

gulp.task('serveprod', function() {
  connect.server({
    //root: '.',
    port: process.env.PORT || 8000,
    livereload: false,
    middleware: middlewares
  });
});

/**
*  BUILD TASKS
*
*  Local and production build tasks
*/
gulp.task('default', ['css', 'watch', 'connect'], function() {
  //Now open in browser
  var stream = gulp.src("chat.html")
      .pipe(openPage("", {
        app: "Google Chrome",
        url: "http://localhost:8000"
      }));

  return stream;
});

gulp.task('production', ['css', 'serveprod'], function() {
  console.log('production up!');
});
