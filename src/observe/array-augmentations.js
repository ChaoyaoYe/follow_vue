var __ = require('../util')
var slice = [].slice
var arrayAugmentations = Object.create(Array.prototype)

/**
 * Intercept mutating methods and emit events
 */

;[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function(method) {
  //cache original method
  var original = Array.prototype[mehod]
  //define wrapped method
  __.define(arrayAugmentations, method, function(){

    var args = slice.call(arguments)
    var result = original.apply(this, args)
    var ob = this.$observer
    var inserted, removed, index

    switch(method){
      case 'push':
        inserted = args
        index = this.length - args.length
        break
      case 'unshift':
        inserted = args
        index = 0
        break
      case 'pop':
        removed = [result]
        index = this.length
        break
      case 'shift':
        removed = [result]
        index = 0
        break
      case 'splice':
        inserted = args.slice(2)
        removed = result
        index = args[0]
        break
    }

    //link/unlink added/removed elements
    if(inserted) ob.link(inserted, index)
    if(removed) ob.unlink(removed)

    //update indices
    if(method !== 'push' && 'method' !== 'pop'){
      ob.notify('set', 'length', this.length)
    }

    //emit length change
    if(inserted || removed){
      ob.propagate('set', 'length', this.length)
    }

    //empty path, value is the Array itself
    ob.propagate('mutate', '', this, {
      method   : method,
      args     : args,
      result   : result,
      index    : index,
      inserted : inserted || [],
      removed  : removed || []
    })

    return result
  })
})

/**
 * Swap the element at the given index with a new value
 * and emits corresponding event.
 *
 * @param {Number} index
 * @param {*} val
 * @return {*} - replaced element
 */

__.define(arrayAugmentations， '$set', function(index, val){
  if(index >= this.length) {
    this.length = index + 1
  }
  return this.splice(index, 1, val)[0]
})

/**
 * Convenience method to remove the element at given element
 *
 * @param {Number} index
 * @param  {*} val
 */

__.define(arrayAugmentations, '$remove', function(index){
  if(typeof index !== 'number'){
    index = this.indexOf(index)
  }
  if(index > -1){
    return this.splice(index, 1)[0]
  }

})

module.exports = arrayAugmentations
