import {extend} from '../utils/index.js'


export function domFromString(string)
{
    let el = document.createElement('div');
    el.innerHTML = string;
    return el.firstElementChild;
}


/**
 * 
 * @param {DOMElement} element 
 * @param {ASTElement} parent  (Optional) 
 */
export function parseDOM(element, parent)
{
    let ASTElem = createASTElement(element.tagName, element.attributes, parent);

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
 * @param {string} tag 
 * @param {array} attribs 
 * @param {ASTElement} parent 
 */
function createASTElement(tag, attribs, parent)
{
    let element = {
        tag,
        type: 1,
        attribs: {},
        children: [],
        bindings: [],
        on: {},
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

    return element;
}

function processDirective(element, directive)
{
    var dir = directive.name.substring(2).split(/:/);
    var directiveName = dir[0],
        directiveArg = dir[1];

    switch (directiveName)
    {
        case "for":
            parseFor(element, directive.value)
            break;
            
        case "bind":
            parseBind(element, directiveArg, directive.value);
            break;
        
        case "on":
            parseOn(element, directiveArg, directive.value);
            break;
    }
}

function parseFor(element, value)
{
    let reg = /([^]*?)\s+(?:in|of)\s+([^]*)/;
    let matches = value.match(reg);
    // TODO: error checking
    
    extend(element, {
        for: matches[2].trim(),
        alias: matches[1].trim()
    });
}

function parseBind(el, arg, val)
{
    el.bindings.push({arg, val});
}

function parseOn(el, arg, val)
{
    el.on[arg] = new Function(`with(this){${val};}`);
}