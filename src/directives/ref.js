module.exports = {

  isLiteral: true,

  bind: function () {
    var id = this.expression
    if (id) {
      var owner = this.vm.$parent
      // find the first parent vm that is not an
      // anonymous instance
      while(owner.isAnonymous){
        owner = owner.$parent
      }
      owner.$[id] = this.vm
      this.owner = owner
    }
  },

  unbind: function () {
    var id = this.expression
    if (id) {
      delete this.owner.$[id]
    }
  }

}
/**
 * bind->往vm对象的第一个非匿名parent中加入vm对象的引用，将vm和它的parent联系起来
 */
