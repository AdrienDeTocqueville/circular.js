import {VNode, createTextNode, createEmptyNode} from '../vdom/index.js'
import {isObject} from '../utils/index.js'


export function getRenderer(ASTRoot)
{
    let generator = genNode(ASTRoot);
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
    let tag = genTag(elem);
    let data = genData(elem);
    let children = genChildren(elem);

    let generator = `_c(${tag},${data},${children},${elem.isRoot})`;

    if (elem.if)
    {
        generator = `(${elem.if})?${generator}:_e()`;
    }

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
    let text = elem.text.replace(/[\n\r]/g, "");
    text = text.replace("'", "\\'").replace('"', '\\"').replace('`', '\\`');
    text = text.replace(/{{/g, "'+String(").replace(/}}/g, ")+'") || null;

    return `_t('${text}')`;
}


function genTag(elem)
{
    return `'${ elem.tag }'`;
}

function genData(elem)
{
    // attribs
    let attribs = Object.keys(elem.attribs).map( attrib => `'${attrib}':'${elem.attribs[attrib]}'` );
    let bindings = elem.bindings.map( binding => `'${binding.arg}':${binding.val}` );

    //on
    let listeners = Object.keys(elem.on).map( event => `'${event}':${elem.on[event]}` );

    return `{` +
        `attributes: {${ attribs.concat(bindings).join(',') }},` +
        `listeners: {${ listeners.join(',') }}` +
    `}`;
}


function genChildren(elem)
{
    return `[${ elem.children.map( child => genNode(child) ).join(',') }]`;
}


export function _c(tag, data, children, isRoot)
{
    let vnode = new VNode(tag, data, [].concat.apply([], children));
    vnode.isRoot = isRoot;

    return vnode;
}

export function _e()
{
    return createEmptyNode();
}

export function _t(text)
{
    return createTextNode(text);
}

export function _l(container, generator)
{
    let elems, i, l;

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
        let keys = Object.keys(container);
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