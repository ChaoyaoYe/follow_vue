module.exports = function (grunt) {

  grunt.initConfig({

    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        jshintrc: true
      },
      build: {
        src: ['gruntfile.js', 'tasks/*.js']
      },
      src: {
        src: 'src/**/*.js'
      },
      test: {
        src: 'test/*/specs/*.js'
      }
    },

    karma: {
      options: {
        frameworks: ['jasmine', 'commonjs'],
        preprocessors: {
          'src/*.js': ['commonjs'],
          'test/unit/**/*': ['commonjs']
        },
        files: [
          'src/*.js',
          'test/unit/**/*.js'
        ],
        singleRun: true
      },
      browsers: {
        options: {
          browsers: ['Chrome', 'Firefox'],
          reporters: ['progress']
        }
      }
    }
  }),

  browserify: {
    build: {
      src: ['src/vue.js'],
      dest: 'dist/vue.js',
      options: {
        bundleOptions {
          standalone: 'Vue'
        }
      }
    },
    watch: {
      src: ['src/vue.js'],
      dest: 'dist/vue.js',
      options: {
        watch: true,
        keepAlive: true,
        bundleOptions: {
          standalone: 'Vue'
        }
      }
    }
  },
  bench: {
    src: ['benchmarks/*.js', '!benchmarks/browsers.js'],
    dest: 'benchmarks/browsers.js'
  }

  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-karma')
  grunt.loadNpmTasks('grunt-browserify')

  //load custom tasks
  grunt.file.recurse('tasks', function (path) {
    require('./' + path)(grunt)
  })

  grunt.loadNpmTasks('unit', ['karma:browsers'])
  grunt.loadNpmTasks('phantom', ['karma:phantom'])
  grunt.loadNpmTasks('watch', ['browserify:watch'])
  grunt.loadNpmTasks('build', ['browserify:build'])

}
