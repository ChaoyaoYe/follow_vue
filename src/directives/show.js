var transition = require('../transition')

module.exports = function (value) {
  var el = this.el
  transition.apply(el, value ? 1 : -1, function () {
    el.style.display = value ? '' : 'none'
  }, this.vm)
}

/**
 * v-show通过调用element.style.display来设置element的显示和隐藏,并携带切换动画
 */
