module.exports = function (grunt) {
  grunt.registerTask('build', function () {

    var done = this.async()
    var fs = require('fs')
    var zlib = require('zlib')
    var build = require('../shared-build')
    var uglifyjs = require('uglify-js')

    // update component.json first
    var jsRE = /\.js$/
    var component = grunt.file.readJSON('component.json')
    component.scripts = []
    grunt.file.recurse('src', function (file) {
      if (jsRE.test(file)) {
        component.scripts.push(file)
      }
    })
    grunt.file.write('component.json', JSON.stringify(component, null, 2))

    // then build
    build(grunt, function (js) {
      write('dist/vue.js', js)
      // uglify
      var min = uglifyjs.minify(js, {
        fromString: true,
        compress: {
          pure_funcs: [
            '_.log',
            '_.warn',
            '_.assertAsset',
            'enableDebug'
          ]
        }
      }).code
      min = grunt.config.get('banner') + min
      write('dist/vue.min.js', min)
      // report gzip size
      zlib.gzip(min, function (err, buf) {
        write('dist/vue.min.js.gz', buf)
        done()
      })
    })

    function write (path, file) {
      fs.writeFileSync(path, file)
      console.log(
        blue(path + ': ') +
        (file.length / 1024).toFixed(2) + 'kb'
      )
    }

    function blue (str) {
      return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
    }
  })
}
