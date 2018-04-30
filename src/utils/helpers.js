/**
 * 
 * @param {Object} object 
 * @param {string} key 
 * @param {string} value 
 * 
 * Helper method to set property to an object
 */
function setProp(object, key, value) {
    Object.defineProperty(o, key, {
        value: value
    })
}


/**
 * 
 * @param {object} to 
 * @param {object} _from 
 */
function extend(from, to) {
    for (var key in from) {
        to[key] = from[key];
    }
    return to
}



