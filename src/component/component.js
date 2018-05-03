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

import {proxy} from './index.js'
import {extend} from '../utils/index.js'
import {updateDOM} from '../vdom/index.js'


export default class Component
{
    constructor(params)
    {
        this.template = params.template;
        this.model = params.model;
        
        let dom = domFromString(this.template);
        let ast = parseDOM(dom);

        this.render = getRenderer(ast);
    }

    instantiate(element)
    {
        let instance = extend({}, this.model); // NOTE: make deeper copy ?

        instance._e = _e.bind(instance);
        instance._l = _l.bind(instance);
        instance._t = _t.bind(instance);

        instance.original = element;
        instance.render = this.render;

        instance.vroot = instance.render();

        updateDOM(instance.vroot);
        element.parentNode.replaceChild(instance.vroot.el, element);

        return instance;
    }

    destroy(instance)
    {
        instance.vroot.el.parentNode.replaceChild(instance.original, instance.vroot.el);
    }
}