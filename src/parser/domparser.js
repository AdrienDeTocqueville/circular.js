import {setProp, extend} from '../utils/index.js'
import {getAndRemoveAttribute} from './index.js'


export function domFromString(string)
{
    let el = document.createElement('div');
    el.innerHTML = string;
    return el.firstElementChild;
}

/**
 * 
 * @param {string} tag 
 * @param {array} attribs 
 * @param {ASTElement} parent 
 */
function createASTElement(tag, attribs, parent) {
    return {
        tag,
        type: 1,
        attribs: attribs,
        parent,
        isRoot: !parent,
        children: []
    }
}



/**
 * 
 * @param {DOMElement} element 
 * @param {ASTElement} parent  (Optional) 
 */
export function parseDOM(element, parent)
{
    let ASTElem = createASTElement(element.tagName, element.attributes, parent);
    processcFor(ASTElem);

    Array.prototype.forEach.call(element.childNodes, child => {
        if (child.nodeType === 1) {
            ASTElem.children.push(parseDOM(child, element));
        } else if (child.nodeType === 3) {
            if (child.data.trim() != "") {
                ASTElem.children.push({
                    type: 3,
                    text: child.data
                });
            }

        }
    });

    return ASTElem;
}

/**
 * 
 * @description process all "on"s events bound to element
 * @param {ASTElement} el 
 */
function processcOn(el){
//TODO
}

function processcFor(el)
{
    let cfor = getAndRemoveAttribute(el, 'c-for')
    if (cfor) {
        let res = parsecFor(cfor)
        if (res) {
            extend(res, el)
        }
    }

}
/**
 * 
 * @param {string} expr 
 */

function parsecFor(attrib)
{
    let reg = /([^]*?)\s+(?:in|of)\s+([^]*)/;
    let matches = attrib.value.match(reg)
    return {
        for: matches[2].trim(),
        alias: matches[1].trim()
    }
}



