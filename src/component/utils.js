import {isObject} from '../utils/index.js';


export function makeReactive(obj, prop, comp)
{
    if (isObject(obj[prop]))
    {
        for (var childProp in obj[prop])
            makeReactive(obj[prop], childProp, comp);
    }
    
    defProp(obj, prop, obj[prop], comp);
}

function defProp(o, p, val, comp)
{
    Object.defineProperty(o, p, {
        enumerable: true,
        configurable: true,

        get: function getter() {
            return val;
        },
        
        set: function getter(newVal) {
            val = newVal;

            comp.update();
        }
    });
}