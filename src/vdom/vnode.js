import { defProp, unpack } from "../utils/index.js";

export class VNode
{
    constructor(params, component)
    {
        if (params)
        {
            this.tagName = params.tag;
    
            this.model = params.model;
            this.watched = params.watched;
            this.listeners = params.listeners;
            this.attributes = params.attributes;
            
            this.children = [].concat.apply([], params.children);
        }
        
        this.component = component;
        this.type = 1;
        this.el = undefined;
    }

    updateDOM(oldDOM)
    {
        if (!oldDOM)
            this.createElement();
    }

    createElement()
    {
		if (this.text !== undefined) {
            this.el = document.createTextNode(this.text);
        }
        else if (this.isEmpty) {
            this.el = document.createComment("c-if node");
        }
        else {
            this.el = document.createElement(this.tagName);
          
            this.setModel();
            this.setWatchers();
            this.setListeners();
            this.setAttributes();
        }
    }

    setModel()
    {
        if (this.model)
        {
            let input = this.el;
            let params = unpack(this.component, this.model.var);
            let p = Object.getOwnPropertyDescriptor(params.obj, params.key);

            this.el.addEventListener(this.model.on, function(){params.obj[params.key] = this.value}); // NOTE: creates view - model - view update
            defProp(this.component, this.model.var, function(){input.value=params.obj[params.key]}, false);

            input.value = p.get(); // initialize view
        }
    }
    
    setWatchers()
    {
        if (this.watched)
        {
            let component = this.component;
            for (let prop of this.watched)
                defProp(this.component, prop, function(){component._update()}, false);
        }
    }
    
    setListeners()
    {
        for (let event in this.listeners)
            this.el.addEventListener(event, this.listeners[event]);
    }

    setAttributes()
    {
        for (let attribute in this.attributes)
            this.el.setAttribute(attribute, this.attributes[attribute]);
    }

    replaceChild(n, o)
    {
        for (let child of children)
        {
            if (child == o)
            {
                child = n;
                n.parent = this;
                this.el.replaceChild(n.el, o.el);

                return;
            }
        }
    }

    isRoot()
    {
        return (this.component && this == this.component.$vroot);
    }
}

export function createComponent(factory, parentComponent)
{
    let c = factory.create(parentComponent);

    return c.$vroot;
}

export function createEmptyNode()
{
    let vnode = new VNode();
    vnode.isEmpty = true;
    vnode.type = 2;

    return vnode;
}

export function createTextNode(text)
{
    let vnode = new VNode();
    vnode.text = text;
    vnode.type = 3;

    return vnode;
}