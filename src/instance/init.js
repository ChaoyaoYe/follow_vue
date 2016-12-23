var Emitter = require('../emitter')
var mergeOptions = require('../util/merge-option')

/**
 * The main init sequence. This is called for every instance,
 * including ones that are created from extended constructors.
 *
 * @param {Object} options - this options object should be the
 *                           result of merging class options
 *                           and the options passed in to the
 *                           constructor.
 */

exports._init = function (options) {

  options = options || {}

  this.$el          = null
  this.$            = {}
  this.$root        = this.$root || this
  this._emitter     = new Emitter(this)
  this._watchers    = Object.create(null)
  this._userWathers = Object.create(null)
  this._bindings = Object.create(null)
  this._directives  = []

  // block instance properties
  this._blockStart =
  this.blockEnd = null
  this._isBlock = false

  // lifecycle state
  this._isCompiled =
  this._isDestroyed =
  this._isReady =
  this._isAttached = false

  // children
  this._children =
  this._childCtors = null

  // anonymous instances are created by flow-control
  // directives such as v-if and v-repeat
  this._isAnonymous = options._anonymous

  // merge options.
  options = mergeOptions(
    this.constructor.options,
    options,
    this
  )

  // set data after merge
  this._data = options.data || {}

  // the `created` hook is called after basic properties have
  // been set up & before data observation happens.
  this._callHook('created')

  // Initialize data observertion and scope inheritance
  this._initScope()

  // setup binding tree.
  // @creates this._bindings
  this._initBindings()

  // setup event system and option events
  this._initEvents()

  // if `el` option is passed, start compilation.
  if (options.el) {
    this.$mount(options.el)
  }
}
