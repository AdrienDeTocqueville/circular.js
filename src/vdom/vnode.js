import updateTree from './vdom.js'
import { defProp, unpack } from "../utils/index.js";

export class VNode
{
    constructor(params, component)
    {
        if (params)
        {
            this.tagName = params.tag;
    
            this.model = params.model;
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
        switch (this.type)
        {
            case 1:
                this.el = document.createElement(this.tagName);
              
                this.setModel();
                this.setListeners();
                this.setAttributes();
                return;

            case 2:
                this.el = document.createComment("c-if node");
                return;

            case 3:
                this.el = document.createTextNode(this.text);
                return;

            case 4:
                this.component = this.factory.create(this.parentComponent);

                let nvroot = this.component.$vroot;
                this.component.$vroot = this;

                this.copyComponent(nvroot);
                this.createElement();
                return;

            default:
                console.error("circular: Unknown vnode type");
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
        for (let child of this.children)
        {
            if (child == o)
            {
                child = n;
                n.parent = this;
                if (n.el != o.el)
                this.el.replaceChild(n.el, o.el);

                return;
            }
        }
    }

    isRoot()
    {
        return (this.component && this == this.component.$vroot);
    }

    copyComponent(src)
    {
        this.componentTag = this.tagName;
        this.tagName = src.tagName;

        this.model = src.model;
        this.listeners = src.listeners;
        this.attributes = src.attributes;
        this.isEmpty = src.isEmpty;
        this.text = src.text;

        this.children = src.children;
        this.type = src.type;
    }
}

export function createComponent(params, parentComponent, factory)
{
    let vnode = new VNode(params);
    vnode.parentComponent = parentComponent;
    vnode.factory = factory;
    vnode.type = 4;

    return vnode;
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