var mergeInto = require('./mergeInto');

class MapClass {
  constructor(obj: Object) {
    this._obj = obj;
  }

  get(k: string, def: ?any): ?any {
    if (this._obj.hasOwnProperty(k)) {
      return this._obj[k];
    }
    return def;
  }

  set(k: string, v: ?any): MapClass {
    this._obj[k] = v;
    return this;
  }

  static keyMirror(obj: Object): Object {
    return Map.fromKeys(Object.keys(obj)).toObject();
  }

  static fromKeys(keys: Array, val: ?any): MapClass {
    var fn;
    if (typeof val === 'function') {
      fn = val;
    } else if (typeof val === 'undefined') {
      fn = (k) => k;
    } else {
      fn = () => val;
    }

    var obj = {};
    keys.forEach((k, i) => {
      obj[k] = fn(k, i)
    });
    return new MapClass(obj);
  }

  static fromItems(items: Array<Array>): MapClass {
    var obj = {};
    items.forEach(item => {obj[item[0]] = item[1]});
    return new MapClass(obj);
  }

  static zip(keys: Array<string>, values: Array<any>): MapClass {
    return MapClass.fromKeys(keys, (k, i) => values[i]);
  }

  filter(fn: ?(k: string, v: ?any) => boolean): MapClass {
    fn = fn || (k, v) => !!v;
    return MapClass.fromItems(
      this.items().filter(fn)
    );
  }

  forEach(fn: (k: string, v: ?any) => ?any): MapClass {
    this.items().forEach(fn);
    return this;
  }

  map(fn: (k: string, v: ?any) => ?any): MapClass {
    var obj = {};
    this.items().forEach(function([k, v]) {
      var ret = fn(k, v);
      if (ret[0]) {
        obj[ret[0]] = ret[1];
      }
    });
    return new MapClass(obj);
  }

  keys(): Array {
    return Object.keys(this._obj);
  }

  values(): Array {
    return this.keys().map(k => this._obj[k]);
  }

  items(): Array<Array> {
    return this.keys().map(k => [k, this._obj[k]]);
  }

  toObject(): Object {
    return this._obj;
  }
}


function Map(obj: Object): MapClass {
  return new MapClass(obj);
};

module.exports = mergeInto(Map, {
  keyMirror: MapClass.keyMirror,
  fromKeys: MapClass.fromKeys,
  fromItems: MapClass.fromItems,
  zip: MapClass.zip,
});
