import {Component, ComponentFactory} from '../component/index.js';
import { domFromString } from '../parser/index.js';


export default class View
{
    constructor(params)
    {
        this.params = params || {};
        
        this.stylesheets = [];
        this.factories = {};
    }

    show(parent)
    {
        if (this.params)
            this.__init();

        this.parent = parent;

        this.applyStyle();
        this.parent.appendChild( this.node );
    }

    hide()
    {
        this.removeStyle();
        this.parent.removeChild( this.node );

        this.parent = null;
    }

    createStyleheetElement(name)
    {
        var el = document.createElement("link");
            el.setAttribute("rel", "stylesheet");
            el.setAttribute("type", "text/css");
            el.setAttribute("href", name);

        return el;
    }

    applyStyle()
    {
        for (let stylesheet of this.stylesheets)
            document.head.appendChild(stylesheet);
    }

    removeStyle()
    {
        for (let stylesheet of this.stylesheets)
            document.head.removeChild(stylesheet);
    }

    __init()
    {
        this.node = domFromString(this.params.body);


        if (this.params.stylesheets)
        {
            for (var name of this.params.stylesheets)
                this.stylesheets.push(this.createStyleheetElement(name));
        }

        if (this.params.components)
        {
            for (var tag in this.params.components)
                this.factories[tag] = new ComponentFactory(this.params.components[tag]);
        }


        for (let tag in this.factories)
        {
            let nodes = this.node.querySelectorAll(tag);
            let factory = this.factories[tag];

            for (let node of nodes)
                factory.create(node);
        }
        
        this.params = null;
    }
}


