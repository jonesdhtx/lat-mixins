define(['lodash'], function(_) {
  // LinkedList is an implementation of a doubly linked list
  // using an array.

  // ## Public
  var public = {

    // ### `add`
    // Add a new node at the end of the list with the
    // given data payload.
    add: function(data) {
      if (!this._nodes) {
        this._nodes = []; // Initialize internal node array
      }
      var node = _.create(_.extend({ list: this }, Node));
      var length = this._nodes.push(node);
      node.data(data);
      node.next(length);
      node.previous(length-2);
      return node;
    },

    // ### `head`
    head: function() {
      return _.first(this._nodes);
    },

    // ### `tail`
    tail: function() {
      return _.last(this._nodes);
    },

    // ### `getAt`
    getAt: function(index) {
      return this._nodes[index];
    },

    // ### `size`
    size: function() {
      return this._nodes.length;
    },

    // ### `empty`
    empty: function() {
      this._nodes = [];
    },

    forEachNode: function(fn, thisArg) {
      for (var n = this.head(); n; n = n.next()) {
        fn.call(thisArg || this, n);
      }
    }
  };

  // ## Node
  // Represents the individual elements in the LinkedList.
  var Node = {

    // ### `data`
    data: function(data) {
      if (data) {
        this._data = data;
      } else {
        // Default to empty object
        return this._data || (this._data = {});
      }
    },

    // ### `previous`
    previous: function(index) {
      if(_.isNumber(index)) {
        this._previous = index;
      } else {
        return this.list.getAt(this._previous);
      }
    },

    // ### `next`
    next: function(index) {
      if(_.isNumber(index)) {
        this._next = index;
      } else {
        return this.list.getAt(this._next);
      }
    },

    // ### `hasPrevious`
    hasPrevious: function() {
      return !_.isUndefined(this.previous());
    },

    // ### `hasNext`
    hasNext: function() {
      return !_.isUndefined(this.next());
    },

    // ### `getIndex`
    getIndex: function() {
      return ( this._next + this._previous ) / 2;
    }
  };

  // Only expose the public api.
  return public;

});
