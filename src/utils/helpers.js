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


