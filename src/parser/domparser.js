

import {setProp, extend} from '../utils/index.js'
import {getAndRemoveAttribute,getAttributes,getChildNodes, getTagName} from './index.js'




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
export default function parseDOM(element, parent) {

    let currentElement = element;

    let ASTElem;
    let attribs = [];
    let tagName = '';

    attribs = getAttributes(currentElement);
    tagName = getTagName(currentElement);

    ASTElem = createASTElement(tagName, attribs, parent);


    let childrenElement = getChildNodes(element);

    childrenElement.forEach(element => {
        if (element.nodeType === 1) {
            ASTElem.children.push(parseDOM(element, currentElement));
        } else if (element.nodeType === 3) {
            if (element.data.trim() != "") {
                ASTElem.children.push({
                    type: 3,
                    text: element.data
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
function processOn(el){
//TODO
}

function processFor(el) {

    let cfor = getAndRemoveAttribute(el, 'c-for')
    if (cfor) {
        let res = parseCFor(cfor)
        if (res) {
            extend(res, el)
        }
    }

}
/**
 * 
 * @param {string} expr 
 */

function parseCFor(expr) {
    let reg = /([^]*?)\s+(?:in|of)\s+([^]*)/;
    let matches = expr.match(reg)
    if (!matches) return;
    return res = {
        for: matches[2].trim(),
        alias: matches[1].trim()
    }
}



