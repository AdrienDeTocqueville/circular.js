import {
    domFromString,
    parseDOM
} from '../parser/index.js'

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


export default class Component {
    constructor(params) {
        this.params = params
        this.template = params.template;
        if (params.model){
            this.model = JSON.parse(JSON.stringify(params.model));//deep copy
            proxy(this, this.model, ()=>{
                
                let nvroot = this.render();
                updateDOM(nvroot, this.vroot);
                this.vroot = nvroot;
            })
        }


        let dom = domFromString(this.template);
        let ast = parseDOM(dom);

        this.render = getRenderer(ast);

        this._e = _e.bind(this);
        this._l = _l.bind(this);
        this._t = _t.bind(this);

        this.vroot = this.render();

        updateDOM(this.vroot);
        
    }

    clone(element) {

        console.log("new instance")
        let instance = new Component(this.params)

        instance.original = element;
        
        element.parentNode.replaceChild(instance.vroot.el, element);

        return instance;
    }

    destroy(instance) {
        instance.vroot.el.parentNode.replaceChild(instance.original, instance.vroot.el);
    }
}