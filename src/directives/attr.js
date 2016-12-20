var _ = require('../util')

// SVG xml namespace
var namespace = {
  xlink: 'http://www.w3.org/1999/xlink',
  ev: 'http://www.w3.org/2001/xml-events'
}

exports.bind = function () {
  var name = this.arg
  // check param attributes
  var params = this.vm.$options.paramAttributes
  this.isParam =
    this.el.__vue__ && // only check rootNode for params
    params &&
    params.indexOf(name) > -1
    //check namespace attributes
    if(this.el.namespaceURI.slice(3) === 'svg') {
      var colonIndex = name.indexOf(':')
      if(colonIndex > 0) {
        this.localName = name.slice(colonIndex + 1)
        this.namespace = namespace[name.slice(0, colonIndex)]
      }
    }
}

exports.update = function (value) {
  var el = this.el
  var ns = this.namespace
  var name = this.arg
  if (value || value === 0) {
    if(ns) {
      el.setAttributeNS(ns, name, value)
    }else {
      el.setAttribute(ns, name, value)
    }
  } else {
    if(ns){
      el.removeAttributeNS(ns, this.localName)
    }else{
      el.removeAttribute(name)
    }
  }
  if (this.isParam) {
    this.vm[name] = _.guardNumber(value)
  }
}
