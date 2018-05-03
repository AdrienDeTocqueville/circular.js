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
    let element = {
        tag,
        type: 1,
        attribs: {},
        children: [],
        parent,
        isRoot: !parent
    }

    for (let attrib of attribs)
    {
        if (attrib.name.search(/^c-/) != -1)
            processDirective(element, attrib);

        else
            element.attribs[attrib.name] = attrib.value;
    }

    console.log(element);

    return element;
}



/**
 * 
 * @param {DOMElement} element 
 * @param {ASTElement} parent  (Optional) 
 */
export function parseDOM(element, parent)
{
    let ASTElem = createASTElement(element.tagName, element.attributes, parent);
    //processcFor(ASTElem);
    //processcBind(ASTElem);

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

function processDirective(element, directive)
{
    var dir = directive.name.substring(2).split(/:/);
    var directiveName = dir[0],
        directiveArg = dir[1];

    switch (directiveName)
    {
        case "for":
            extend(element, parsecFor(directive.value));
            break;
            
        case "bind":
            console.log("bind directive")
            break;
        
        case "on":
            break;
    }
}

function parsecFor(value)
{
    let reg = /([^]*?)\s+(?:in|of)\s+([^]*)/;
    let matches = value.match(reg);
    // TODO: error checking
    return {
        for: matches[2].trim(),
        alias: matches[1].trim()
    }
}