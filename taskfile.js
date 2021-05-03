exports.copySass = function * (task) {
    yield task.source('node_modules/aos/src/sass/*.scss').target('styles/theme/assets/aos/')
  }