define([
  'lodash'
], function(_) {
  // A mixin that provides a `data` method.

  // ## Public
  var public = {
    // ### `data`
    // This method provides a means to interact
    // with the `_data` of a TestItem.
    // There are three method signatures:
    //   * `data(key, value)`
    //   * `data(key)`
    //   * `data()`
    //
    // It will set the value of the specified key
    // When passed data, it will replace the existing
    // data with the new data and return this
    // for chaining.
    // When passed nothing, it returns the data object.
    // The key param can reference a nested object
    // using dot notation.
    data: function() {
      // Default data to an empty object if not already set
      if (!this._data) { this._data = {}; }

      if (arguments.length === 2) {
        // When given two arguments, the first
        // argument is the key and the second
        // argument is the new value.
        // Cloning the value to break the reference.
        private.setValue.apply(this, arguments);
      } else if (arguments.length === 1) {
        if (_.isString(arguments[0])) {
          // If the argument is a string,
          // it is a key and we should
          // return the value.
          // Cloning the value to break the reference.
          return private.getValue.apply(this, arguments);
        } else {
          // Otherwise we need to completely
          // replace the current data with the
          // given data.
          this._data = _.clone(arguments[0], true);
        }
      } else {
        // Deprecated behavior
        // Return the entire data collection
        // without cloning.
        return this._data;
      }
      // Return this for chaining.
      return this;
    }
  };

  // ## Private
  var private = {
    // ### `getValue`
    // Takes a key and returns the value.
    // The key param can be nested on the
    // _data object using dot notation.
    // For example:
    //     getValue('config.selectionCount');
    getValue: function(key) {
      var obj = this._data;
      obj = _.getObject(obj, key) || {};
      key = key.split('.').pop();
      var val = obj[key];
      return _.isUndefined(val) ? undefined : _.clone(val, true);
    },

    // ### `setValue`
    // Takes a key and a value.
    // The key param can be nested on
    // the _data object using dot notation.
    // For example:
    //     setValue('config.selectionCount', 1);
    setValue: function(key, value) {
      var obj = this._data;
      obj = _.buildObject(obj, key);
      key = key.split('.').pop();
      obj[key] = _.clone(value, true);
    }
  };


  return public;

});
