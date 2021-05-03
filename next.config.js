const path = require('path')
const fs = require('fs')

module.exports = {
  future: {
    webpack5: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  env: {
    js: fs.readFileSync('./public/js/scripts.min.js').toString()
  }
}