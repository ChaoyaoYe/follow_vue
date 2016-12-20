var _ = require('../util')
var templateParser = require('../parse/template')

exports.bind = function () {
  // a comment node means this is a binding for
  // {{{ inline unescaped html }}}
  if (this.el.nodeType === 8) {
    // hold nodes
    this.nodes = []
  }
}

exports.update = function (value) {
  value = _.guard(value)
  if (this.nodes) {
    this.swap(value)
  } else {
    this.el.innerHTML = value
  }
}
