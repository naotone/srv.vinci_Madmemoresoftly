files = ['*.html', '*.php', 'scripts/app.min.js', 'style.css']

gulp = require 'gulp'
$ = require('gulp-load-plugins')()
nib = require 'nib'

gulp.task 'watch',->
  $.livereload.listen()
  # gulp.watch 'dev/coffee/script.coffee',['coffee']
  gulp.watch 'dev/js/app.js',['javascript']
  gulp.watch 'dev/stylus/*.styl',['stylus']
  # gulp.watch 'gulpfile.coffee',['coffee','sass']
  gulp.watch files,['reload']

gulp.task 'reload',->
  gulp.src(files)
    .pipe $.livereload()

gulp.task 'jade', ->
  # jade = require 'gulp-jade'
  gulp.src 'dev/jade/script.coffee'
    .pipe $.plumber({
      errorHandler: notify.onError('<%= error.message %>')
      })
    .pipe $.livereload()
    .pipe $.notify("gulp: coffee finished.")

gulp.task 'coffee',->
  # coffee = require 'gulp-coffee'
  gulp.src 'dev/coffee/script.coffee'
    .pipe $.plumber({
      errorHandler: $.notify.onError('<%= error.message %>')
      })
    .pipe $.sourcemaps.init()
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
    # .pipe gulp.dest 'scripts'
    .pipe $.sourcemaps.init()
    .pipe $.uglify()
    .pipe $.rename 'app.min.js'
    .pipe $.sourcemaps.write( '.' )
    .pipe gulp.dest 'scripts'
    .pipe $.notify 'gulp: js finished.'

gulp.task 'stylus',->
  gulp.src 'dev/stylus/app.styl'
    .pipe $.plumber({
      errorHandler: $.notify.onError('<%= error.message %>')
      })
    .pipe $.sourcemaps.init()
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
    .pipe $.minifyCss()
    .pipe $.sourcemaps.write( '.' )
    .pipe gulp.dest __dirname
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
localhost= require 'gulp-connect'
gulp.task 'localhost',->
  localhost.server {
    root: __dirname
    port: 9990
    livereload: true
  }

gulp.task 'default',['localhost','watch']
# gulp.task 'default',['watch']