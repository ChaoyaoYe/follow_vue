var _ = require('../../../../src/util')
var Vue = _.Vue
var def = require('../../../../src/directives/transition')

if (_.inBrowser) {
  describe('v-transition', function () {

    it('should instantiate a transition object with correct args', function () {
      var fns = {}
      var dir = {
        el: document.createElement('div'),
        expression: 'test',
        bind: def.bind,
        update: def.update,
        vm: {
          $options: {
            transitions: {
              test: fns
            }
          }
        }
      }
      dir.bind()
      var transition = dir.el.__v_trans
      expect(transition.el).toBe(dir.el)
      expect(transition.hooks).toBe(fns)
      expect(transition.enterClass).toBe('test-enter')
      expect(transition.leaveClass).toBe('test-leave')
      expect(dir.el.className === 'test-transition')
      dir.update('lol', 'test')
      transition = dir.el.__v_trans
      expect(transition.enterClass).toBe('lol-enter')
      expect(transition.leaveClass).toBe('lol-leave')
      expect(transition.fns).toBeUndefined()
      expect(dir.el.className === 'lol-transition')
    })

    it('should bind the transition to closest vm', function () {
      var vm1 = new Vue()
      var vm2 = new Vue()
      var dir = {
        el: document.createElement('div'),
        expression: 'test',
        bind: def.bind,
        update: def.update,
        vm: vm1
      }
      dir.el.__vue__ = vm2
      dir.bind()
      expect(dir.el.__v_trans.vm).toBe(vm2)
    })

    it('dynamic transitions', function (done) {
      var el = document.createElement('div')
      document.body.appendChild(el)
      var calls = {
        a: { enter: 0, leave: 0 },
        b: { enter: 0, leave: 0 }
      }
      var vm = new Vue({
        el: el,
        template: '<div v-show="show" v-transition="{{trans}}"></div>',
        data: {
          show: true,
          trans: 'a'
        },
        transitions: {
          a: {
            enter: function (el, done) {
              calls.a.enter++
              done()
            },
            leave: function (el, done) {
              calls.a.leave++
              done()
            }
          },
          b: {
            enter: function (el, done) {
              calls.b.enter++
              done()
            },
            leave: function (el, done) {
              calls.b.leave++
              done()
            }
          }
        }
      })

      assertCalls(0, 0, 0, 0)
      vm.show = false
      _.nextTick(function () {
        assertCalls(0, 1, 0, 0)
        vm.trans = 'b'
        vm.show = true
        _.nextTick(function () {
          assertCalls(0, 1, 1, 0)
          vm.show = false
          _.nextTick(function () {
            assertCalls(0, 1, 1, 1)
            vm.trans = 'a'
            vm.show = true
            _.nextTick(function () {
              assertCalls(1, 1, 1, 1)
              done()
            })
          })
        })
      })

      function assertCalls (a, b, c, d) {
        expect(el.firstChild.style.display).toBe(vm.show ? '' : 'none')
        expect(calls.a.enter).toBe(a)
        expect(calls.a.leave).toBe(b)
        expect(calls.b.enter).toBe(c)
        expect(calls.b.leave).toBe(d)
      }
    })
  })
}