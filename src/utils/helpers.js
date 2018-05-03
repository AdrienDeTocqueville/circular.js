/**
 * 
 * @param {Object} object 
 * @param {string} key 
 * @param {string} value 
 * 
 * Helper method to set property to an object
 */
export function setProp(object, key, value) {
    Object.defineProperty(object, key, {
        value: value,
        enumerable: true

    })
}


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
 * @param {object} object  
 * 
 * @returns {boolean}
 * 
 * Checks wether param is an object 
 */
export function isObject(object) {
    return object !== null && typeof object === 'object'
}


