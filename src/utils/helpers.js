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


