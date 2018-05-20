/**
 * 
 * @param {object} dest 
 * @param {object} src
 */
export function extend(dest, src) {
    for (let key in src) {
        dest[key] = src[key];
    }
    return dest
}

/**
 * 
 * @param {object} obj  
 * 
 * @returns {boolean}
 * 
 * Checks wether param is an object 
 */
export function isObject(obj) {
    return obj !== null && typeof obj === 'object'
}

/**
 * 
 * @param {object} obj  
 * 
 * @returns {boolean}
 * 
 * Checks wether param is a function 
 */
export function isFunction(obj) {
    return obj instanceof Function;
}

/**
 * 
 * @param {object} obj
 * @param {key} key
 * @param {function} callback
 * 
 * Define get and set properties recursively on all children of obj[key]
 */
export function makeReactive(obj, key, callback)
{
    if (isObject(obj[key]))
    {
        for (var childKey in obj[key])
            makeReactive(obj[key], childKey, callback);
    }
    
    defProp(obj, key, callback);
}

/**
 * 
 * @param {object} o
 * @param {key} k
 * @param {function} callback
 * @param {boolean} recursive
 * 
 * Defines get and set on o[k]
 */
export function defProp(o, k, callback, recursive = true)
{
    const property = Object.getOwnPropertyDescriptor(o, k)
    if (property.configurable === false)
      return;
  
    const getter = property.get;
    const setter = property.set;
    if (!getter || !setter)
        var val = o[k];


    Object.defineProperty(o, k, {
        enumerable: true,
        configurable: true,

        get: function rectiveGet() {
            return getter ? getter.call(o): val;
        },
        
        set: function reactiveSet(newVal) {
            if (setter)
                setter.call(o, newVal);
            else
                val = newVal;

            if (recursive && isObject(newVal))
            {
                for (var childKey in newVal)
                    makeReactive(newVal, childKey, callback);
            }

            callback();
        }
    });
}