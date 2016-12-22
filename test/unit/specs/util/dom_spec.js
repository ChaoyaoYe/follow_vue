var _ = require('../../../../src/util')

if (_.inBrowser) {

  describe('Util - DOM', function () {

    var parent, child, target

    function div () {
      return document.createElement('div')
    }

    beforeEach(function () {
      parent = div()
      child = div()
      target = div()
      parent.appendChild(child)
    })

    it('attr', function () {
      target.setAttribute('v-test', 'ok')
      var val = _.attr(target, 'test')
      expect(val).toBe('ok')
      expect(target.hasAttribute('v-test')).toBe(false)
    })

    it('before', function () {
      _.before(target, child)
      expect(target.parentNode).toBe(parent)
      expect(target.nextSibling).toBe(child)
    })

    it('after', function () {
      _.after(target, child)
      expect(target.parentNode).toBe(parent)
      expect(child.nextSibling).toBe(target)
    })

    it('after with sibling', function () {
      var sibling = div()
      parent.appendChild(sibling)
      _.after(target, child)
      expect(target.parentNode).toBe(parent)
      expect(child.nextSibling).toBe(target)
    })

    it('remove', function () {
      _.remove(child)
      expect(child.parentNode).toBeNull()
      expect(parent.childNodes.length).toBe(0)
    })

    it('prepend', function () {
      _.prepend(target, parent)
      expect(target.parentNode).toBe(parent)
      expect(parent.firstChild).toBe(target)
    })

    it('prepend to empty node', function () {
      parent.removeChild(child)
      _.prepend(target, parent)
      expect(target.parentNode).toBe(parent)
      expect(parent.firstChild).toBe(target)
    })

    it('replace', function(){
      _.replace(child, target)
      expect(parent.childNodes.length).toBe(1)
      expect(parent.firstChild).toBe(target)
    })

    it('copyAttributes', function () {
      parent.setAttribute('test1', 1)
      parent.setAttribute('test2', 2)
      _.copyAttributes(parent, target)
      expect(target.attributes.length).toBe(2)
      expect(target.getAttribute('test1')).toBe('1')
      expect(target.getAttribute('test2')).toBe('2')
    })
  })
}
