var gulp = require('gulp');
var sass = require('gulp-sass');
// var plumber = require('gulp-plumber');
// var watch = require( 'gulp-watch' );
// var gulpSequence = require('gulp-sequence');
var sourcemaps = require( 'gulp-sourcemaps' );
var cleanCSS = require( 'gulp-clean-css' );
var autoprefixer = require( 'gulp-autoprefixer' );
var rename = require( 'gulp-rename' );
var concat = require( 'gulp-concat' );
var uglify = require( 'gulp-uglify' );
var imagemin = require( 'gulp-imagemin' );
var zip = require('gulp-zip');
var modernizr = require('gulp-modernizr');
var pug = require('gulp-pug');
var browserSync = require('browser-sync').create();

var cfg = require( './gulpconfig.json' );
var paths = cfg.paths;

// Mark: SASS Task
gulp.task( 'sass', function() {
    return stream = gulp.src( paths.sass + '/main.scss' )
        .pipe( sass( { errLogToConsole: true } ) )
        .pipe( autoprefixer( 'last 2 versions' ) )
        .pipe( rename( 'style.css' ) )
        .pipe( gulp.dest( paths.css ) );

});

// Mark: MinifyCSS Task
gulp.task( 'minifycss', function() {
    return gulp.src( paths.css + '/style.css' )
        .pipe( sourcemaps.init( { loadMaps: true } ) )
        .pipe( cleanCSS( { compatibility: '*' } ) )
        .pipe( rename( { suffix: '.min' } ) )
        .pipe( sourcemaps.write( './' ) )
        .pipe( gulp.dest( paths.css ) );
});

// Mark: Scripts Task
gulp.task( 'scripts', async function() {
    var scripts = [
        paths.dev + '/js/bootstrap.js',
        paths.dev + '/js/modernizr-custom.js',
        paths.dev + '/js/aos.js',

        // Adding currently empty javascript file to add on for your own themes´ customizations
        // Please add any customizations to this .js file only!
        paths.dev + '/js/custom-js.js'
    ];

    gulp.src( scripts )
        .pipe( concat( 'scripts.min.js' ) )
        .pipe( uglify() )
        .pipe( gulp.dest( paths.js ) );

    gulp.src( scripts )
        .pipe( concat( 'scripts.js' ) )
        .pipe( gulp.dest( paths.js ) );
});

gulp.task('bs-reload', function (done) {
    browserSync.reload();
    done();
});

// Run gulp watch
gulp.task( 'watch', function() {
    gulp.watch( paths.sass + '/*.scss', gulp.series('sass', 'minifycss') );
    gulp.watch( [paths.devjs + '/*.js'], gulp.series('scripts') );
});

// Run gulp watch-bs
gulp.task( 'watch-bs', function() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
    });
    gulp.watch( paths.sass + '/*.scss', gulp.series('sass', 'minifycss', 'bs-reload') );
    gulp.watch( [paths.devjs + '/*.js'], gulp.series('scripts', 'bs-reload') );
    gulp.watch([paths.dist + '/*.html'], gulp.series('bs-reload'));
});

// Copy Assets
gulp.task('copy-assets', async function () {
    // Copy bootstrap JS file
    gulp.src(paths.node + 'bootstrap/dist/js/bootstrap.js')
        .pipe(gulp.dest(paths.devjs));

    //Copy bootstrap SCSS files
    gulp.src(paths.node + 'bootstrap/scss/**/*.scss')
        .pipe(gulp.dest(paths.sass + '/assets/bootstrap-src'));

    //Copy AOS JS file
    gulp.src(paths.node + 'aos/dist/**/*.js')
        .pipe(gulp.dest(paths.devjs));

    //Copy AOS SASS file
    gulp.src(paths.node + 'aos/src/sass/*.scss')
        .pipe(gulp.dest(paths.sass + '/assets/aos-src'));
});

// Run gulp copy all images
gulp.task('copy-img', async function () {
    gulp.src(paths.imgsrc + '/**/*')
        .pipe(gulp.dest(paths.img))
});

// Run gulp copy all images
gulp.task('copy-fonts', async function () {
    gulp.src(paths.dev + '/fonts/**/*.woff')
        .pipe(gulp.dest(paths.fonts))
});

// Run: gulp imagemin
gulp.task( 'imagemin', async function() {
    gulp.src( paths.imgsrc + '/**/*.png' )
        .pipe( imagemin() )
        .pipe( gulp.dest( paths.img ) );
});

// Run gulp browser-sync
gulp.task('browser-sync', async function() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
    });
});

//Run gulp release
gulp.task('release', async function () {
    gulp.src('./dist/*')
        .pipe(zip('release.zip'))
        .pipe(gulp.dest('./_RELEASE'));
});

// Run gulp modernizr-build
gulp.task('modernizr-build', async function () {
    gulp.src('./src/js/*.js')
        .pipe(modernizr('modernizr-custom.js'));
});

// Run gulp pug
gulp.task('pug', function buildHTML() {
    return gulp.src(paths.dev + '/views/*.pug')
        .pipe(pug({
            filename: "template.pug",
            debug: true,
            client: true
        }))
        .pipe(gulp.dest("./"))
});
