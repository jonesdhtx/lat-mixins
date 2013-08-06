define(['lodash'], function(_) {
  // EventDelegation is to be used as a mixin for other objects.
  // It provides a set of generic methods to define events, a target
  // for event delegation, and two methods to bind and unbind the events
  // on the target.
  // An example usage:
  //
  //     var Tester = _.extend({}, EventDelegation, {
  //       events: function() {
  //         return {
  //           'click button': 'toggle'
  //         };
  //       },
  //       target: function() {
  //         return $('body');
  //       },
  //       toggle: function(event) {
  //         $(event.target)
  //           .closest('div')
  //             .toggleClass('selected');
  //       }
  //     };
  //
  //     var tester = _.create(Tester);
  //     tester.delegateEvents(); // attach the events
  //     //...
  //     tester.undelegateEvents(); // unattach the events

  // ## `Public`
  // These methods are accessible to the object that gets extended by this module.
  var public = {
    // ### `events`
    // Returns an object of events to be bound using jQuery's on method.
    // The format is as follows:
    //
    //     {
    //       'eventtype optionalselector': 'methodname'
    //     }
    //
    // If you don't pass the optional selector, the event is bound
    // directly to the `target()` element.
    events: function() {
      return {};
    },

    // ### `target`
    // The host object should implement this method. It should return
    // a jQuery wrapped element.
    target: function() {
      throw new Error('Not implemented');
    },

    // ### `delegateEvents`
    // Loops through the `events()` object and delegates
    // the events to the `target()` object using
    // jQuery's `on` method. The event handler is bound to the
    // host objects context and all arguments are proxied through.
    delegateEvents: function() {
      private.getEventObjects.call(this).forEach(function(event) {
        this.target().on(event.type, event.selector, event.handler);
      }, this);
      return this;
    },

    // ### `undelegateEvents`
    // Loops through the `events()` object and undelegates
    // the events on the `target()` object using jQuery's off method.
    undelegateEvents: function() {
      private.getEventObjects.call(this).forEach(function(event) {
        this.target().off(event.type, event.selector);
      }, this);
      return this;
    }
  };

  // ## Private
  var private = {
    // ### `getEventObjects`
    // Takes the results returned from `events()` and translates them
    // into a format that is easier utilized by `delegate`
    // and `undelegate`.
    // Return a lodash wrapped Array for easy chaining
    // of results.
    getEventObjects: function() {
      return _(this.events()).pairs().map(function(event) {
        var parts    = event[0].split(/\s(.*)?/),
            method   = event[1],
            type     = parts[0],
            selector = parts[1],
            fn       = _.bind(function() {
              this[method].apply(this, arguments);
            }, this);
        return {
          type: type,
          selector: selector,
          handler: fn
        };
      }, this);
    }
  };

  // Only expose the public interface to be mixed into other objects.
  return public;
});
