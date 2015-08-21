files = ['*.html', '*.php', 'scripts/app.min.js', 'style.css']

gulp = require 'gulp'
$ = require('gulp-load-plugins')()
nib = require 'nib'

config = {
  isWatchify: false,
  isRelease: false
}

gulp.task 'watch',->
  # $.livereload.listen()
  # gulp.watch 'dev/coffee/script.coffee',['coffee']
  gulp.watch 'dev/js/app.js',['javascript']
  gulp.watch 'dev/stylus/*.styl',['stylus']
  # gulp.watch 'gulpfile.coffee',['coffee','sass']
  gulp.watch files,['reload']

gulp.task  'server', ->
  browser = require( 'browser-sync' ).create()
  browser.init
    server:
      baseDir: './'

gulp.task 'reload',->
  gulp.src(files)
    .pipe $.livereload()

gulp.task 'jade', ->
  gulp.src 'dev/jade/script.coffee'
    .pipe $.plumber({
      errorHandler: notify.onError('<%= error.message %>')
      })
    .pipe $.livereload()
    .pipe $.notify("gulp: coffee finished.")

gulp.task 'coffee',->
  gulp.src 'dev/coffee/script.coffee'
    .pipe $.plumber({
      errorHandler: $.notify.onError('<%= error.message %>')
      })
    .pipe( $.if( !(config.isRelease), $.sourcemaps.init({loadMaps: true})))
    .pipe $.coffee()
    # .pipe $.concat 'scripts/script.js'
    .pipe $.sourcemaps.write( '.' )
    .pipe gulp.dest 'scripts'
    .pipe $.notify("gulp: coffee finished.")

gulp.task 'javascript' ,->
  gulp.src 'dev/js/app.js'
    .pipe $.plumber({
      errorHandler: $.notify.onError('<%= error.message %>')
      })
    .pipe( $.if( !(config.isRelease), $.sourcemaps.init({loadMaps: true})))
    .pipe( $.if( config.isRelease, $.uglify() ) )
    .pipe $.rename 'app.min.js'
    .pipe( $.if( !( config.isRelease ), $.sourcemaps.write( './' ) ) )
    .pipe( $.if( config.isRelease, gulp.dest('./release/scripts'), gulp.dest('scripts')))
    .pipe $.notify 'gulp: js finished.'

gulp.task 'stylus',->
  gulp.src 'dev/stylus/app.styl'
    .pipe $.plumber({
      errorHandler: $.notify.onError('<%= error.message %>')
      })
    .pipe( $.if( !( config.isRelease ), $.sourcemaps.init() ) )
    .pipe $.stylus({
      use: nib()
      compress: true
    })
    .pipe $.pleeease {
      minifier: false
      autoprefixer:
        browsers:
          ['last 2 version']
    }
    .pipe $.rename 'style.css'
    .pipe( $.if( config.isRelease, $.minifyCss() ) )
    .pipe( $.if( !( config.isRelease ), $.sourcemaps.write( '.' ) ) )
    .pipe( $.if( config.isRelease, gulp.dest('./release'), gulp.dest('./')));
    .pipe $.notify("gulp: stylus finished.")

# gulp.task 'sass',->
#   sass= require 'gulp-ruby-sass'
#   pleeease= require 'gulp-pleeease'
#   gulp.src '.sass/*.sass'
#     .pipe $.plumber()
#     .pipe $.sass({
#       style:'nested'
#       "sourcemap=none": true
#     })
#     .pipe $.pleeease {
#       minifier:false
#       autoprefixer:
#         browsers:
#           ['last 2 version']
#     }
#     .pipe $.concat 'index.css'
#     .pipe $.gulp.dest __dirname
#


gulp.task 'default',['server','watch']
# gulp.task 'default',['watch']
