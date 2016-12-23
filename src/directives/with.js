module.exports = {

  priority: 900,

  bind: function () {
    if(this.el !== this.vm.$el){
      this.invalid = true
      _.warn(
        'v-with can only be used on instance root elements.'
      )
    }
    if(this.arg) {
      var self = this
      this.vm.$watch(this.arg, function(val) {
        self.set(_.toNumber(val))
      })
    }
  },

  update: function (value) {
    if(this.invalid) return
    if (this.arg) {
      this.vm.$set(this.arg, value)
    } else if (this.vm.$data !== value) {
      this.vm.$data = value
    }
  }

}

