export function getRenderer(ASTRoot)
{
    var generator = genElement(ASTRoot);
    return new Function("with(this) {return " + generator + ";}");
}

export function getFunctions()
{
    return {_e, _t, _l};
}



function genElement(elem)
{
    var tag = genTag(elem);
    var attributes = genAttribs(elem);
    var children = genChildren(elem);

    var generator = `_e(${tag}, ${attributes}, ${children}, ${elem.isRoot})`;

    if (elem.for)
    {
        generator = `_l(${elem.for}, ` +
                    `function(${elem.alias})` +
                    `{ return ${generator}; })`;
    }

    return generator;
}

function genTextNode(elem)
{
    var text = elem.text.replace(/[\n\r]/g, "");
    text = text.replace(/{{/g, "\" + String(").replace(/}}/g, ") + \"");

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
    {
        for (var key in attrib)
            attributes[key] = attrib[key];
    }

    return JSON.stringify(attributes);
}

function genChildren(elem)
{
    var children = '';

    for (var child of elem.children)
    {
        var childContent;

        if (child.type == 1)
            childContent = genElement(child);

        else if (child.type == 3)
            childContent = genTextNode(child);

        else
            throw new Error("Element type not supported (yet?)");

        children += childContent + ', ';
    }

    return '[' + children + ']';
}


var _e = function(tag, attributes, chidren, isRoot) // create element
{
    var vnode = new VNode(tag, attributes, children);
    vnode.isRoot = isRoot;

    return vnode;
}

var _t = function(text) // create text
{
    return createTextNode(text);
}

var _l = function(container, generator) // create loop
{
    // range loop
    if (typeof container === 'number')
    {
        elems = new Array(container);

        for (var i = 0; i < container; i++)
            elems[i] = generator(i)
    }

    // array loop
    else if (Array.isArray(container))
    {
        var l = container.length;
        elems = new Array(l);

        for (var i = 0; i < l; i++)
            elems[i] = generator(container[i], i)
      }

    // object loop
    else if (isObject(container))
    {
        var keys = Object.keys(container);
        var l = keys.length;
        elems = new Array(l);

        for (var i = 0; i < l; i++)
        {
            key = keys[i];
            elems[i] = generator(container[key], key, i);
        }
    }

    return elems;
}