var _ = require('../util')
var assetTypes = [
  'directive',
  'filter',
  'partial',
  'effect',
  'component'
]

/**
 * Expose useful internals
 */

exports.util       = _
exports.config     = config
exports.nextTick   = _.nextTick
exports.transition = require('../transition/transition')

/**
 * Class inheritance
 *
 * @param {Object} extendOptions
 */

exports.extend = function (extendOptions) {
  var Super = this
  var Sub = function (instanceOptions) {
    Super.call(this, instanceOptions)
  }
  Sub.prototype = Object.create(Super.prototype)
  _.define(Sub.prototype, 'constructor', Sub)
  Sub.options = _.mergeOptions(Super.options, extendOptions)
  Sub.super = Super
  // allow further extension
  Sub.extend = Super.extend
  // create asset registers, so extended classes
  // can have their private assets too.
  createAssetRegisters(Sub)
  return Sub
}

/**
 * Plugin system
 *
 * @param {String|Object} plugin
 */

exports.use = function (plugin) {
  if (typeof plugin === 'string') {
    try {
      plugin = require(plugin)
    } catch (e) {
      _.warn('Cannot load plugin: ' + plugin)
    }
  }
  // additional parameters
  var args = _.toArray(arguments, 1)
  args.unshift(this)
  if (typeof plugin.install === 'function') {
    plugin.install.apply(plugin, args)
  } else {
    plugin.apply(null, args)
  }
  return this
}

/**
 * Define asset registration methods on a constructor.
 *
 * @param {Function} Ctor
 */

createAssetRegisters(exports)
function createAssetRegisters (Ctor) {
  assetTypes.forEach(function (type) {

    /**
     * Asset registration method.
     *
     * @param {String} id
     * @param {*} definition
     */

    Ctor[type] = function (id, definition) {
      this.options[type + 's'][id] = definition
    }
  })
}
