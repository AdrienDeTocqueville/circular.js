import {parseDOM} from '../parser/index.js'

import {
    getRenderer,
    _e,
    _l,
    _t
} from '../renderer/index.js'

import {
    proxy
} from './index.js'
import {
    extend
} from '../utils/index.js'
import {
    updateDOM
} from '../vdom/index.js'


export default class Component
{
    constructor(model, renderer, methods) {
        proxy(this, model, ()=>{
            let nvroot = this.render();
            updateDOM(nvroot, this.vroot);
            this.vroot = nvroot;
        })
        
        this.model = model;
        this.render = renderer;
        this.methods = methods;

        this._e = _e;
        this._l = _l;
        this._t = _t;

        this.vroot = this.render();

        updateDOM(this.vroot);    
    }

    clone(element) {
        let instance = new Component(this.params)

        instance.original = element;
        
        element.parentNode.replaceChild(instance.vroot.el, element);

        return instance;
    }

    destroy(instance) {
        instance.vroot.el.parentNode.replaceChild(instance.original, instance.vroot.el);
    }
}


