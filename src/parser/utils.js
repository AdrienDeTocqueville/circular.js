function domFromString(string) {
    let el = document.createElement('div');
    el.innerHTML = string;
    return el.firstChild;
}




/**
 * 
 * @param {ASTElement} ASTElement 
 * @param {string} property 
 * 
 * @returns {string} 
 * 
 * removes the given attribute from attibute list and returns it's value
 */
function getAndRemoveAttribute(ASTElement, property) {
    let value;
    let props = ASTElement.props;
    for (let i = 0; i < props.length; i++) {
        let val = props[i][property]
        if (val) {
            ASTElement.props = ASTElement.props.slice(i, 1);
            return val;
        }
    }
}

/**
 * @typedef {object} DOMElement 
 * @param {DOMElement} element 
 * 
 * @returns Array<DOMElement> return an array of the children of an element
 */
function getChildNodes(element) {
    let children = []
    for (let i = 0; i < element.childNodes.length; i++) {
        children.push(element.childNodes[i])
    }
    return children;
}




/**
 * 
 * @param {DOMElement} element 
 * @returns {Array<{attributeName, AttributeValue}>}
 */
function getAttributes(element) {
    let attr = [];
    for (let i = 0; i < element.attributes.length; i++) {
        let o = {}
        o[element.attributes[i].nodeName] = element.attributes[i].nodeValue;
        attr.push(o);
    }
    return attr;
}



/**
 * 
 * @param {DOMElement} element 
 * 
 * @return {string}
 */
function getTagName(element) {
    return element.tagName;
}