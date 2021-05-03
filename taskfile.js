exports.copySass = function * (task) {
    yield task.source('node_modules/aos/src/sass/*.scss').target('styles/theme/assets/aos/');
    yield task.source('node_modules/bootstrap/scss/**/*.scss').target('styles/theme/assets/bootstrap-src/');
}