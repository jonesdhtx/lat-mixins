define(['lodash'], function(_) {
  // Eventing is to be used as a mixin for other objects.
  // It only exposes a few methods to the public with the
  // rest of the logic and properties remaining private.
  // An example usage:
  //
  //     var Tester = _.extend({}, Eventing, {
  //       test: function() {
  //         this.publish('test');
  //       }
  //     };
  //
  //     var tester = _.create(Tester);
  //     tester.subscribe('test', function(event) {
  //       //do something
  //     });

  // ## Public
  // These methods are accessible to the object that gets extended by this module.
  var public = {
    // ### `subscribe`
    // Adds a function to be called for a given event type(s) when the event is published.
    // Can pass an Array or a space separated string for subscribing to multiple event types at once.
    // Can pass an optional thisArg for the handler to be called with.
    // This method is chainable.
    subscribe: function(types, fn, thisArg) {
      var handlers = private.handlers.call(this);
      // Can handle multiple types in either Array or space separated string.
      if (!_.isArray(types)) {
        types = types.split(/\s+/);
      }
      // Loop through the types
      _.forEach(types, _.bind(function(type) {
        handlers[type] = handlers[type] || [];
        // Check to see if the handler already exists for the given event type.
        var index = private.indexOf.call(this, type, fn, thisArg);
        if (index === -1) {
          // Add the handler to the array of handlers for the given event type.
          handlers[type].push({
            handler: fn,
            thisArg: thisArg
          });
        }
      }, this));

      // Return this for chaining
      return this;
    },

    // ### `unsubscribe`
    // Removes a handler from a given event type so that it will no longer be called
    // when the event is published.
    // If no types are passed, all handlers will be cleared.
    // If no fn is passed, all handlers for the specified types will be removed.
    // Can pass an Array or a space separated string for subscribing to multiple event types at once.
    // This method is chainable.
    unsubscribe: function(types, fn, thisArg) {
      var handlers = private.handlers.call(this);

      if ( types === undefined ) {
        private.clearHandlers.call(this);
      } else {
        // Can handle multiple types in either Array or space separated string.
        if (!_.isArray(types)) {
          types = types.split(/\s+/);
        }

        if ( fn === undefined ) {
          private.removeHandlers.call(this, types);
        } else {
          // Loop through the types
          _.forEach(types, _.bind(function(type) {
            var index = private.indexOf.call(this, type, fn, thisArg);
            if (index > -1) {
              // `splice` removes the handler from the array in place.
              handlers[type].splice(index, 1);
            }
          }, this));
        }
      }

      // Return this for chaining
      return this;
    },

    // ### `publish`
    // Calls each handler subscribed to the given event. The event can be a string
    // or an object with at least a type property.
    // This method is chainable.
    publish: function(event) {
      if (_.isString(event)) {
        // `event` is a string, convert it to an event object.
        event = {
          type: event
        };
      }
      private.handleEvent.call(this, event);

      // Return this for chaining
      return this;
    }
  };

  // ## Private
  var private = {

    // Maintains a listing of handlers by type
    handlers: function() {
      // Setup a handler list if it doesn't already exist
      return this._handlers || (this._handlers = {});
    },

    // Clear all handlers
    clearHandlers: function() {
      this._handlers = {};
    },

    // Remove specific type handlers
    removeHandlers: function(types) {
      _.forEach(types, function(aType) {
        delete this._handlers[aType];
      }, this);
    },

    // Loops through the handlers calling each one and passing along the event object
    handleEvent: function(event) {
      var type = event.type,
          // Uses a copy of the array of handlers for the given type.
          handlers = (private.handlers.call(this)[type] || []).slice(0),
          index = 0,
          handler;
      while ((handler = handlers[index++])) {
        // Sets the context of the handler to the given `thisArg` or object publishing the event.
        handler.handler.call(handler.thisArg || this, event);
      }
    },

    // Attempts to find the index of a given handler for a given type.
    indexOf: function(type, fn, thisArg) {
      var handlers = private.handlers.call(this)[type] || [],
          index = 0,
          handler;
      while ((handler = handlers[index++])) {
        if (handler.handler === fn && handler.thisArg === thisArg) {
          return index-1;
        }
      }
      // Returns -1 if no match was found.
      return -1;
    }
  };

  // Only expose the public interface to be mixed into other objects.
  return public;

});
