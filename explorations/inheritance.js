-var Observer = require('../src/observe/observer')
-var _ = require('../src/util')
-
-function Vue (options) {
-
-  var data = options.data
-  var parent = options.parent
-  var scope = this._scope = parent
-    ? Object.create(parent._scope)
-    : {}
-
-  // copy instantiation data into scope
-  for (var key in data) {
-    if (key in scope) {
-      // key exists on the scope prototype chain
-      // cannot use direct set here, because in the parent
-      // scope everything is already getter/setter and we
-      // need to overwrite them with Object.defineProperty.
-      _.define(scope, key, data[key], true)
-    } else {
-      scope[key] = data[key]
-    }
-  }
-
-  // create observer
-  // pass in noProto:true to avoid mutating the __proto__
-  var ob = this._observer = Observer.create(scope, { noProto: true })
-  var dob = Observer.create(data)
-  var locked = false
-
-  // sync scope and original data.
-  ob
-    .on('set', guard(function (key, val) {
-      data[key] = val
-    }))
-    .on('added', guard(function (key, val) {
-      data.$add(key, val)
-    }))
-    .on('deleted', guard(function (key) {
-      data.$delete(key)
-    }))
-
-  // also need to sync data object changes to scope...
-  // this would cause cycle updates, so we need to lock
-  // stuff when one side updates the other
-  dob
-    .on('set', guard(function (key, val) {
-      scope[key] = val
-    }))
-    .on('added', guard(function (key, val) {
-      scope.$add(key, val)
-    }))
-    .on('deleted', guard(function (key) {
-      scope.$delete(key)
-    }))
-
-  function guard (fn) {
-    return function (key, val) {
-      if (locked || key.indexOf(Observer.pathDelimiter) > -1) {
-        return
-      }
-      locked = true
-      fn(key, val)
-      locked = false
-    }
-  }
-
-  // relay change events from parent scope.
-  // this ensures the current Vue instance is aware of
-  // stuff going on up in the scope chain.
-  if (parent) {
-    var po = parent._observer
-    ;['set', 'mutate', 'added', 'deleted'].forEach(function (event) {
-      po.on(event, function (key, a, b) {
-        if (!scope.hasOwnProperty(key)) {
-          ob.emit(event, key, a, b)
-        }
-      })
-    })
-  }
-
-  // proxy everything on self
-  for (var key in scope) {
-    _.proxy(this, scope, key)
-  }
-
-  // also proxy newly added keys.
-  var self = this
-  ob.on('added', function (key) {
-    _.proxy(self, scope, key)
-  })
-
-}
-
-Vue.prototype.$add = function (key, val) {
-  this._scope.$add.call(this._scope, key, val)
-}
-
-Vue.prototype.$delete = function (key) {
-  this._scope.$delete.call(this._scope, key)
-}
-
-Vue.prototype.$toJSON = function () {
-  return JSON.stringify(this._scope)
-}
-
-Vue.prototype.$log = function (key) {
-  var data = key
-    ? this._scope[key]
-    : this._scope
-  console.log(JSON.parse(JSON.stringify(data)))
-}

var Vue = require('../src/vue')

window.model = {
  a: 'parent a',
  b: 'parent b',
  c: {
    d: 3
  },
  arr: [{a: 'item a'}],
  go: function () {
    console.log(this.a)
  }
}

window.vm = new Vue({
  data: model
})

window.child = new Vue({
  parent: vm,
  data: {
    a: 'child a',
    change: function () {
      this.c.d = 4
      this.b = 456 // Unlike Angular, setting primitive values in Vue WILL affect outer scope,
                   // unless you overwrite it in the instantiation data!
    }
  }
})

window.item = new Vue({
  parent: vm,
  data: vm.arr[0]
})

vm._observer.on('set', function (key, val) {
  console.log('vm set:' + key.replace(/[\b]/g, '.'), val)
})

child._observer.on('set', function (key, val) {
  console.log('child set:' + key.replace(/[\b]/g, '.'), val)
})

item._observer.on('set', function (key, val) {
  console.log('item set:' + key.replace(/[\b]/g, '.'), val)
})

// TODO turn these into tests

console.log(vm.a) // 'parent a'
console.log(child.a) // 'child a'
console.log(child.b) // 'parent b'
console.log(item.a) // 'item a'
console.log(item.b) // 'parent b'

// set shadowed parent property
vm.a = 'haha!' // vm set:a haha!

// set shadowed child property
child.a = 'hmm' // child set:a hmm

// test parent scope change downward propagation
vm.b = 'hoho!' // child set:b hoho!
               // item set:b hoho!
               // vm set:b hoho!

// set child owning an array item
item.a = 'wow' // child set:arr.0.a wow
               // item set:arr.0.a wow
               // vm set:arr.0.a wow
// item set:a wow
