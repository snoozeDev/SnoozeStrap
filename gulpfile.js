var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
// var plumber = require('gulp-plumber');
// var watch = require( 'gulp-watch' );
// var gulpSequence = require('gulp-sequence');
var cleanCSS = require( 'gulp-clean-css' );
var autoprefixer = require( 'gulp-autoprefixer' );
var rename = require( 'gulp-rename' );
var concat = require( 'gulp-concat' );
var uglify = require( 'gulp-uglify' );
var zip = require('gulp-zip');
var pug = require('gulp-pug');
var browserSync = require('browser-sync').create();

var cfg = require( './gulpconfig.json' );
var paths = cfg.paths;

// Mark: SASS Task
gulp.task( 'sass', function() {
    return gulp.src( paths.sass + '/main.scss' )
        .pipe( sass( {
            // Resolve "bootstrap/scss/..." straight from node_modules
            loadPaths: [ paths.node ],
            // Bootstrap 5.3 still relies on @import and legacy Sass functions:
            // hide warnings coming from node_modules and from our own @import usage
            quietDeps: true,
            silenceDeprecations: [ 'import' ]
        } ).on( 'error', sass.logError ) )
        .pipe( autoprefixer( 'last 2 versions' ) )
        .pipe( rename( 'style.css' ) )
        .pipe( gulp.dest( paths.css ) );

});

// Mark: MinifyCSS Task
gulp.task( 'minifycss', function() {
    return gulp.src( paths.css + '/style.css', { sourcemaps: true } )
        .pipe( cleanCSS( { compatibility: '*' } ) )
        .pipe( rename( { suffix: '.min' } ) )
        .pipe( gulp.dest( paths.css, { sourcemaps: '.' } ) );
});

// Mark: Scripts Task
var scripts = [
    // Bootstrap 5 bundle ships Popper; no jQuery needed
    paths.node + 'bootstrap/dist/js/bootstrap.bundle.js',
    paths.dev + '/js/modernizr-custom.js',
    paths.dev + '/js/aos.js',

    // Adding currently empty javascript file to add on for your own themes´ customizations
    // Please add any customizations to this .js file only!
    paths.dev + '/js/custom-js.js'
];

function scriptsMin() {
    return gulp.src( scripts )
        .pipe( concat( 'scripts.min.js' ) )
        .pipe( uglify() )
        .pipe( gulp.dest( paths.js ) );
}

function scriptsFull() {
    return gulp.src( scripts )
        .pipe( concat( 'scripts.js' ) )
        .pipe( gulp.dest( paths.js ) );
}

gulp.task( 'scripts', gulp.parallel( scriptsMin, scriptsFull ) );

// Dev server: localhost only, no browser-sync control panel
var bsOptions = {
    server: {
        baseDir: 'dist'
    },
    listen: 'localhost',
    ui: false,
    // Inject the reload client as an external script so the page's CSP
    // (script-src 'self') doesn't block it; the default snippet is inline
    snippetOptions: {
        rule: {
            match: /<\/body>/i,
            fn: function ( snippet, match ) {
                return '<script async src="/browser-sync/browser-sync-client.js"></script>' + match;
            }
        }
    }
};

gulp.task('bs-reload', function (done) {
    browserSync.reload();
    done();
});

// Run gulp watch-bs
gulp.task( 'watch-bs', function() {
    browserSync.init( bsOptions );
    gulp.watch( paths.sass + '/*.scss', gulp.series('sass', 'minifycss', 'bs-reload') );
    gulp.watch( [paths.devjs + '/*.js'], gulp.series('scripts', 'bs-reload') );
    gulp.watch([paths.dist + '/*.html'], gulp.series('bs-reload'));
});

// Copy Assets
// (Bootstrap JS and SCSS are read straight from node_modules, no copy needed)

//Copy AOS JS file
function copyAosJs() {
    return gulp.src(paths.node + 'aos/dist/**/*.js')
        .pipe(gulp.dest(paths.devjs));
}

//Copy AOS SASS file
function copyAosScss() {
    return gulp.src(paths.node + 'aos/src/sass/*.scss')
        .pipe(gulp.dest(paths.sass + '/assets/aos-src'));
}

gulp.task('copy-assets', gulp.parallel(copyAosJs, copyAosScss));

// Run gulp copy all images
gulp.task('copy-img', function () {
    return gulp.src(paths.imgsrc + '/**/*', { encoding: false })
        .pipe(gulp.dest(paths.img));
});

// Run gulp copy all fonts
gulp.task('copy-fonts', function () {
    return gulp.src(paths.dev + '/fonts/**/*.woff', { encoding: false })
        .pipe(gulp.dest(paths.fonts));
});

// Run gulp browser-sync
gulp.task('browser-sync', function(done) {
    browserSync.init( bsOptions, done );
});

//Run gulp release
gulp.task('release', function () {
    return gulp.src('./dist/**/*', { encoding: false })
        .pipe(zip('release.zip'))
        .pipe(gulp.dest('./_RELEASE'));
});

// Run gulp pug
gulp.task('pug', function buildHTML() {
    return gulp.src(paths.pug + 'views/*.pug')
        .pipe(pug({
            doctype: 'html',
            debug: true,
            client: false
        }))
        .pipe(gulp.dest("./dist/"))
});

// Run gulp watch
gulp.task( 'watch', function() {
    gulp.watch( paths.sass + '/*.scss', gulp.series('sass', 'minifycss') );
    gulp.watch( [paths.devjs + '/*.js'], gulp.series('scripts') );
    gulp.watch( paths.pug + '*/*.pug', gulp.series('pug') );
});
