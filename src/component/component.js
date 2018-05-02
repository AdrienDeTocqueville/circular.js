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


export default class Component {

    constructor(params) {
        this.vues= [];
        this.tagName = params.tagName;
        this.template = params.template;
        proxy(this, params.model, ()=>{
            this.vues.forEach(vue => vue.update())
        });
        extend(params.methods,this);
        this.init();
    }

    init() {
        let dom = domFromString(this.template);
        let ast = parseDOM(dom);

        this._e = _e.bind(this);
        this._l = _l.bind(this);
        this._t = _t.bind(this);
        
        this.render = getRenderer(ast);
        this.ovd = this.render()
    }

    register(vue){
        this.vues.push(vue);
    }
}