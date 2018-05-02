import {createTextNode, VNode} from '../vdom/index.js'
import {isObject} from '../utils/index.js'


export function getRenderer(ASTRoot)
{
    var generator = genNode(ASTRoot);
    return new Function("with(this){return " + generator + ";}");
}



function genNode(node)
{
    if (node.type == 1)
        return genElement(node);

    else if (node.type == 3)
        return genTextNode(node);

    else
        throw new Error("Element type not supported (yet?)");
}

function genElement(elem)
{
    var tag = genTag(elem);
    var attributes = genAttribs(elem);
    var children = genChildren(elem);

    var generator = `_e(${tag},${attributes},${children},${elem.isRoot})`;

    if (elem.for)
    {
        generator = `_l(${elem.for},` +
                    `function(${elem.alias})` +
                    `{return ${generator};})`;
    }

    return generator;
}

function genTextNode(elem)
{
    var text = elem.text.replace(/[\n\r]/g, "");
    text = text.replace(/{{/g, "'+String(").replace(/}}/g, ")+'");

    return `_t('${text}')`;
}


function genTag(elem)
{
    return '"' + elem.tag + '"';
}

function genAttribs(elem)
{
    var attributes = {};

    for (var attrib of elem.attribs)
        attributes[attrib.name] = attrib.value;

    return JSON.stringify(attributes);
}

function genChildren(elem)
{
    return `[${ elem.children.map( child => genNode(child) ).join(',') }]`;
}


export function _e(tag, attributes, children, isRoot) // create element
{
    var vnode = new VNode(tag, attributes, [].concat.apply([], children));
    vnode.isRoot = isRoot;

    return vnode;
}

export function _t(text) // create text
{
    return createTextNode(text);
}

export function _l(container, generator) // create loop
{
    var elems, i, l;

    // range loop
    if (typeof container === 'number')
    {
        elems = new Array(container);

        for (i = 0; i < container; i++)
            elems[i] = generator(i)
    }

    // array loop
    else if (Array.isArray(container))
    {
        l = container.length;
        elems = new Array(l);

        for (i = 0; i < l; i++)
            elems[i] = generator(container[i], i)
      }

    // object loop
    else if (isObject(container))
    {
        var keys = Object.keys(container);
        l = keys.length;
        elems = new Array(l);

        for (i = 0; i < l; i++)
        {
            let key = keys[i];
            elems[i] = generator(container[key], key, i);
        }
    }

    return elems;
}