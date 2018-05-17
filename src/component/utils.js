import {isObject} from '../utils/index.js';


export function makeReactive(obj, key, callback)
{
    if (isObject(obj[key]))
    {
        for (var childKey in obj[key])
            makeReactive(obj[key], childKey, callback);
    }
    
    defProp(obj, key, callback);
}

function defProp(o, k, callback)
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

            if (isObject(newVal))
            {
                for (var childKey in newVal)
                    makeReactive(newVal, childKey, callback);
            }

            callback();
        }
    });
}