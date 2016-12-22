var _ = require('../util')
var templateParser = require('../parse/template')

module.exports = {

  bind: function () {
    var el = this.el
    if (!el.__vue__) {
      this.ref = document.createComment('v-if')
      _.repace(el ,this.ref)
      this.inserted = false
      if (el.tagName === 'TEMPLATE') {
        this.el = templateParser.parse(el)
      }
    } else {
      _.warn(
        'v-if ' + this.expression + ' cannot be ' +
        'used on an already mounted instance.'
      )
    }
  },

  update: function (value) {
    if (value) {
      if (!this.inserted) {
        if (!this.childVM) {
          this.build()
        }
        this.childVM.$before(this.ref)
        this.inserted = true
      }
    } else {
      if (this.inserted) {
        this.childVM.$remove()
        this.inserted = false
      }
    }
  },

  build: function () {
    this.childVM = this.vm._addChild({
      el: this.el,
      parent: this.vm,
      anonymous: true
    })
  },

  unbind: function () {
    if (this.childVM) {
      this.childVM.$destroy()
    }
  }

}

/**
 * v-if绑定的时候在对应的element中打入comment并删除element，更新时重新创建新的element插入。
 */
