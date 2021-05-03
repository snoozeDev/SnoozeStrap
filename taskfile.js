exports.copyAssets = function * (task) {
    yield task.source('node_modules/aos/src/sass/*.scss').target('styles/theme/assets/aos/');
    yield task.source('node_modules/aos/dist/*.js').target('src/js/');
    yield task.source('node_modules/bootstrap/scss/**/*.scss').target('styles/theme/assets/bootstrap-src/');
}

exports.minifyJS = function * (task) {
    yield task.source('src/js/*.js')
    .concat('scripts.min.js')
    .uglify({
        annnotations: false,
        compress: {
            drop_console: true,
            join_vars: true
        },
        sourceMap: true
      })
    .target('./public/js/');
}