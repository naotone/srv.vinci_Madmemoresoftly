var files = ['*.html', '*.php', 'scripts/app.min.js', 'style.css'];

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browser = require( 'browser-sync' ).create();

var config = {
  isWatchify: false,
  isRelease: false
}


gulp.task('javascript', function() {
  return gulp.src('dev/js/app.js').pipe($.plumber({
    errorHandler: $.notify.onError('<%= error.message %>')
  }))
  .pipe($.if(!config.isRelease, $.sourcemaps.init({
    loadMaps: true
  })))
  .pipe($.if(config.isRelease, $.uglify({
    mangle: true,
    compress: {
      unsafe: true
      // hoist_vars: true
  }
  })))
  .pipe($.rename('app.min.js'))
  .pipe($.if(!config.isRelease, $.sourcemaps.write('./')))
  .pipe($.if(config.isRelease, gulp.dest('./release/scripts'), gulp.dest('scripts')))
  .pipe($.notify('gulp: js finished.'));
});

gulp.task('stylus', function() {
  var nib = require('nib');
  return gulp.src('dev/stylus/app.styl').pipe($.plumber({
    errorHandler: $.notify.onError('<%= error.message %>')
  })).pipe($.if(!config.isRelease, $.sourcemaps.init()))
  .pipe($.stylus({
    use: nib(),
    compress: true
  }))
  .pipe($.pleeease({
    minifier: false,
    autoprefixer: {
      browsers: ['last 2 version']
    }
  }))
  .pipe($.rename('style.css'))
  .pipe($.if(config.isRelease, $.minifyCss()))
  .pipe($.if(!config.isRelease, $.sourcemaps.write('.')))
  .pipe($.if(config.isRelease, gulp.dest('./release'), gulp.dest('./')))
  .pipe($.notify("gulp: stylus finished."));
});

// gulp.task( 'watch:js', function( done ) {
//   config.isWatchify = true;
//   done();
// } );

gulp.task( 'server', function() {
  browser.init( {
    server: {
      baseDir: './'
    }
  });
});
// gulp.task( 'watch', [ 'watch:js', 'js', 'css', 'server' ], function () {
gulp.task( 'watch', [ 'javascript', 'stylus', 'server' ], function () {
  gulp.watch( ['dev/stylus/app.styl'], ['stylus']);
  gulp.watch( ['dev/js/app.js'] ,['javascript']);
  gulp.watch(files).on('change', browser.reload);

} );

gulp.task( 'default', [ 'watch' ] );


//release/////////////////////////////////////
//////////////////////////////////////////////

gulp.task( 'release:clean', function( done ) {
  var del = require( 'del' );
  del( './release', done );
} );

gulp.task( 'release:copy', function() {
  var src = [
    './index.html',
    './images/**',
    './scripts/libs/**'
    // config.src + '/fonts/**'
  ];

  return gulp.src( src, { base: './' } )
    .pipe( gulp.dest( './release' ) );
} );

gulp.task( 'release:config', function( done ) {
  config.isRelease = true;
  done();
} );

// Build release image
gulp.task( 'release', function( done ) {
  var runSequence = require( 'run-sequence' );
  return runSequence(
    'release:clean',
    'release:copy',
    'release:config',
    [ 'javascript', 'stylus' ],
    done
  );
} );
