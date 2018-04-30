function render(rootElem)
{
    generator = generate(rootElem);
    var render = new Function("with(this) {return " + generator + ";}");
}

function getFunctions()
{
    return {_e, _t, _l};
}



function genElement(elem)
{
    var tag = genTag(elem);
    var attributes = genAttribs(elem);
    var children = genChildren(elem);

    return `_e(${tag}, ${attributes}, ${children}, &{elem.isRoot})`;
}

function genTextNode(elem)
{
    return `_t('&{elem.text}')`;
}


function genTag(elem)
{
    return '"' + elem.tag + '"';
}

function generatorAttribs(elem)
{
    var attributes = {};

    for (var attrib in elem.attribs)
    {
        for (var key of attrib)
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


var _e = function(tag, attributes, content) // create element
{
    // var el = document.createElement(tag);

    // if (attributes.className)
    //     el.setAttribute("class", attributes.className);

    // for (var attr in attributes.attrs)
    //     el.setAttribute(attr, attributes.attrs[attr]);

    // for (var property in attributes.style)
    //     el.style[property] = attributes.style[property];

    // for (var type in attributes.on)
    //     el.addEventListener(type, attributes.on[type]);



    // for (var c of content) {
    //     if (c.constructor === Array) {
    //         for (var child of c)
    //             el.appendChild(child);
    //     } else
    //         el.appendChild(c);
    // }

    // return el;
}

var _t = function(str) // create text
{
    // return document.createTextNode(str);
}

var _l = function(container, generator) // create loop
{
    // var els = new Array(container.length);

    // for (var i = 0; i < container.length; i++)
    //     els[i] = generator(container[i], i);

    // return els;
}