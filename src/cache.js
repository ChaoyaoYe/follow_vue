/**
 * A doubly linked list-based Least Recently Used (LRU) cache.
 * Will keep most recently used items while discarding least
 * recently used items when its limit is reached.
 *
 * Licensed under MIT.
 * Copyright (c) 2010 Rasmus Andersson <http://hunch.se/>
 *
 * Illustration of the design:
 *
 *       entry             entry             entry             entry
 *       ______            ______            ______            ______
 *      | head |.newer => |      |.newer => |      |.newer => | tail |
 *      |  A   |          |  B   |          |  C   |          |  D   |
 *      |______| <= older.|______| <= older.|______| <= older.|______|
 *
 *  removed  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  added
 *
 * @param {Number} limit
 * @constructor
 */
// attribute size->size of cache, limit->limit of cache, head and tail object
// of cache, _keymap-> key map of cache xc.2016-2-19.
function Cache (limit) {
  this.size = 0
  this.limit = limit
  this.head = this.tail = undefined
  this._keymap = {}
}

var p = Cache.prototype

/**
 * Put <value> into the cache associated with <key>.
 * Returns the entry which was removed to make room for
 * the new entry. Otherwise undefined is returned.
 * (i.e. if there was enough room already).
 *
 * @param {String} key
 * @param {*} value
 * @return {Entry|undefined}
 */
//put value by the key to the cache
p.put = function (key, value) {
  //create the entry to be put
  var entry = {
    key:key,
    value:value
  }
  this._keymap[key] = entry // add key to the keymap of cache
  if (this.tail) {// if the tail entry isn't empty, put new entry to it
    this.tail.newer = entry
    entry.older = this.tail
  } else {// if the tail entry is empty, let new entry be the head
    this.head = entry
  }
  this.tail = entry // reset the tail entry of cache
  if (this.size === this.limit) {// judge the size to determine whether to get rid of the old entry.
    return this.shift()
  } else {
    this.size++
  }
}

/**
 * Purge the least recently used (oldest) entry from the cache.
 * Returns the removed entry or undefined if the cache was empty.
 */

p.shift = function () {
  var entry = this.head
  if (entry) {
    this.head = this.head.newer
    this.head.older = undefined
    entry.newer = entry.older = undefined
    this._keymap[entry.key] = undefined
  }
  return entry
}

/**
 * Get and register recent use of <key>. Returns the value
 * associated with <key> or undefined if not in cache.
 *
 * @param {String} key
 * @param {Boolean} returnEntry
 * @return {Entry|*}
 */

p.get = function (key, returnEntry) {
  var entry = this._keymap[key]
  if (entry === undefined) return
  if (entry === this.tail) {
    return returnEntry
      ? entry
      : entry.value
  }
  // HEAD--------------TAIL
  //   <.older   .newer>
  //  <--- add direction --
  //   A  B  C  <D>  E
  if (entry.newer) {
    if (entry === this.head) {
      this.head = entry.newer
    }
    entry.newer.older = entry.older // C <-- E.
  }
  if (entry.older) {
    entry.older.newer = entry.newer // C. --> E
  }
  entry.newer = undefined // D --x
  entry.older = this.tail // D. --> E
  if (this.tail) {
    this.tail.newer = entry // E. <-- D
  }
  this.tail = entry
  return returnEntry
    ? entry
    : entry.value
}

module.exports = Cache
