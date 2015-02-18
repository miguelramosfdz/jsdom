"use strict";

var instances = new WeakMap();

function MultihandleWeakMap() {
  instances.set(this, {
    aliases: new WeakMap(),
    store: new WeakMap()
  });
}

MultihandleWeakMap.prototype.addAlias = function (handle1, handle2) {
  var props = instances.get(this).aliases;
  props.set(handle1, handle2);
  props.set(handle2, handle1);
};

MultihandleWeakMap.prototype.set = function (handle, val) {
  this.delete(handle);
  instances.get(this).store.set(handle, val);
};

MultihandleWeakMap.prototype.get = function (handle) {
  var props = instances.get(this);
  
  var val;
  if (props.store.has(handle)) {
    val = props.store.get(handle);
  } else if (props.aliases.has(handle) && props.store.has(props.aliases.get(handle))) {
    val = props.store.get(props.aliases.get(handle));
  }

  return val;
};

MultihandleWeakMap.prototype.delete = function (handle) {
  var props = instances.get(this);
  props.store.delete(handle);

  if (props.aliases.has(handle)) {
    props.store.delete(props.aliases.get(handle));
  }
};

MultihandleWeakMap.prototype.clear = function () {
  instances.get(this).store.clear();
};

module.exports = MultihandleWeakMap;
