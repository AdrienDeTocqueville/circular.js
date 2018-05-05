import {createTextNode, VNode} from '../vdom/index.js'
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

    let generator = `_e(${tag},${data},${children},${elem.isRoot})`;

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
    let listeners = Object.keys(elem.on).map( event => {

        return `'${event}':e => ${elem.on[event]}.call(this, e)`
    });


    let directives = []

    directives.push(`ifdir: function(){return typeof ${elem.ifdir} !== 'undefined' ? ${elem.ifdir} : false}`)

    return `{` +
        `directives: {${directives.join(',')}},` +
        `attributes: {${ attribs.concat(bindings).join(',') }},` +
        `listeners: {${ listeners.join(',') }}` +
    `}`;
}

function genChildren(elem)
{
    return `[${ elem.children.map( child => genNode(child) ).join(',') }]`;
}


export function _e(tag, data, children, isRoot) // create element
{
    let vnode;
    
        vnode = new VNode(tag, data, [].concat.apply([], children));
        vnode.isRoot = isRoot;
        
    console.log("vnode", vnode, "if", data.directives.ifdir())

    return vnode;
}

export function _t(text) // create text
{
    return createTextNode(text);
}

export function _l(container, generator) // create loop
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