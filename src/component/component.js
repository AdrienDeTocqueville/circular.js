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
        let obj = extend({}, this.model); // NOTE: make deeper copy ?

        obj._e = _e.bind(obj);
        obj._l = _l.bind(obj);
        obj._t = _t.bind(obj);
        obj.render = this.render;

        obj.vroot = obj.render();
        updateDOM(obj.vroot);

        element.parentNode.replaceChild(obj.vroot.el, element);
        return obj;
    }
}