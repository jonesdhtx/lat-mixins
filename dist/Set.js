define([
  'lodash',
  'lat-mixins/LinkedList'
], function(_, LinkedList) {
  // Set is a special variation of LinkedList that can be used
  // as an iterator. It keeps track of its current node internally,
  // and provides next / previous methods that return the specific
  // elements contained within the set.

  // ## Public
  var public = _.extend({}, LinkedList, {

    // ### `addAll`
    // Add an array of objects to this set
    addAll: function(objects) {
      _.forEach(objects, function(obj) {
        this.add(obj);
      }, this);
    },

    // ### `getAll`
    // Get all objects in this set as a simple array
    getAll: function(objects) {
      var all = [];
      this.forEach(function(obj) {
        all.push(obj);
      });
      return all;
    },

    // ### `select`
    // Update currentNode to point at the object at
    // the specified index within this Set.
    select: function(index) {
      return private.currentNode.call(this, this.getAt(index));
    },

    // ### `current`
    // Since this Set functions as iterator, return
    // the current object it is pointed at.
    current: function() {
      return private.currentNode.call(this).data();
    },

    // ### `currentIndex`
    // Returns the index of the currentNode within the Set.
    currentIndex: function() {
      return private.currentNode.call(this).getIndex();
    },

    // ### `next`
    // Advance to the next node in the LinkedList,
    // updating the currentNode reference and returning
    // the appropriate payload.
    next: function() {
      return private.objInDir.call(this, 'next');
    },

    // ### `previous`
    // Go back to the previous node in the LinkedList,
    // updating the currentNode reference and returning
    // the appropriate payload.
    previous: function() {
      return private.objInDir.call(this, 'previous');
    },

    // ### `hasNext`
    // Expose function from LinkedList for convenience.
    hasNext: function() {
      return private.currentNode.call(this).hasNext();
    },

    // ### `hasPrevious`
    // Expose function from LinkedList for convenience.
    hasPrevious: function() {
      return private.currentNode.call(this).hasPrevious();
    },

    // ### 'peek'
    // Peek at elements before or after current
    // 'which' can be pos or neg depending on desired
    // peek direction
    peek: function(which) {
      var peekIdx = this.currentIndex() + which;
      if(peekIdx >= 0 && peekIdx < this.size()) {
        return this.getAt(peekIdx).data();
      }
    },

    // ### `forEach`
    // Iterate through the set.
    forEach: function(fn, thisArg) {
      var idx = 0;
      for (var n = this.head(); n; n = n.next(), idx++) {
        fn.call(thisArg || this, n.data(), idx);
      }
    }
  });

  // ## Private
  var private = {
    // ### `nodeInDir`
    // Takes a direction [previous|next] and returns
    // the node or undefined.
    objInDir: function(dir) {
      var node = private.currentNode.call(this)[ dir ]();
      if (node) {
        private.currentNode.call(this, node);
        return node.data();
      } else {
        return undefined;
      }
    },

    // ### `currentNode`
    // Accessor function for getting this._currentNode.
    // Sets the currentNode to the LinkedList head if it
    // is undefined. If passed a node, it will update the
    // this._currentNode returning 'this' for chaining.
    // Otherwise it returns this._currentNode.
    currentNode: function(node) {
      if (!this._currentNode) {
        this._currentNode = this.head();
      }
      if (node) {
        this._currentNode = node;
        return this;
      }
      return this._currentNode;
    }
  };

  // Only expose the public api.
  return public;

});
