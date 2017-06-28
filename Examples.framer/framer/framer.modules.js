require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"ActionLayer":[function(require,module,exports){
var Action, ActionLayer, ActionTextLayer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Action = (function() {
  function Action(options) {
    var ref, ref1, ref2, ref3;
    if (options == null) {
      options = {};
    }
    this.name = (ref = options.name) != null ? ref : "action" + (_.random(1000));
    this.trigger = (function() {
      if ((ref1 = options.trigger) != null) {
        return ref1;
      } else {
        throw 'Action requires a trigger.';
      }
    })();
    this.action = (function() {
      if ((ref2 = options.action) != null) {
        return ref2;
      } else {
        throw 'Action requires an action.';
      }
    })();
    this.enabled = (ref3 = options.enabled) != null ? ref3 : true;
  }

  return Action;

})();

ActionLayer = (function(superClass) {
  extend(ActionLayer, superClass);

  function ActionLayer(options) {
    var ref, ref1, ref10, ref11, ref12, ref13, ref14, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9;
    if (options == null) {
      options = {};
    }
    this._actions = [];
    this._toggle = false;
    this._toggled = false;
    this._trigger = (ref = options.trigger) != null ? ref : 'Tap';
    this._action = (ref1 = options.action) != null ? ref1 : function() {
      return this.blinkUp.start();
    };
    this._initialAction = {
      name: 'initialAction',
      trigger: this._trigger,
      action: _.bind(this._action, this),
      enable: true
    };
    this._onTrigger = (ref2 = (ref3 = (ref4 = options.toggleOn) != null ? ref4.trigger : void 0) != null ? ref3 : this._trigger) != null ? ref2 : 'MouseOver';
    this._onAction = (ref5 = (ref6 = options.toggleOn) != null ? ref6.action : void 0) != null ? ref5 : function() {
      return this.animate({
        opacity: .6,
        options: {
          time: .15
        }
      });
    };
    this._toggleOn = {
      name: 'toggleOn',
      trigger: this._onTrigger,
      enable: true,
      action: function() {
        return this.toggled = true;
      }
    };
    this._offTrigger = (ref7 = (ref8 = (ref9 = options.toggleOff) != null ? ref9.trigger : void 0) != null ? ref8 : this._trigger) != null ? ref7 : 'MouseOut';
    this._offAction = (ref10 = (ref11 = options.toggleOff) != null ? ref11.action : void 0) != null ? ref10 : function() {
      return this.animate({
        opacity: 1,
        options: {
          time: .15
        }
      });
    };
    this._toggleOff = {
      name: 'toggleOff',
      trigger: this._offTrigger,
      enable: true,
      action: function() {
        return this.toggled = false;
      }
    };
    ActionLayer.__super__.constructor.call(this, _.defaults(options));
    this.blinkUp = new Animation(this, {
      brightness: 150,
      options: {
        time: .15
      }
    });
    this.blinkUp.on(Events.AnimationEnd, function() {
      return this.reset();
    });
    this.initial = (ref12 = options.initial) != null ? ref12 : true;
    this._toggle = (ref13 = options.toggle) != null ? ref13 : false;
    this.enable = (ref14 = options.enable) != null ? ref14 : true;
  }

  ActionLayer.define("trigger", {
    get: function() {
      var ref;
      return (ref = this._initialAction.trigger) != null ? ref : void 0;
    },
    set: function(trigger) {
      if (typeof trigger !== "string") {
        throw "ActionLayer: trigger must set with a Framer Event name formatted as a string, like 'Tap' or 'SwipeDown'.";
      }
      this.removeAction(this._initialAction);
      this._initialAction.trigger = trigger;
      if (this._enabled === true) {
        return this._setAction(this._initialAction);
      }
    }
  });

  ActionLayer.define("action", {
    get: function() {
      var ref;
      return (ref = this._initialAction.action) != null ? ref : void 0;
    },
    set: function(action) {
      if (typeof action !== "function") {
        throw "ActionLayer: trigger must set with a function, like '-> print 'Hello world'.";
      }
      this.removeAction(this._initialAction);
      this._initialAction.action = action;
      if (this._enabled === true) {
        return this._setAction(this._initialAction);
      }
    }
  });

  ActionLayer.define("initial", {
    get: function() {
      return this._initial;
    },
    set: function(bool) {
      if (bool === this._initial) {
        return;
      }
      this._inital = bool;
      switch (bool) {
        case true:
          return this._setAction(this._initialAction);
        case false:
          return this._unsetAction(this._initialAction);
      }
    }
  });

  ActionLayer.define("enable", {
    get: function() {
      return this._enabled;
    },
    set: function(bool) {
      if (bool === this._enabled) {
        return;
      }
      this._enabled = bool;
      return this.ignoreEvents = !bool;
    }
  });

  ActionLayer.define("isOn", {
    get: function() {
      return this._toggled;
    },
    set: function() {
      return 'ActionLayer.isOn is read only.';
    }
  });

  ActionLayer.define("toggleOff", {
    get: function() {
      return this._toggleOff;
    },
    set: function(actionObject) {
      var ref, ref1;
      this._unsetAction(this._toggleOff);
      this._offTrigger = (ref = actionObject.trigger) != null ? ref : this._offTrigger;
      this._offAction = (ref1 = actionObject.action) != null ? ref1 : this._offAction;
      this._toggleOff = {
        name: 'toggleOff',
        trigger: this._offTrigger,
        action: function() {
          return this.toggled = false;
        }
      };
      if (this._toggle === true) {
        return this._setAction(this._toggleOff);
      }
    }
  });

  ActionLayer.define("toggleOn", {
    get: function() {
      return this._toggleOn;
    },
    set: function(actionObject) {
      var ref, ref1;
      this._unsetAction(this._toggleOn);
      this._onTrigger = (ref = actionObject.trigger) != null ? ref : this._onTrigger;
      this._onAction = (ref1 = actionObject.action) != null ? ref1 : this._onAction;
      this._toggleOn = {
        name: 'toggleOn',
        trigger: this._onTrigger,
        action: function() {
          return this.toggled = true;
        }
      };
      if (this._toggle === true) {
        return this._setAction(this._toggleOn);
      }
    }
  });

  ActionLayer.define("toggle", {
    get: function() {
      return this._toggle;
    },
    set: function(bool) {
      if (bool === this._toggle) {
        return;
      }
      this._toggle = bool;
      switch (this._toggle) {
        case true:
          this._setAction(this._toggleOn);
          return this._setAction(this._toggleOff);
        case false:
          this._unsetAction(this._toggleOn);
          return this._unsetAction(this._toggleOff);
      }
    }
  });

  ActionLayer.define("toggled", {
    get: function() {
      return this._toggled;
    },
    set: function(bool) {
      switch (bool) {
        case true:
          if (this._toggled === true) {
            return;
          }
          return Utils.delay(.05, (function(_this) {
            return function() {
              _this._toggled = true;
              _.bind(_this._onAction, _this)();
              return _this.emit("change:toggled", true, _this);
            };
          })(this));
        case false:
          if (this._toggled === false) {
            return;
          }
          return Utils.delay(.05, (function(_this) {
            return function() {
              _this._toggled = false;
              _.bind(_this._offAction, _this)();
              return _this.emit("change:toggled", false, _this);
            };
          })(this));
      }
    }
  });

  ActionLayer.define("actions", {
    get: function() {
      return this._actions;
    },
    set: function() {
      throw 'ActionLayer.actions is read-only. Use .addActions() and .removeActions() to add or remove existing actions.';
    }
  });

  ActionLayer.prototype.addAction = function(options) {
    var _action, action, enable, name, ref, trigger;
    if (options == null) {
      options = {};
    }
    trigger = options.trigger;
    action = options.action;
    name = options.name;
    enable = (ref = options.enable) != null ? ref : true;
    if ((trigger == null) || typeof trigger !== "string") {
      throw "ActionLayer.addAction requires a Framer Event name formatted as a string, such as 'Tap' or 'SwipeEnd'.";
    }
    if ((action == null) || typeof action !== "function") {
      throw "ActionLayer.addAction requires a function, such as -> print @name.";
    }
    _action = {
      trigger: trigger,
      name: name,
      action: action
    };
    if (_.includes(this._actions, _action)) {
      return;
    }
    this._actions.push(_action);
    if (enable != null) {
      this._setAction(_action);
    }
    return _action;
  };

  ActionLayer.prototype.addActions = function(actions) {
    actions.forEach((function(_this) {
      return function(action) {
        return _this.addAction(action);
      };
    })(this));
    return actions;
  };

  ActionLayer.prototype.getActions = function(options) {
    var _actions;
    if (options == null) {
      options = {};
    }
    _actions = this._getActions(options);
    return _actions;
  };

  ActionLayer.prototype.getAction = function(options) {
    var _actions;
    if (options == null) {
      options = {};
    }
    _actions = this._getActions(options);
    return _actions[0];
  };

  ActionLayer.prototype.removeActions = function(actions) {
    actions = _.castArray(actions);
    if (actions.length === 0) {
      return;
    }
    return actions.forEach((function(_this) {
      return function(action) {
        return _this.removeAction(action);
      };
    })(this));
  };

  ActionLayer.prototype.removeAction = function(action) {
    this._unsetAction(action);
    return _.pull(this._action, actions);
  };

  ActionLayer.prototype.enableActions = function(actions) {
    actions = _.castArray(actions);
    if (actions.length === 0) {
      return;
    }
    return actions.forEach((function(_this) {
      return function(action) {
        return _this.enableAction(action);
      };
    })(this));
  };

  ActionLayer.prototype.enableAction = function(action) {
    return this._setAction(action);
  };

  ActionLayer.prototype.disableActions = function(actions) {
    actions = _.castArray(actions);
    if (actions.length === 0) {
      return;
    }
    return actions.forEach((function(_this) {
      return function(action) {
        return _this.disableAction(action);
      };
    })(this));
  };

  ActionLayer.prototype.disableAction = function(action) {
    return this._unsetAction(action);
  };

  ActionLayer.prototype._getActions = function(actionObject) {
    var _actions, name, trigger;
    trigger = actionObject.trigger;
    name = actionObject.name;
    if ((trigger != null) && typeof trigger !== "string") {
      throw "ActionLayer.addAction requires a trigger a string, such as 'Tap' or 'SwipeEnd'.";
    }
    if ((name != null) && typeof name !== "string") {
      throw "ActionLayer.addAction requires a name as a string, such as 'greet' or 'blink'.";
    }
    _actions = (function() {
      if ((trigger != null) && (name != null)) {
        return _.filter(this._actions, {
          'trigger': trigger,
          'name': name
        });
      } else if (name != null) {
        return _.filter(this._actions, {
          'name': name
        });
      } else if (trigger != null) {
        return _.filter(this._actions, {
          'trigger': trigger
        });
      } else {
        throw "ActionLayer.removeAction requires either the action's trigger or its name.";
      }
    }).call(this);
    return _actions;
  };

  ActionLayer.prototype._setAction = function(actionObject) {
    var action, trigger;
    trigger = actionObject.trigger;
    action = actionObject.action;
    return this.on(Events[trigger], action);
  };

  ActionLayer.prototype._unsetAction = function(actionObject) {
    var action, trigger;
    trigger = actionObject.trigger;
    action = actionObject.action;
    return this.off(Events[trigger], action);
  };

  return ActionLayer;

})(Layer);

ActionTextLayer = (function(superClass) {
  extend(ActionTextLayer, superClass);

  function ActionTextLayer(options) {
    var ref, ref1, ref10, ref11, ref12, ref13, ref14, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9;
    if (options == null) {
      options = {};
    }
    this._actions = [];
    this._toggle = false;
    this._toggled = false;
    this._trigger = (ref = options.trigger) != null ? ref : 'Tap';
    this._action = (ref1 = options.action) != null ? ref1 : function() {
      this.blinkUp = new Animation(this, {
        brightness: 150,
        options: {
          time: .15
        }
      });
      this.blinkUp.on(Events.AnimationEnd, function() {
        return this.reset();
      });
      return this.blinkUp.start();
    };
    this._initialAction = {
      name: 'initialAction',
      trigger: this._trigger,
      action: _.bind(this._action, this),
      enable: true
    };
    this._onTrigger = (ref2 = (ref3 = (ref4 = options.toggleOn) != null ? ref4.trigger : void 0) != null ? ref3 : this._trigger) != null ? ref2 : 'MouseOver';
    this._onAction = (ref5 = (ref6 = options.toggleOn) != null ? ref6.action : void 0) != null ? ref5 : function() {
      return this.animate({
        opacity: .6,
        options: {
          time: .15
        }
      });
    };
    this._toggleOn = {
      name: 'toggleOn',
      trigger: this._onTrigger,
      enable: true,
      action: function() {
        return this.toggled = true;
      }
    };
    this._offTrigger = (ref7 = (ref8 = (ref9 = options.toggleOff) != null ? ref9.trigger : void 0) != null ? ref8 : this._trigger) != null ? ref7 : 'MouseOut';
    this._offAction = (ref10 = (ref11 = options.toggleOff) != null ? ref11.action : void 0) != null ? ref10 : function() {
      return this.animate({
        opacity: 1,
        options: {
          time: .15
        }
      });
    };
    this._toggleOff = {
      name: 'toggleOff',
      trigger: this._offTrigger,
      enable: true,
      action: function() {
        return this.toggled = false;
      }
    };
    ActionTextLayer.__super__.constructor.call(this, _.defaults(options));
    this.initial = (ref12 = options.initial) != null ? ref12 : true;
    this._toggle = (ref13 = options.toggle) != null ? ref13 : false;
    this.enable = (ref14 = options.enable) != null ? ref14 : true;
  }

  ActionTextLayer.define("trigger", {
    get: function() {
      var ref;
      return (ref = this._initialAction.trigger) != null ? ref : void 0;
    },
    set: function(trigger) {
      if (typeof trigger !== "string") {
        throw "ActionLayer: trigger must set with a Framer Event name formatted as a string, like 'Tap' or 'SwipeDown'.";
      }
      this.removeAction(this._initialAction);
      this._initialAction.trigger = trigger;
      if (this._enabled === true) {
        return this._setAction(this._initialAction);
      }
    }
  });

  ActionTextLayer.define("action", {
    get: function() {
      var ref;
      return (ref = this._initialAction.action) != null ? ref : void 0;
    },
    set: function(action) {
      if (typeof action !== "function") {
        throw "ActionLayer: trigger must set with a function, like '-> print 'Hello world'.";
      }
      this.removeAction(this._initialAction);
      this._initialAction.action = action;
      if (this._enabled === true) {
        return this._setAction(this._initialAction);
      }
    }
  });

  ActionTextLayer.define("initial", {
    get: function() {
      return this._initial;
    },
    set: function(bool) {
      if (bool === this._initial) {
        return;
      }
      this._inital = bool;
      switch (bool) {
        case true:
          return this._setAction(this._initialAction);
        case false:
          return this._unsetAction(this._initialAction);
      }
    }
  });

  ActionTextLayer.define("enable", {
    get: function() {
      return this._enabled;
    },
    set: function(bool) {
      if (bool === this._enabled) {
        return;
      }
      this._enabled = bool;
      return this.ignoreEvents = !bool;
    }
  });

  ActionTextLayer.define("isOn", {
    get: function() {
      return this._toggled;
    },
    set: function() {
      return 'ActionLayer.isOn is read only.';
    }
  });

  ActionTextLayer.define("toggleOff", {
    get: function() {
      return this._toggleOff;
    },
    set: function(actionObject) {
      var ref, ref1;
      this._unsetAction(this._toggleOff);
      this._offTrigger = (ref = actionObject.trigger) != null ? ref : this._offTrigger;
      this._offAction = (ref1 = actionObject.action) != null ? ref1 : this._offAction;
      this._toggleOff = {
        name: 'toggleOff',
        trigger: this._offTrigger,
        action: function() {
          return this.toggled = false;
        }
      };
      if (this._toggle === true) {
        return this._setAction(this._toggleOff);
      }
    }
  });

  ActionTextLayer.define("toggleOn", {
    get: function() {
      return this._toggleOn;
    },
    set: function(actionObject) {
      var ref, ref1;
      this._unsetAction(this._toggleOn);
      this._onTrigger = (ref = actionObject.trigger) != null ? ref : this._onTrigger;
      this._onAction = (ref1 = actionObject.action) != null ? ref1 : this._onAction;
      this._toggleOn = {
        name: 'toggleOn',
        trigger: this._onTrigger,
        action: function() {
          return this.toggled = true;
        }
      };
      if (this._toggle === true) {
        return this._setAction(this._toggleOn);
      }
    }
  });

  ActionTextLayer.define("toggle", {
    get: function() {
      return this._toggle;
    },
    set: function(bool) {
      if (bool === this._toggle) {
        return;
      }
      this._toggle = bool;
      switch (this._toggle) {
        case true:
          this._setAction(this._toggleOn);
          return this._setAction(this._toggleOff);
        case false:
          this._unsetAction(this._toggleOn);
          return this._unsetAction(this._toggleOff);
      }
    }
  });

  ActionTextLayer.define("toggled", {
    get: function() {
      return this._toggled;
    },
    set: function(bool) {
      switch (bool) {
        case true:
          if (this._toggled === true) {
            return;
          }
          return Utils.delay(.05, (function(_this) {
            return function() {
              _this._toggled = true;
              _.bind(_this._onAction, _this)();
              return _this.emit("change:toggled", true);
            };
          })(this));
        case false:
          if (this._toggled === false) {
            return;
          }
          return Utils.delay(.05, (function(_this) {
            return function() {
              _this._toggled = false;
              _.bind(_this._offAction, _this)();
              return _this.emit("change:toggled", false);
            };
          })(this));
      }
    }
  });

  ActionTextLayer.define("actions", {
    get: function() {
      return this._actions;
    },
    set: function() {
      throw 'ActionLayer.actions is read-only. Use .addActions() and .removeActions() to add or remove existing actions.';
    }
  });

  ActionTextLayer.prototype.addAction = function(options) {
    var _action, action, enable, name, ref, trigger;
    if (options == null) {
      options = {};
    }
    trigger = options.trigger;
    action = options.action;
    name = options.name;
    enable = (ref = options.enable) != null ? ref : true;
    if ((trigger == null) || typeof trigger !== "string") {
      throw "ActionLayer.addAction requires a Framer Event name formatted as a string, such as 'Tap' or 'SwipeEnd'.";
    }
    if ((action == null) || typeof action !== "function") {
      throw "ActionLayer.addAction requires a function, such as -> print @name.";
    }
    _action = {
      trigger: trigger,
      name: name,
      action: action
    };
    if (_.includes(this._actions, _action)) {
      return;
    }
    this._actions.push(_action);
    if (enable != null) {
      this._setAction(_action);
    }
    return _action;
  };

  ActionTextLayer.prototype.addActions = function(actions) {
    actions.forEach((function(_this) {
      return function(action) {
        return _this.addAction(action);
      };
    })(this));
    return actions;
  };

  ActionTextLayer.prototype.getActions = function(options) {
    var _actions;
    if (options == null) {
      options = {};
    }
    _actions = this._getActions(options);
    return _actions;
  };

  ActionTextLayer.prototype.getAction = function(options) {
    var _actions;
    if (options == null) {
      options = {};
    }
    _actions = this._getActions(options);
    return _actions[0];
  };

  ActionTextLayer.prototype.removeActions = function(actions) {
    actions = _.castArray(actions);
    if (actions.length === 0) {
      return;
    }
    return actions.forEach((function(_this) {
      return function(action) {
        return _this.removeAction(action);
      };
    })(this));
  };

  ActionTextLayer.prototype.removeAction = function(action) {
    this._unsetAction(action);
    return _.pull(this._actions, action);
  };

  ActionTextLayer.prototype.enableActions = function(actions) {
    actions = _.castArray(actions);
    if (actions.length === 0) {
      return;
    }
    return actions.forEach((function(_this) {
      return function(action) {
        return _this.enableAction(action);
      };
    })(this));
  };

  ActionTextLayer.prototype.enableAction = function(action) {
    return this._setAction(action);
  };

  ActionTextLayer.prototype.disableActions = function(actions) {
    actions = _.castArray(actions);
    if (actions.length === 0) {
      return;
    }
    return actions.forEach((function(_this) {
      return function(action) {
        return _this.disableAction(action);
      };
    })(this));
  };

  ActionTextLayer.prototype.disableAction = function(action) {
    return this._unsetAction(action);
  };

  ActionTextLayer.prototype._getActions = function(actionObject) {
    var _actions, name, trigger;
    trigger = actionObject.trigger;
    name = actionObject.name;
    if ((trigger != null) && typeof trigger !== "string") {
      throw "ActionLayer.addAction requires a trigger a string, such as 'Tap' or 'SwipeEnd'.";
    }
    if ((name != null) && typeof name !== "string") {
      throw "ActionLayer.addAction requires a name as a string, such as 'greet' or 'blink'.";
    }
    _actions = (function() {
      if ((trigger != null) && (name != null)) {
        return _.filter(this._actions, {
          'trigger': trigger,
          'name': name
        });
      } else if (name != null) {
        return _.filter(this._actions, {
          'name': name
        });
      } else if (trigger != null) {
        return _.filter(this._actions, {
          'trigger': trigger
        });
      } else {
        throw "ActionLayer.removeAction requires either the action's trigger or its name.";
      }
    }).call(this);
    return _actions;
  };

  ActionTextLayer.prototype._setAction = function(actionObject) {
    var action, trigger;
    trigger = actionObject.trigger;
    action = actionObject.action;
    return this.on(Events[trigger], action);
  };

  ActionTextLayer.prototype._unsetAction = function(actionObject) {
    var action, trigger;
    trigger = actionObject.trigger;
    action = actionObject.action;
    return this.off(Events[trigger], action);
  };

  return ActionTextLayer;

})(TextLayer);

exports.Action = Action;

exports.ActionLayer = ActionLayer;

exports.ActionTextLayer = ActionTextLayer;


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3N0ZXZlcnVpei9HaXRIdWIvQWN0aW9uTGF5ZXIvRXhhbXBsZXMuZnJhbWVyL21vZHVsZXMvbXlNb2R1bGUuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvc3RldmVydWl6L0dpdEh1Yi9BY3Rpb25MYXllci9FeGFtcGxlcy5mcmFtZXIvbW9kdWxlcy9BY3Rpb25MYXllci5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iLCIjIEFjdGlvbkxheWVyIC8gQWN0aW9uVGV4dExheWVyIC8gQWN0aW9uIC8gRm9jdXNDb21wb25lbnRcblxuY2xhc3MgQWN0aW9uXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucyA9IHt9KSAtPlxuXHRcdEBuYW1lID0gb3B0aW9ucy5uYW1lID8gXCJhY3Rpb24je18ucmFuZG9tKDEwMDApfVwiXG5cdFx0QHRyaWdnZXIgPSBvcHRpb25zLnRyaWdnZXIgPyB0aHJvdyAnQWN0aW9uIHJlcXVpcmVzIGEgdHJpZ2dlci4nXG5cdFx0QGFjdGlvbiA9IG9wdGlvbnMuYWN0aW9uID8gdGhyb3cgJ0FjdGlvbiByZXF1aXJlcyBhbiBhY3Rpb24uJ1xuXHRcdEBlbmFibGVkID0gb3B0aW9ucy5lbmFibGVkID8gdHJ1ZVxuXG5jbGFzcyBBY3Rpb25MYXllciBleHRlbmRzIExheWVyXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucyA9IHt9KSAtPlxuXG5cdFx0IyBzZXQgZ2VuZXJhbCBvcHRpb25zXG5cdFx0QF9hY3Rpb25zID0gW11cblx0XHRAX3RvZ2dsZSA9IGZhbHNlXG5cdFx0QF90b2dnbGVkID0gZmFsc2VcblxuXHRcdCMgZGVmaW5lIGluaXRpYWwgYWN0aW9uIG9iamVjdFxuXHRcdEBfdHJpZ2dlciA9IG9wdGlvbnMudHJpZ2dlciA/ICdUYXAnXG5cdFx0QF9hY3Rpb24gPSBvcHRpb25zLmFjdGlvbiA/IC0+IEBibGlua1VwLnN0YXJ0KClcblx0XHRAX2luaXRpYWxBY3Rpb24gPSB7bmFtZTogJ2luaXRpYWxBY3Rpb24nLCB0cmlnZ2VyOiBAX3RyaWdnZXIsIGFjdGlvbjogXy5iaW5kKEBfYWN0aW9uLCBAKSwgZW5hYmxlOiB0cnVlfVxuXG5cdFx0IyBkZWZpbmUgdG9nZ2xlT24gYWN0aW9uIG9iamVjdFxuXHRcdEBfb25UcmlnZ2VyID0gb3B0aW9ucy50b2dnbGVPbj8udHJpZ2dlciA/IEBfdHJpZ2dlciA/ICdNb3VzZU92ZXInXG5cdFx0QF9vbkFjdGlvbiA9IFx0b3B0aW9ucy50b2dnbGVPbj8uYWN0aW9uID8gLT4gQGFuaW1hdGUge29wYWNpdHk6IC42LCBvcHRpb25zOiB7dGltZTogLjE1fX1cblx0XHRAX3RvZ2dsZU9uID0ge25hbWU6ICd0b2dnbGVPbicsIHRyaWdnZXI6IEBfb25UcmlnZ2VyLCBlbmFibGU6IHRydWUsIGFjdGlvbjogLT5cblx0XHRcdEB0b2dnbGVkID0gdHJ1ZVxuXHRcdFx0fVxuXG5cdFx0IyBkZWZpbmUgdG9nZ2xlT2ZmIGFjdGlvbiBvYmplY3Rcblx0XHRAX29mZlRyaWdnZXIgPSBvcHRpb25zLnRvZ2dsZU9mZj8udHJpZ2dlciA/IEBfdHJpZ2dlciA/ICdNb3VzZU91dCdcblx0XHRAX29mZkFjdGlvbiA9ICBvcHRpb25zLnRvZ2dsZU9mZj8uYWN0aW9uID8gLT4gQGFuaW1hdGUge29wYWNpdHk6IDEsIG9wdGlvbnM6IHt0aW1lOiAuMTV9fVxuXHRcdEBfdG9nZ2xlT2ZmID0ge25hbWU6ICd0b2dnbGVPZmYnLCB0cmlnZ2VyOiBAX29mZlRyaWdnZXIsIGVuYWJsZTogdHJ1ZSwgYWN0aW9uOiAtPlxuXHRcdFx0QHRvZ2dsZWQgPSBmYWxzZVxuXHRcdFx0fVxuXG5cblx0XHQjIHNldCBvcHRpb25zIGZyb20gb3B0aW9ucyBvYmplY3Rcblx0XHRzdXBlciBfLmRlZmF1bHRzIG9wdGlvbnNcblxuXHRcdEBibGlua1VwID0gbmV3IEFuaW1hdGlvbiBALCB7YnJpZ2h0bmVzczogMTUwLCBvcHRpb25zOnt0aW1lOiAuMTV9fVxuXHRcdEBibGlua1VwLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsIC0+IEByZXNldCgpXG5cblx0XHRcblx0XHQjIHNldCBpbml0aWFsIChpZiB0cnVlLCBzZXQgaW5pdGlhbCBhY3Rpb24pXG5cdFx0QGluaXRpYWwgPSBvcHRpb25zLmluaXRpYWwgPyB0cnVlXG5cblx0XHQjIHNldCB0b2dnbGUgKGlmIHRydWUsIHNldCB0b2dnbGUgYWN0aW9ucylcblx0XHRAX3RvZ2dsZSA9IG9wdGlvbnMudG9nZ2xlID8gZmFsc2VcblxuXHRcdCMgc2V0IHdoZXRoZXIgdG8gZW5hYmxlIGV2ZW50cyAoaWYgZmFsc2UsIHNldCBpZ25vcmUgZXZlbnRzKVxuXHRcdEBlbmFibGUgPSBvcHRpb25zLmVuYWJsZSA/IHRydWVcblxuXG5cdCMgaW5pdGlhbCBhY3Rpb24gLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0IyBzZXQgdGhlIGluaXRpYWwgYWN0aW9uJ3MgdHJpZ2dlclxuXHRAZGVmaW5lIFwidHJpZ2dlclwiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfaW5pdGlhbEFjdGlvbi50cmlnZ2VyID8gdW5kZWZpbmVkXG5cdFx0c2V0OiAodHJpZ2dlcikgLT5cblx0XHRcdHRocm93IFwiQWN0aW9uTGF5ZXI6IHRyaWdnZXIgbXVzdCBzZXQgd2l0aCBhIEZyYW1lciBFdmVudCBuYW1lIGZvcm1hdHRlZCBhcyBhIHN0cmluZywgbGlrZSAnVGFwJyBvciAnU3dpcGVEb3duJy5cIiBpZiB0eXBlb2YgdHJpZ2dlciBpc250IFwic3RyaW5nXCJcblx0XHRcdFxuXHRcdFx0IyByZW1vdmUgaW5pdGlhbCBhY3Rpb25cblx0XHRcdEByZW1vdmVBY3Rpb24oQF9pbml0aWFsQWN0aW9uKVxuXG5cdFx0XHQjIGNoYW5nZSB0cmlnZ2VyXG5cdFx0XHRAX2luaXRpYWxBY3Rpb24udHJpZ2dlciA9IHRyaWdnZXJcblxuXHRcdFx0aWYgQF9lbmFibGVkIGlzIHRydWUgdGhlbiBAX3NldEFjdGlvbihAX2luaXRpYWxBY3Rpb24pXG5cblx0IyBkZWZpbmUgdGhlIGluaXRpYWwgYWN0aW9uJ3MgYWN0aW9uXG5cdEBkZWZpbmUgXCJhY3Rpb25cIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX2luaXRpYWxBY3Rpb24uYWN0aW9uID8gdW5kZWZpbmVkXG5cdFx0c2V0OiAoYWN0aW9uKSAtPlxuXHRcdFx0dGhyb3cgXCJBY3Rpb25MYXllcjogdHJpZ2dlciBtdXN0IHNldCB3aXRoIGEgZnVuY3Rpb24sIGxpa2UgJy0+IHByaW50ICdIZWxsbyB3b3JsZCcuXCIgaWYgdHlwZW9mIGFjdGlvbiBpc250IFwiZnVuY3Rpb25cIlxuXHRcdFx0XG5cdFx0XHQjIHJlbW92ZSBpbml0aWFsIGFjdGlvblxuXHRcdFx0QHJlbW92ZUFjdGlvbihAX2luaXRpYWxBY3Rpb24pXG5cblx0XHRcdCMgY2hhbmdlIHRyaWdnZXJcblx0XHRcdEBfaW5pdGlhbEFjdGlvbi5hY3Rpb24gPSBhY3Rpb25cblxuXHRcdFx0aWYgQF9lbmFibGVkIGlzIHRydWUgdGhlbiBAX3NldEFjdGlvbihAX2luaXRpYWxBY3Rpb24pXG5cblx0IyBlbmFibGVcblx0QGRlZmluZSBcImluaXRpYWxcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX2luaXRpYWxcblx0XHRzZXQ6IChib29sKSAtPiBcblx0XHRcdHJldHVybiBpZiBib29sIGlzIEBfaW5pdGlhbFxuXHRcdFx0QF9pbml0YWwgPSBib29sXG5cdFx0XHRzd2l0Y2ggYm9vbFxuXHRcdFx0XHR3aGVuIHRydWUgdGhlbiBAX3NldEFjdGlvbihAX2luaXRpYWxBY3Rpb24pXG5cdFx0XHRcdHdoZW4gZmFsc2UgdGhlbiBAX3Vuc2V0QWN0aW9uKEBfaW5pdGlhbEFjdGlvbilcblxuXHQjIGVuYWJsZVxuXHRAZGVmaW5lIFwiZW5hYmxlXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9lbmFibGVkXG5cdFx0c2V0OiAoYm9vbCkgLT4gXG5cdFx0XHRyZXR1cm4gaWYgYm9vbCBpcyBAX2VuYWJsZWRcblx0XHRcdEBfZW5hYmxlZCA9IGJvb2xcblx0XHRcdEBpZ25vcmVFdmVudHMgPSAhYm9vbFxuXG5cblx0IyB0b2dnbGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHQjIGlzIG9uXG5cdEBkZWZpbmUgXCJpc09uXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF90b2dnbGVkXG5cdFx0c2V0OiAtPiByZXR1cm4gJ0FjdGlvbkxheWVyLmlzT24gaXMgcmVhZCBvbmx5LidcdFxuXG5cdCMgdG9nZ2xlT2ZmXG5cdEBkZWZpbmUgXCJ0b2dnbGVPZmZcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX3RvZ2dsZU9mZlxuXHRcdHNldDogKGFjdGlvbk9iamVjdCkgLT5cblx0XHRcdEBfdW5zZXRBY3Rpb24oQF90b2dnbGVPZmYpXG5cdFx0XHRAX29mZlRyaWdnZXIgPSBhY3Rpb25PYmplY3QudHJpZ2dlciA/IEBfb2ZmVHJpZ2dlclxuXHRcdFx0QF9vZmZBY3Rpb24gID0gYWN0aW9uT2JqZWN0LmFjdGlvbiAgPyBAX29mZkFjdGlvblxuXHRcdFx0QF90b2dnbGVPZmYgPSB7bmFtZTogJ3RvZ2dsZU9mZicsIHRyaWdnZXI6IEBfb2ZmVHJpZ2dlciwgYWN0aW9uOiAtPlxuXHRcdFx0XHRAdG9nZ2xlZCA9IGZhbHNlXG5cdFx0XHRcdH1cblxuXHRcdFx0aWYgQF90b2dnbGUgaXMgdHJ1ZSB0aGVuIEBfc2V0QWN0aW9uKEBfdG9nZ2xlT2ZmKVxuXG5cdCMgdG9nZ2xlT25cblx0QGRlZmluZSBcInRvZ2dsZU9uXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF90b2dnbGVPblxuXHRcdHNldDogKGFjdGlvbk9iamVjdCkgLT5cblx0XHRcdEBfdW5zZXRBY3Rpb24oQF90b2dnbGVPbilcblx0XHRcdEBfb25UcmlnZ2VyID0gYWN0aW9uT2JqZWN0LnRyaWdnZXIgPyBAX29uVHJpZ2dlclxuXHRcdFx0QF9vbkFjdGlvbiAgPSBhY3Rpb25PYmplY3QuYWN0aW9uICA/IEBfb25BY3Rpb25cblx0XHRcdEBfdG9nZ2xlT24gPSB7bmFtZTogJ3RvZ2dsZU9uJywgdHJpZ2dlcjogQF9vblRyaWdnZXIsIGFjdGlvbjogLT5cblx0XHRcdFx0QHRvZ2dsZWQgPSB0cnVlXG5cdFx0XHRcdH1cblxuXHRcdFx0aWYgQF90b2dnbGUgaXMgdHJ1ZSB0aGVuIEBfc2V0QWN0aW9uKEBfdG9nZ2xlT24pXG5cblx0IyB0b2dnbGVcblx0QGRlZmluZSBcInRvZ2dsZVwiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfdG9nZ2xlXG5cdFx0c2V0OiAoYm9vbCkgLT5cblx0XHRcdHJldHVybiBpZiBib29sIGlzIEBfdG9nZ2xlXG5cdFx0XHRAX3RvZ2dsZSA9IGJvb2xcblxuXHRcdFx0c3dpdGNoIEBfdG9nZ2xlXG5cdFx0XHRcdHdoZW4gdHJ1ZVxuXHRcdFx0XHRcdEBfc2V0QWN0aW9uKEBfdG9nZ2xlT24pXG5cdFx0XHRcdFx0QF9zZXRBY3Rpb24oQF90b2dnbGVPZmYpXG5cdFx0XHRcdHdoZW4gZmFsc2Vcblx0XHRcdFx0XHRAX3Vuc2V0QWN0aW9uKEBfdG9nZ2xlT24pXG5cdFx0XHRcdFx0QF91bnNldEFjdGlvbihAX3RvZ2dsZU9mZilcblxuXHQjIHRvZ2dsZWRcblx0QGRlZmluZSBcInRvZ2dsZWRcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX3RvZ2dsZWRcblx0XHRzZXQ6IChib29sKSAtPlxuXHRcdFx0IyBjYW5jZWwgaWYgdG9nZ2xpbmcgdG8gY3VycmVudCB0b2dnbGUgc3RhdGVcblx0XHRcdHN3aXRjaCBib29sXG5cdFx0XHRcdHdoZW4gdHJ1ZSBcblx0XHRcdFx0XHRyZXR1cm4gaWYgQF90b2dnbGVkIGlzIHRydWUgXG5cdFx0XHRcdFx0VXRpbHMuZGVsYXkgLjA1LCA9PiBcblx0XHRcdFx0XHRcdEBfdG9nZ2xlZCA9IHRydWVcblx0XHRcdFx0XHRcdF8uYmluZChAX29uQWN0aW9uLCBAKSgpXG5cdFx0XHRcdFx0XHRAZW1pdChcImNoYW5nZTp0b2dnbGVkXCIsIHRydWUsIEApXG5cdFx0XHRcdHdoZW4gZmFsc2Vcblx0XHRcdFx0XHRyZXR1cm4gaWYgQF90b2dnbGVkIGlzIGZhbHNlIFxuXHRcdFx0XHRcdFV0aWxzLmRlbGF5IC4wNSwgPT4gXG5cdFx0XHRcdFx0XHRAX3RvZ2dsZWQgPSBmYWxzZVxuXHRcdFx0XHRcdFx0Xy5iaW5kKEBfb2ZmQWN0aW9uLCBAKSgpXG5cdFx0XHRcdFx0XHRAZW1pdChcImNoYW5nZTp0b2dnbGVkXCIsIGZhbHNlLCBAKVxuXG5cblx0IyBhZGRpdGlvbmFsIGFjdGlvbnMgLS0tLS0tLS0tLS0tLS1cblxuXHQjIGdldCBhbGwgYWRkaXRpb25hbCBhY3Rpb25zXG5cdEBkZWZpbmUgXCJhY3Rpb25zXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9hY3Rpb25zXG5cdFx0c2V0OiAtPiB0aHJvdyAnQWN0aW9uTGF5ZXIuYWN0aW9ucyBpcyByZWFkLW9ubHkuIFVzZSAuYWRkQWN0aW9ucygpIGFuZCAucmVtb3ZlQWN0aW9ucygpIHRvIGFkZCBvciByZW1vdmUgZXhpc3RpbmcgYWN0aW9ucy4nXG5cblx0IyBhZGQgYW4gYWRkaXRpb25hbCBhY3Rpb25cblx0YWRkQWN0aW9uOiAob3B0aW9ucyA9IHt9KSAtPlxuXHRcdHRyaWdnZXIgPSBvcHRpb25zLnRyaWdnZXJcblx0XHRhY3Rpb24gPSBvcHRpb25zLmFjdGlvblxuXHRcdG5hbWUgPSBvcHRpb25zLm5hbWVcblx0XHRlbmFibGUgPSBvcHRpb25zLmVuYWJsZSA/IHRydWVcblxuXHRcdGlmICF0cmlnZ2VyPyBvciB0eXBlb2YgdHJpZ2dlciBpc250IFwic3RyaW5nXCIgdGhlbiB0aHJvdyBcIkFjdGlvbkxheWVyLmFkZEFjdGlvbiByZXF1aXJlcyBhIEZyYW1lciBFdmVudCBuYW1lIGZvcm1hdHRlZCBhcyBhIHN0cmluZywgc3VjaCBhcyAnVGFwJyBvciAnU3dpcGVFbmQnLlwiXG5cdFx0aWYgIWFjdGlvbj8gb3IgdHlwZW9mIGFjdGlvbiBpc250IFwiZnVuY3Rpb25cIiB0aGVuIHRocm93IFwiQWN0aW9uTGF5ZXIuYWRkQWN0aW9uIHJlcXVpcmVzIGEgZnVuY3Rpb24sIHN1Y2ggYXMgLT4gcHJpbnQgQG5hbWUuXCJcblxuXHRcdCMgY3JlYXRlIGFuIG9iamVjdCB1c2luZyB0aGUgcHJvdmlkZWQgYXJndW1lbnRzXG5cdFx0X2FjdGlvbiA9IHt0cmlnZ2VyOiB0cmlnZ2VyLCBuYW1lOiBuYW1lLCBhY3Rpb246IGFjdGlvbn1cblxuXHRcdCMgc3RvcCBpZiB0aGlzIGV4YWN0IGFjdGlvbiBpcyBhbHJlYWR5IG9uIHRoZSBsaXN0IG9mIGFjdGlvbnNcblx0XHRyZXR1cm4gaWYgXy5pbmNsdWRlcyhAX2FjdGlvbnMsIF9hY3Rpb24pXG5cblx0XHQjIG90aGVyd2lzZS4uLiBcblxuXHRcdEBfYWN0aW9ucy5wdXNoKF9hY3Rpb24pXHRcdCMgYWRkIHRoZSBhY3Rpb24gdG8gdGhlIGFycmF5IG9mIGFjdGlvbnNcblx0XHRcblx0XHRpZiBlbmFibGU/XHRcdFx0XHRcdCMgYW5kLCB1bmxlc3MgZW5hYmxlIGlzIHNldCB0byBmYWxzZS4uLlxuXHRcdFx0QF9zZXRBY3Rpb24oX2FjdGlvbilcdCMgZW5hYmxlIHRoZSBhY3Rpb25cblxuXHRcdHJldHVybiBfYWN0aW9uXG5cblx0IyBhZGQgbXVsdGlwbGUgYWN0aW9uc1xuXHRhZGRBY3Rpb25zOiAoYWN0aW9ucykgLT5cblx0XHRhY3Rpb25zLmZvckVhY2ggKGFjdGlvbikgPT4gQGFkZEFjdGlvbihhY3Rpb24pXG5cdFx0cmV0dXJuIGFjdGlvbnNcblxuXHQjIGdldCBhY3Rpb25zIHRoYXQgaGF2ZSBiZWVuIGFkZGVkXG5cdGdldEFjdGlvbnM6IChvcHRpb25zID0ge30pIC0+XG5cdFx0X2FjdGlvbnMgPSBAX2dldEFjdGlvbnMob3B0aW9ucylcblx0XHRyZXR1cm4gX2FjdGlvbnNcblxuXHQjIGdldCBhbiBpbmRpdmlkdWFsIGFjdGlvblxuXHRnZXRBY3Rpb246IChvcHRpb25zID0ge30pIC0+XG5cdFx0X2FjdGlvbnMgPSBAX2dldEFjdGlvbnMob3B0aW9ucylcblx0XHRyZXR1cm4gX2FjdGlvbnNbMF1cblxuXHQjIHJlbW92ZSBhY3Rpb25zIHRoYXQgaGF2ZSBiZWVuIGFkZGVkXG5cdHJlbW92ZUFjdGlvbnM6IChhY3Rpb25zKSAtPlxuXHRcdCMgZW5zdXJlIHRoYXQgYWN0aW9ucyBpcyBhbiBhcnJheSwgZXZlbiBpZiBvbmx5IGFuIG9iamVjdCBpcyBwcm92aWRlZCBcblx0XHRhY3Rpb25zID0gXy5jYXN0QXJyYXkoYWN0aW9ucylcblxuXHRcdCMgZG9uJ3QgY29udGludWUgaWYgdGhlcmUgYXJlIG5vIGFjdGlvbnMgd2l0aCB0aGF0IHRyaWdnZXJcblx0XHRyZXR1cm4gaWYgYWN0aW9ucy5sZW5ndGggaXMgMFxuXG5cdFx0IyBmb3IgZWFjaCBvZiB0aGVzZSBhY3Rpb25zLCByZW1vdmUgdGhlIGV2ZW50IGxpc3RlbmVyIGFuZCBwdWxsIGZyb20gX2FjdGlvbnNcblx0XHRhY3Rpb25zLmZvckVhY2ggKGFjdGlvbikgPT4gQHJlbW92ZUFjdGlvbihhY3Rpb24pXG5cblx0IyByZW1vdmUgYW4gaW5kaXZpZHVhbCBhY3Rpb25cblx0cmVtb3ZlQWN0aW9uOiAoYWN0aW9uKSAtPlxuXHRcdEBfdW5zZXRBY3Rpb24oYWN0aW9uKVxuXHRcdF8ucHVsbChAX2FjdGlvbiwgYWN0aW9ucylcblxuXHQjIGVuYWJsZSBhY3Rpb25zIHRoYXQgaGF2ZSBiZWVuIGFkZGVkXG5cdGVuYWJsZUFjdGlvbnM6IChhY3Rpb25zKSAtPlxuXHRcdCMgZW5zdXJlIHRoYXQgYWN0aW9ucyBpcyBhbiBhcnJheSwgZXZlbiBpZiBvbmx5IGFuIG9iamVjdCBpcyBwcm92aWRlZCBcblx0XHRhY3Rpb25zID0gXy5jYXN0QXJyYXkoYWN0aW9ucylcblxuXHRcdCMgZG9uJ3QgY29udGludWUgaWYgdGhlcmUgYXJlIG5vIGFjdGlvbnMgd2l0aCB0aGF0IHRyaWdnZXJcblx0XHRyZXR1cm4gaWYgYWN0aW9ucy5sZW5ndGggaXMgMFxuXG5cdFx0IyBmb3IgZWFjaCBvZiB0aGVzZSBhY3Rpb25zLCBhZGQgdGhlIGV2ZW50IGxpc3RlbmVyXG5cdFx0YWN0aW9ucy5mb3JFYWNoIChhY3Rpb24pID0+IEBlbmFibGVBY3Rpb24oYWN0aW9uKVxuXG5cdCMgZW5hYmxlIGFuIGluZGl2aWR1YWwgYWN0aW9uXG5cdGVuYWJsZUFjdGlvbjogKGFjdGlvbikgLT5cblx0XHRAX3NldEFjdGlvbihhY3Rpb24pXG5cblx0IyBkaXNhYmxlIGFjdGlvbnMgdGhhdCBoYXZlIGJlZW4gYWRkZWQgLyBlbmFibGVkXG5cdGRpc2FibGVBY3Rpb25zOiAoYWN0aW9ucykgLT5cblx0XHQjIGVuc3VyZSB0aGF0IGFjdGlvbnMgaXMgYW4gYXJyYXksIGV2ZW4gaWYgb25seSBhbiBvYmplY3QgaXMgcHJvdmlkZWQgXG5cdFx0YWN0aW9ucyA9IF8uY2FzdEFycmF5KGFjdGlvbnMpXG5cblx0XHQjIGRvbid0IGNvbnRpbnVlIGlmIHRoZXJlIGFyZSBubyBhY3Rpb25zIHdpdGggdGhhdCB0cmlnZ2VyXG5cdFx0cmV0dXJuIGlmIGFjdGlvbnMubGVuZ3RoIGlzIDBcblxuXHRcdCMgZm9yIGVhY2ggb2YgdGhlc2UgYWN0aW9ucywgcmVtb3ZlIHRoZSBldmVudCBsaXN0ZW5lclxuXHRcdGFjdGlvbnMuZm9yRWFjaCAoYWN0aW9uKSA9PiBAZGlzYWJsZUFjdGlvbihhY3Rpb24pXG5cblx0IyBkaXNhYmxlIGFuIGluZGl2aWRhbCBhY3Rpb25cblx0ZGlzYWJsZUFjdGlvbjogKGFjdGlvbikgLT5cblx0XHRAX3Vuc2V0QWN0aW9uKGFjdGlvbilcblxuXG5cdCMgcHJpdmF0ZSBmdW5jdGlvbnMgLS0tLS0tLS0tLS0tLS0tXG5cblx0IyByZXR1cm5zIGFsbCBhY3Rpb25zIGdpdmVuIG5hbWUgb3IgdHJpZ2dlclxuXHRfZ2V0QWN0aW9uczogKGFjdGlvbk9iamVjdCkgLT5cblx0XHR0cmlnZ2VyID0gYWN0aW9uT2JqZWN0LnRyaWdnZXJcblx0XHRuYW1lID0gYWN0aW9uT2JqZWN0Lm5hbWVcblxuXHRcdGlmIHRyaWdnZXI/IGFuZCB0eXBlb2YgdHJpZ2dlciBpc250IFwic3RyaW5nXCIgdGhlbiB0aHJvdyBcIkFjdGlvbkxheWVyLmFkZEFjdGlvbiByZXF1aXJlcyBhIHRyaWdnZXIgYSBzdHJpbmcsIHN1Y2ggYXMgJ1RhcCcgb3IgJ1N3aXBlRW5kJy5cIlxuXHRcdGlmIG5hbWU/IGFuZCB0eXBlb2YgbmFtZSBpc250IFwic3RyaW5nXCIgdGhlbiB0aHJvdyBcIkFjdGlvbkxheWVyLmFkZEFjdGlvbiByZXF1aXJlcyBhIG5hbWUgYXMgYSBzdHJpbmcsIHN1Y2ggYXMgJ2dyZWV0JyBvciAnYmxpbmsnLlwiXG5cblx0XHQjIGdldCBhbGwgYWN0aW9ucyB0byByZW1vdmVcblx0XHRfYWN0aW9ucyA9IFxuXHRcdFx0IyBpZiBhY3Rpb24gcHJvdmlkZWQsIGdldCB0aGUgc3RvcmVkIGFjdGlvbiB0aGF0IGhhcyBib3RoIHRoZSB0cmlnZ2VyIGFuZCBhY3Rpb25cblx0XHRcdGlmIHRyaWdnZXI/IGFuZCBuYW1lPyB0aGVuIF8uZmlsdGVyKEBfYWN0aW9ucywgeyd0cmlnZ2VyJzogdHJpZ2dlciwgJ25hbWUnOiBuYW1lfSlcblx0XHRcdGVsc2UgaWYgbmFtZT8gdGhlbiBfLmZpbHRlcihAX2FjdGlvbnMsIHsnbmFtZSc6IG5hbWV9KVxuXHRcdFx0ZWxzZSBpZiB0cmlnZ2VyPyB0aGVuIF8uZmlsdGVyKEBfYWN0aW9ucywgeyd0cmlnZ2VyJzogdHJpZ2dlcn0pXG5cdFx0XHRlbHNlIHRocm93IFwiQWN0aW9uTGF5ZXIucmVtb3ZlQWN0aW9uIHJlcXVpcmVzIGVpdGhlciB0aGUgYWN0aW9uJ3MgdHJpZ2dlciBvciBpdHMgbmFtZS5cIlxuXG5cdFx0cmV0dXJuIF9hY3Rpb25zXG5cblx0IyBlbmFibGVzIGFuIGFjdGlvbiAoYWRkcyB0aGUgbGlzdGVuZXIpXG5cdF9zZXRBY3Rpb246IChhY3Rpb25PYmplY3QpIC0+XG5cdFx0dHJpZ2dlciA9IGFjdGlvbk9iamVjdC50cmlnZ2VyXG5cdFx0YWN0aW9uID0gYWN0aW9uT2JqZWN0LmFjdGlvblxuXHRcdEBvbiBFdmVudHNbdHJpZ2dlcl0sIGFjdGlvblxuXG5cdCMgZGlzYWJsZXMgYW4gYWN0aW9uIChyZW1vdmVzIHRoZSBsaXN0ZW5lcilcblx0X3Vuc2V0QWN0aW9uOiAoYWN0aW9uT2JqZWN0KSAtPlxuXHRcdHRyaWdnZXIgPSBhY3Rpb25PYmplY3QudHJpZ2dlclxuXHRcdGFjdGlvbiA9IGFjdGlvbk9iamVjdC5hY3Rpb25cblx0XHRAb2ZmIEV2ZW50c1t0cmlnZ2VyXSwgYWN0aW9uXG5cbmNsYXNzIEFjdGlvblRleHRMYXllciBleHRlbmRzIFRleHRMYXllclxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMgPSB7fSkgLT5cblxuXHRcdCMgc2V0IGdlbmVyYWwgb3B0aW9uc1xuXHRcdEBfYWN0aW9ucyA9IFtdXG5cdFx0QF90b2dnbGUgPSBmYWxzZVxuXHRcdEBfdG9nZ2xlZCA9IGZhbHNlXG5cblx0XHQjIGRlZmluZSBpbml0aWFsIGFjdGlvbiBvYmplY3Rcblx0XHRAX3RyaWdnZXIgPSBvcHRpb25zLnRyaWdnZXIgPyAnVGFwJ1xuXHRcdEBfYWN0aW9uID0gb3B0aW9ucy5hY3Rpb24gPyAtPlxuXHRcdFx0QGJsaW5rVXAgPSBuZXcgQW5pbWF0aW9uIEAsIHticmlnaHRuZXNzOiAxNTAsIG9wdGlvbnM6e3RpbWU6IC4xNX19XG5cdFx0XHRAYmxpbmtVcC5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCAtPiBAcmVzZXQoKVxuXHRcdFx0QGJsaW5rVXAuc3RhcnQoKVxuXHRcdEBfaW5pdGlhbEFjdGlvbiA9IHtuYW1lOiAnaW5pdGlhbEFjdGlvbicsIHRyaWdnZXI6IEBfdHJpZ2dlciwgYWN0aW9uOiBfLmJpbmQoQF9hY3Rpb24sIEApLCBlbmFibGU6IHRydWV9XG5cblx0XHQjIGRlZmluZSB0b2dnbGVPbiBhY3Rpb24gb2JqZWN0XG5cdFx0QF9vblRyaWdnZXIgPSBvcHRpb25zLnRvZ2dsZU9uPy50cmlnZ2VyID8gQF90cmlnZ2VyID8gJ01vdXNlT3Zlcidcblx0XHRAX29uQWN0aW9uID0gXHRvcHRpb25zLnRvZ2dsZU9uPy5hY3Rpb24gPyAtPiBAYW5pbWF0ZSB7b3BhY2l0eTogLjYsIG9wdGlvbnM6IHt0aW1lOiAuMTV9fVxuXHRcdEBfdG9nZ2xlT24gPSB7bmFtZTogJ3RvZ2dsZU9uJywgdHJpZ2dlcjogQF9vblRyaWdnZXIsIGVuYWJsZTogdHJ1ZSwgYWN0aW9uOiAtPlxuXHRcdFx0QHRvZ2dsZWQgPSB0cnVlXG5cdFx0XHR9XG5cblx0XHQjIGRlZmluZSB0b2dnbGVPZmYgYWN0aW9uIG9iamVjdFxuXHRcdEBfb2ZmVHJpZ2dlciA9IG9wdGlvbnMudG9nZ2xlT2ZmPy50cmlnZ2VyID8gQF90cmlnZ2VyID8gJ01vdXNlT3V0J1xuXHRcdEBfb2ZmQWN0aW9uID0gIG9wdGlvbnMudG9nZ2xlT2ZmPy5hY3Rpb24gPyAtPiBAYW5pbWF0ZSB7b3BhY2l0eTogMSwgb3B0aW9uczoge3RpbWU6IC4xNX19XG5cdFx0QF90b2dnbGVPZmYgPSB7bmFtZTogJ3RvZ2dsZU9mZicsIHRyaWdnZXI6IEBfb2ZmVHJpZ2dlciwgZW5hYmxlOiB0cnVlLCBhY3Rpb246IC0+XG5cdFx0XHRAdG9nZ2xlZCA9IGZhbHNlXG5cdFx0XHR9XG5cblxuXHRcdCMgc2V0IG9wdGlvbnMgZnJvbSBvcHRpb25zIG9iamVjdFxuXHRcdHN1cGVyIF8uZGVmYXVsdHMgb3B0aW9uc1xuXG5cdFx0XG5cdFx0IyBzZXQgaW5pdGlhbCAoaWYgdHJ1ZSwgc2V0IGluaXRpYWwgYWN0aW9uKVxuXHRcdEBpbml0aWFsID0gb3B0aW9ucy5pbml0aWFsID8gdHJ1ZVxuXG5cdFx0IyBzZXQgdG9nZ2xlIChpZiB0cnVlLCBzZXQgdG9nZ2xlIGFjdGlvbnMpXG5cdFx0QF90b2dnbGUgPSBvcHRpb25zLnRvZ2dsZSA/IGZhbHNlXG5cblx0XHQjIHNldCB3aGV0aGVyIHRvIGVuYWJsZSBldmVudHMgKGlmIGZhbHNlLCBzZXQgaWdub3JlIGV2ZW50cylcblx0XHRAZW5hYmxlID0gb3B0aW9ucy5lbmFibGUgPyB0cnVlXG5cblxuXHQjIGluaXRpYWwgYWN0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdCMgc2V0IHRoZSBpbml0aWFsIGFjdGlvbidzIHRyaWdnZXJcblx0QGRlZmluZSBcInRyaWdnZXJcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX2luaXRpYWxBY3Rpb24udHJpZ2dlciA/IHVuZGVmaW5lZFxuXHRcdHNldDogKHRyaWdnZXIpIC0+XG5cdFx0XHR0aHJvdyBcIkFjdGlvbkxheWVyOiB0cmlnZ2VyIG11c3Qgc2V0IHdpdGggYSBGcmFtZXIgRXZlbnQgbmFtZSBmb3JtYXR0ZWQgYXMgYSBzdHJpbmcsIGxpa2UgJ1RhcCcgb3IgJ1N3aXBlRG93bicuXCIgaWYgdHlwZW9mIHRyaWdnZXIgaXNudCBcInN0cmluZ1wiXG5cdFx0XHRcblx0XHRcdCMgcmVtb3ZlIGluaXRpYWwgYWN0aW9uXG5cdFx0XHRAcmVtb3ZlQWN0aW9uKEBfaW5pdGlhbEFjdGlvbilcblxuXHRcdFx0IyBjaGFuZ2UgdHJpZ2dlclxuXHRcdFx0QF9pbml0aWFsQWN0aW9uLnRyaWdnZXIgPSB0cmlnZ2VyXG5cblx0XHRcdGlmIEBfZW5hYmxlZCBpcyB0cnVlIHRoZW4gQF9zZXRBY3Rpb24oQF9pbml0aWFsQWN0aW9uKVxuXG5cdCMgZGVmaW5lIHRoZSBpbml0aWFsIGFjdGlvbidzIGFjdGlvblxuXHRAZGVmaW5lIFwiYWN0aW9uXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9pbml0aWFsQWN0aW9uLmFjdGlvbiA/IHVuZGVmaW5lZFxuXHRcdHNldDogKGFjdGlvbikgLT5cblx0XHRcdHRocm93IFwiQWN0aW9uTGF5ZXI6IHRyaWdnZXIgbXVzdCBzZXQgd2l0aCBhIGZ1bmN0aW9uLCBsaWtlICctPiBwcmludCAnSGVsbG8gd29ybGQnLlwiIGlmIHR5cGVvZiBhY3Rpb24gaXNudCBcImZ1bmN0aW9uXCJcblx0XHRcdFxuXHRcdFx0IyByZW1vdmUgaW5pdGlhbCBhY3Rpb25cblx0XHRcdEByZW1vdmVBY3Rpb24oQF9pbml0aWFsQWN0aW9uKVxuXG5cdFx0XHQjIGNoYW5nZSB0cmlnZ2VyXG5cdFx0XHRAX2luaXRpYWxBY3Rpb24uYWN0aW9uID0gYWN0aW9uXG5cblx0XHRcdGlmIEBfZW5hYmxlZCBpcyB0cnVlIHRoZW4gQF9zZXRBY3Rpb24oQF9pbml0aWFsQWN0aW9uKVxuXG5cdCMgZW5hYmxlXG5cdEBkZWZpbmUgXCJpbml0aWFsXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9pbml0aWFsXG5cdFx0c2V0OiAoYm9vbCkgLT4gXG5cdFx0XHRyZXR1cm4gaWYgYm9vbCBpcyBAX2luaXRpYWxcblx0XHRcdEBfaW5pdGFsID0gYm9vbFxuXHRcdFx0c3dpdGNoIGJvb2xcblx0XHRcdFx0d2hlbiB0cnVlIHRoZW4gQF9zZXRBY3Rpb24oQF9pbml0aWFsQWN0aW9uKVxuXHRcdFx0XHR3aGVuIGZhbHNlIHRoZW4gQF91bnNldEFjdGlvbihAX2luaXRpYWxBY3Rpb24pXG5cblx0IyBlbmFibGVcblx0QGRlZmluZSBcImVuYWJsZVwiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfZW5hYmxlZFxuXHRcdHNldDogKGJvb2wpIC0+IFxuXHRcdFx0cmV0dXJuIGlmIGJvb2wgaXMgQF9lbmFibGVkXG5cdFx0XHRAX2VuYWJsZWQgPSBib29sXG5cdFx0XHRAaWdub3JlRXZlbnRzID0gIWJvb2xcblxuXG5cdCMgdG9nZ2xlIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0IyBpcyBvblxuXHRAZGVmaW5lIFwiaXNPblwiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfdG9nZ2xlZFxuXHRcdHNldDogLT4gcmV0dXJuICdBY3Rpb25MYXllci5pc09uIGlzIHJlYWQgb25seS4nXHRcblxuXHQjIHRvZ2dsZU9mZlxuXHRAZGVmaW5lIFwidG9nZ2xlT2ZmXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF90b2dnbGVPZmZcblx0XHRzZXQ6IChhY3Rpb25PYmplY3QpIC0+XG5cdFx0XHRAX3Vuc2V0QWN0aW9uKEBfdG9nZ2xlT2ZmKVxuXHRcdFx0QF9vZmZUcmlnZ2VyID0gYWN0aW9uT2JqZWN0LnRyaWdnZXIgPyBAX29mZlRyaWdnZXJcblx0XHRcdEBfb2ZmQWN0aW9uICA9IGFjdGlvbk9iamVjdC5hY3Rpb24gID8gQF9vZmZBY3Rpb25cblx0XHRcdEBfdG9nZ2xlT2ZmID0ge25hbWU6ICd0b2dnbGVPZmYnLCB0cmlnZ2VyOiBAX29mZlRyaWdnZXIsIGFjdGlvbjogLT5cblx0XHRcdFx0QHRvZ2dsZWQgPSBmYWxzZVxuXHRcdFx0XHR9XG5cblx0XHRcdGlmIEBfdG9nZ2xlIGlzIHRydWUgdGhlbiBAX3NldEFjdGlvbihAX3RvZ2dsZU9mZilcblxuXHQjIHRvZ2dsZU9uXG5cdEBkZWZpbmUgXCJ0b2dnbGVPblwiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfdG9nZ2xlT25cblx0XHRzZXQ6IChhY3Rpb25PYmplY3QpIC0+XG5cdFx0XHRAX3Vuc2V0QWN0aW9uKEBfdG9nZ2xlT24pXG5cdFx0XHRAX29uVHJpZ2dlciA9IGFjdGlvbk9iamVjdC50cmlnZ2VyID8gQF9vblRyaWdnZXJcblx0XHRcdEBfb25BY3Rpb24gID0gYWN0aW9uT2JqZWN0LmFjdGlvbiAgPyBAX29uQWN0aW9uXG5cdFx0XHRAX3RvZ2dsZU9uID0ge25hbWU6ICd0b2dnbGVPbicsIHRyaWdnZXI6IEBfb25UcmlnZ2VyLCBhY3Rpb246IC0+XG5cdFx0XHRcdEB0b2dnbGVkID0gdHJ1ZVxuXHRcdFx0XHR9XG5cblx0XHRcdGlmIEBfdG9nZ2xlIGlzIHRydWUgdGhlbiBAX3NldEFjdGlvbihAX3RvZ2dsZU9uKVxuXG5cdCMgdG9nZ2xlXG5cdEBkZWZpbmUgXCJ0b2dnbGVcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX3RvZ2dsZVxuXHRcdHNldDogKGJvb2wpIC0+XG5cdFx0XHRyZXR1cm4gaWYgYm9vbCBpcyBAX3RvZ2dsZVxuXHRcdFx0QF90b2dnbGUgPSBib29sXG5cblx0XHRcdHN3aXRjaCBAX3RvZ2dsZVxuXHRcdFx0XHR3aGVuIHRydWVcblx0XHRcdFx0XHRAX3NldEFjdGlvbihAX3RvZ2dsZU9uKVxuXHRcdFx0XHRcdEBfc2V0QWN0aW9uKEBfdG9nZ2xlT2ZmKVxuXHRcdFx0XHR3aGVuIGZhbHNlXG5cdFx0XHRcdFx0QF91bnNldEFjdGlvbihAX3RvZ2dsZU9uKVxuXHRcdFx0XHRcdEBfdW5zZXRBY3Rpb24oQF90b2dnbGVPZmYpXG5cblx0IyB0b2dnbGVkXG5cdEBkZWZpbmUgXCJ0b2dnbGVkXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF90b2dnbGVkXG5cdFx0c2V0OiAoYm9vbCkgLT5cblx0XHRcdCMgY2FuY2VsIGlmIHRvZ2dsaW5nIHRvIGN1cnJlbnQgdG9nZ2xlIHN0YXRlXG5cdFx0XHRzd2l0Y2ggYm9vbFxuXHRcdFx0XHR3aGVuIHRydWUgXG5cdFx0XHRcdFx0cmV0dXJuIGlmIEBfdG9nZ2xlZCBpcyB0cnVlIFxuXHRcdFx0XHRcdFV0aWxzLmRlbGF5IC4wNSwgPT4gXG5cdFx0XHRcdFx0XHRAX3RvZ2dsZWQgPSB0cnVlXG5cdFx0XHRcdFx0XHRfLmJpbmQoQF9vbkFjdGlvbiwgQCkoKVxuXHRcdFx0XHRcdFx0QGVtaXQoXCJjaGFuZ2U6dG9nZ2xlZFwiLCB0cnVlKVxuXHRcdFx0XHR3aGVuIGZhbHNlXG5cdFx0XHRcdFx0cmV0dXJuIGlmIEBfdG9nZ2xlZCBpcyBmYWxzZSBcblx0XHRcdFx0XHRVdGlscy5kZWxheSAuMDUsID0+IFxuXHRcdFx0XHRcdFx0QF90b2dnbGVkID0gZmFsc2Vcblx0XHRcdFx0XHRcdF8uYmluZChAX29mZkFjdGlvbiwgQCkoKVxuXHRcdFx0XHRcdFx0QGVtaXQoXCJjaGFuZ2U6dG9nZ2xlZFwiLCBmYWxzZSlcblxuXG5cdCMgYWRkaXRpb25hbCBhY3Rpb25zIC0tLS0tLS0tLS0tLS0tXG5cblx0IyBnZXQgYWxsIGFkZGl0aW9uYWwgYWN0aW9uc1xuXHRAZGVmaW5lIFwiYWN0aW9uc1wiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfYWN0aW9uc1xuXHRcdHNldDogLT4gdGhyb3cgJ0FjdGlvbkxheWVyLmFjdGlvbnMgaXMgcmVhZC1vbmx5LiBVc2UgLmFkZEFjdGlvbnMoKSBhbmQgLnJlbW92ZUFjdGlvbnMoKSB0byBhZGQgb3IgcmVtb3ZlIGV4aXN0aW5nIGFjdGlvbnMuJ1xuXG5cdCMgYWRkIGFuIGFkZGl0aW9uYWwgYWN0aW9uXG5cdGFkZEFjdGlvbjogKG9wdGlvbnMgPSB7fSkgLT5cblx0XHR0cmlnZ2VyID0gb3B0aW9ucy50cmlnZ2VyXG5cdFx0YWN0aW9uID0gb3B0aW9ucy5hY3Rpb25cblx0XHRuYW1lID0gb3B0aW9ucy5uYW1lXG5cdFx0ZW5hYmxlID0gb3B0aW9ucy5lbmFibGUgPyB0cnVlXG5cblx0XHRpZiAhdHJpZ2dlcj8gb3IgdHlwZW9mIHRyaWdnZXIgaXNudCBcInN0cmluZ1wiIHRoZW4gdGhyb3cgXCJBY3Rpb25MYXllci5hZGRBY3Rpb24gcmVxdWlyZXMgYSBGcmFtZXIgRXZlbnQgbmFtZSBmb3JtYXR0ZWQgYXMgYSBzdHJpbmcsIHN1Y2ggYXMgJ1RhcCcgb3IgJ1N3aXBlRW5kJy5cIlxuXHRcdGlmICFhY3Rpb24/IG9yIHR5cGVvZiBhY3Rpb24gaXNudCBcImZ1bmN0aW9uXCIgdGhlbiB0aHJvdyBcIkFjdGlvbkxheWVyLmFkZEFjdGlvbiByZXF1aXJlcyBhIGZ1bmN0aW9uLCBzdWNoIGFzIC0+IHByaW50IEBuYW1lLlwiXG5cblx0XHQjIGNyZWF0ZSBhbiBvYmplY3QgdXNpbmcgdGhlIHByb3ZpZGVkIGFyZ3VtZW50c1xuXHRcdF9hY3Rpb24gPSB7dHJpZ2dlcjogdHJpZ2dlciwgbmFtZTogbmFtZSwgYWN0aW9uOiBhY3Rpb259XG5cblx0XHQjIHN0b3AgaWYgdGhpcyBleGFjdCBhY3Rpb24gaXMgYWxyZWFkeSBvbiB0aGUgbGlzdCBvZiBhY3Rpb25zXG5cdFx0cmV0dXJuIGlmIF8uaW5jbHVkZXMoQF9hY3Rpb25zLCBfYWN0aW9uKVxuXG5cdFx0IyBvdGhlcndpc2UuLi4gXG5cblx0XHRAX2FjdGlvbnMucHVzaChfYWN0aW9uKVx0XHQjIGFkZCB0aGUgYWN0aW9uIHRvIHRoZSBhcnJheSBvZiBhY3Rpb25zXG5cdFx0XG5cdFx0aWYgZW5hYmxlP1x0XHRcdFx0XHQjIGFuZCwgdW5sZXNzIGVuYWJsZSBpcyBzZXQgdG8gZmFsc2UuLi5cblx0XHRcdEBfc2V0QWN0aW9uKF9hY3Rpb24pXHQjIGVuYWJsZSB0aGUgYWN0aW9uXG5cblx0XHRyZXR1cm4gX2FjdGlvblxuXG5cdCMgYWRkIG11bHRpcGxlIGFjdGlvbnNcblx0YWRkQWN0aW9uczogKGFjdGlvbnMpIC0+XG5cdFx0YWN0aW9ucy5mb3JFYWNoIChhY3Rpb24pID0+IEBhZGRBY3Rpb24oYWN0aW9uKVxuXHRcdHJldHVybiBhY3Rpb25zXG5cblx0IyBnZXQgYWN0aW9ucyB0aGF0IGhhdmUgYmVlbiBhZGRlZFxuXHRnZXRBY3Rpb25zOiAob3B0aW9ucyA9IHt9KSAtPlxuXHRcdF9hY3Rpb25zID0gQF9nZXRBY3Rpb25zKG9wdGlvbnMpXG5cdFx0cmV0dXJuIF9hY3Rpb25zXG5cblx0IyBnZXQgYW4gaW5kaXZpZHVhbCBhY3Rpb25cblx0Z2V0QWN0aW9uOiAob3B0aW9ucyA9IHt9KSAtPlxuXHRcdF9hY3Rpb25zID0gQF9nZXRBY3Rpb25zKG9wdGlvbnMpXG5cdFx0cmV0dXJuIF9hY3Rpb25zWzBdXG5cblx0IyByZW1vdmUgYWN0aW9ucyB0aGF0IGhhdmUgYmVlbiBhZGRlZFxuXHRyZW1vdmVBY3Rpb25zOiAoYWN0aW9ucykgLT5cblx0XHQjIGVuc3VyZSB0aGF0IGFjdGlvbnMgaXMgYW4gYXJyYXksIGV2ZW4gaWYgb25seSBhbiBvYmplY3QgaXMgcHJvdmlkZWQgXG5cdFx0YWN0aW9ucyA9IF8uY2FzdEFycmF5KGFjdGlvbnMpXG5cblx0XHQjIGRvbid0IGNvbnRpbnVlIGlmIHRoZXJlIGFyZSBubyBhY3Rpb25zIHdpdGggdGhhdCB0cmlnZ2VyXG5cdFx0cmV0dXJuIGlmIGFjdGlvbnMubGVuZ3RoIGlzIDBcblxuXHRcdCMgZm9yIGVhY2ggb2YgdGhlc2UgYWN0aW9ucywgcmVtb3ZlIHRoZSBldmVudCBsaXN0ZW5lciBhbmQgcHVsbCBmcm9tIF9hY3Rpb25zXG5cdFx0YWN0aW9ucy5mb3JFYWNoIChhY3Rpb24pID0+IEByZW1vdmVBY3Rpb24oYWN0aW9uKVxuXG5cdCMgcmVtb3ZlIGFuIGluZGl2aWR1YWwgYWN0aW9uXG5cdHJlbW92ZUFjdGlvbjogKGFjdGlvbikgLT5cblx0XHRAX3Vuc2V0QWN0aW9uKGFjdGlvbilcblx0XHRfLnB1bGwoQF9hY3Rpb25zLCBhY3Rpb24pXG5cblx0IyBlbmFibGUgYWN0aW9ucyB0aGF0IGhhdmUgYmVlbiBhZGRlZFxuXHRlbmFibGVBY3Rpb25zOiAoYWN0aW9ucykgLT5cblx0XHQjIGVuc3VyZSB0aGF0IGFjdGlvbnMgaXMgYW4gYXJyYXksIGV2ZW4gaWYgb25seSBhbiBvYmplY3QgaXMgcHJvdmlkZWQgXG5cdFx0YWN0aW9ucyA9IF8uY2FzdEFycmF5KGFjdGlvbnMpXG5cblx0XHQjIGRvbid0IGNvbnRpbnVlIGlmIHRoZXJlIGFyZSBubyBhY3Rpb25zIHdpdGggdGhhdCB0cmlnZ2VyXG5cdFx0cmV0dXJuIGlmIGFjdGlvbnMubGVuZ3RoIGlzIDBcblxuXHRcdCMgZm9yIGVhY2ggb2YgdGhlc2UgYWN0aW9ucywgYWRkIHRoZSBldmVudCBsaXN0ZW5lclxuXHRcdGFjdGlvbnMuZm9yRWFjaCAoYWN0aW9uKSA9PiBAZW5hYmxlQWN0aW9uKGFjdGlvbilcblxuXHQjIGVuYWJsZSBhbiBpbmRpdmlkdWFsIGFjdGlvblxuXHRlbmFibGVBY3Rpb246IChhY3Rpb24pIC0+XG5cdFx0QF9zZXRBY3Rpb24oYWN0aW9uKVxuXG5cdCMgZGlzYWJsZSBhY3Rpb25zIHRoYXQgaGF2ZSBiZWVuIGFkZGVkIC8gZW5hYmxlZFxuXHRkaXNhYmxlQWN0aW9uczogKGFjdGlvbnMpIC0+XG5cdFx0IyBlbnN1cmUgdGhhdCBhY3Rpb25zIGlzIGFuIGFycmF5LCBldmVuIGlmIG9ubHkgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIFxuXHRcdGFjdGlvbnMgPSBfLmNhc3RBcnJheShhY3Rpb25zKVxuXG5cdFx0IyBkb24ndCBjb250aW51ZSBpZiB0aGVyZSBhcmUgbm8gYWN0aW9ucyB3aXRoIHRoYXQgdHJpZ2dlclxuXHRcdHJldHVybiBpZiBhY3Rpb25zLmxlbmd0aCBpcyAwXG5cblx0XHQjIGZvciBlYWNoIG9mIHRoZXNlIGFjdGlvbnMsIHJlbW92ZSB0aGUgZXZlbnQgbGlzdGVuZXJcblx0XHRhY3Rpb25zLmZvckVhY2ggKGFjdGlvbikgPT4gQGRpc2FibGVBY3Rpb24oYWN0aW9uKVxuXG5cdCMgZGlzYWJsZSBhbiBpbmRpdmlkYWwgYWN0aW9uXG5cdGRpc2FibGVBY3Rpb246IChhY3Rpb24pIC0+XG5cdFx0QF91bnNldEFjdGlvbihhY3Rpb24pXG5cblxuXHQjIHByaXZhdGUgZnVuY3Rpb25zIC0tLS0tLS0tLS0tLS0tLVxuXG5cdCMgcmV0dXJucyBhbGwgYWN0aW9ucyBnaXZlbiBuYW1lIG9yIHRyaWdnZXJcblx0X2dldEFjdGlvbnM6IChhY3Rpb25PYmplY3QpIC0+XG5cdFx0dHJpZ2dlciA9IGFjdGlvbk9iamVjdC50cmlnZ2VyXG5cdFx0bmFtZSA9IGFjdGlvbk9iamVjdC5uYW1lXG5cblx0XHRpZiB0cmlnZ2VyPyBhbmQgdHlwZW9mIHRyaWdnZXIgaXNudCBcInN0cmluZ1wiIHRoZW4gdGhyb3cgXCJBY3Rpb25MYXllci5hZGRBY3Rpb24gcmVxdWlyZXMgYSB0cmlnZ2VyIGEgc3RyaW5nLCBzdWNoIGFzICdUYXAnIG9yICdTd2lwZUVuZCcuXCJcblx0XHRpZiBuYW1lPyBhbmQgdHlwZW9mIG5hbWUgaXNudCBcInN0cmluZ1wiIHRoZW4gdGhyb3cgXCJBY3Rpb25MYXllci5hZGRBY3Rpb24gcmVxdWlyZXMgYSBuYW1lIGFzIGEgc3RyaW5nLCBzdWNoIGFzICdncmVldCcgb3IgJ2JsaW5rJy5cIlxuXG5cdFx0IyBnZXQgYWxsIGFjdGlvbnMgdG8gcmVtb3ZlXG5cdFx0X2FjdGlvbnMgPSBcblx0XHRcdCMgaWYgYWN0aW9uIHByb3ZpZGVkLCBnZXQgdGhlIHN0b3JlZCBhY3Rpb24gdGhhdCBoYXMgYm90aCB0aGUgdHJpZ2dlciBhbmQgYWN0aW9uXG5cdFx0XHRpZiB0cmlnZ2VyPyBhbmQgbmFtZT8gdGhlbiBfLmZpbHRlcihAX2FjdGlvbnMsIHsndHJpZ2dlcic6IHRyaWdnZXIsICduYW1lJzogbmFtZX0pXG5cdFx0XHRlbHNlIGlmIG5hbWU/IHRoZW4gXy5maWx0ZXIoQF9hY3Rpb25zLCB7J25hbWUnOiBuYW1lfSlcblx0XHRcdGVsc2UgaWYgdHJpZ2dlcj8gdGhlbiBfLmZpbHRlcihAX2FjdGlvbnMsIHsndHJpZ2dlcic6IHRyaWdnZXJ9KVxuXHRcdFx0ZWxzZSB0aHJvdyBcIkFjdGlvbkxheWVyLnJlbW92ZUFjdGlvbiByZXF1aXJlcyBlaXRoZXIgdGhlIGFjdGlvbidzIHRyaWdnZXIgb3IgaXRzIG5hbWUuXCJcblxuXHRcdHJldHVybiBfYWN0aW9uc1xuXG5cdCMgZW5hYmxlcyBhbiBhY3Rpb24gKGFkZHMgdGhlIGxpc3RlbmVyKVxuXHRfc2V0QWN0aW9uOiAoYWN0aW9uT2JqZWN0KSAtPlxuXHRcdHRyaWdnZXIgPSBhY3Rpb25PYmplY3QudHJpZ2dlclxuXHRcdGFjdGlvbiA9IGFjdGlvbk9iamVjdC5hY3Rpb25cblx0XHRAb24gRXZlbnRzW3RyaWdnZXJdLCBhY3Rpb25cblxuXHQjIGRpc2FibGVzIGFuIGFjdGlvbiAocmVtb3ZlcyB0aGUgbGlzdGVuZXIpXG5cdF91bnNldEFjdGlvbjogKGFjdGlvbk9iamVjdCkgLT5cblx0XHR0cmlnZ2VyID0gYWN0aW9uT2JqZWN0LnRyaWdnZXJcblx0XHRhY3Rpb24gPSBhY3Rpb25PYmplY3QuYWN0aW9uXG5cdFx0QG9mZiBFdmVudHNbdHJpZ2dlcl0sIGFjdGlvblxuXG5cblxuXG5leHBvcnRzLkFjdGlvbiA9IEFjdGlvblxuZXhwb3J0cy5BY3Rpb25MYXllciA9IEFjdGlvbkxheWVyXG5leHBvcnRzLkFjdGlvblRleHRMYXllcj0gQWN0aW9uVGV4dExheWVyXG5cblxuXG5cblxuXG5cbiIsIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBRUFBO0FERUEsSUFBQSxvQ0FBQTtFQUFBOzs7QUFBTTtFQUNRLGdCQUFDLE9BQUQ7QUFDWixRQUFBOztNQURhLFVBQVU7O0lBQ3ZCLElBQUMsQ0FBQSxJQUFELHdDQUF1QixRQUFBLEdBQVEsQ0FBQyxDQUFDLENBQUMsTUFBRixDQUFTLElBQVQsQ0FBRDtJQUMvQixJQUFDLENBQUEsT0FBRDs7OztBQUE2QixjQUFNOzs7SUFDbkMsSUFBQyxDQUFBLE1BQUQ7Ozs7QUFBMkIsY0FBTTs7O0lBQ2pDLElBQUMsQ0FBQSxPQUFELDZDQUE2QjtFQUpqQjs7Ozs7O0FBTVI7OztFQUNRLHFCQUFD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
