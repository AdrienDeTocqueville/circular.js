import {proxy} from './index.js'
import {updateDOM} from '../vdom/index.js'
import {_c,_e, _l, _t} from '../renderer/index.js'
import { extend } from '../utils/index.js';


export default class Component
{
    constructor(model, methods, renderer, element)
    {
        proxy(this, model, () => {
            let nvroot = this.render();
            updateDOM(nvroot, this.vroot);
            this.vroot = nvroot;
        })
        
        this.model = model;
        this.render = renderer;
        extend(this, methods);

        this._c = _c;
        this._l = _l;
        this._t = _t;
        this._e = _e;

        this.original = element;
        this.vroot = this.render();

        updateDOM(this.vroot);
        this.display();
    }

    display()
    {
        if (this.original.isConnected)
            this.original.parentNode.replaceChild(this.vroot.el, this.original);
    }

    hide()
    {
        if (this.vroot.el.isConnected)
            this.vroot.el.parentNode.replaceChild(this.original, this.vroot.el);
    }
}


