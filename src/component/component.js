import {
    domFromString,
    parseDOM
} from '../parser/index.js'

import {
    getRenderer,
    getFunctions,
    _e, _l, _t
} from '../renderer/index.js'



export default class Component {

    constructor(params) {

        this.template = params.template;
        this.model = params.model;
        this.methods = params.methods;
        this._e = _e.bind(this);
        this._l = _l.bind(this);
        this._t = _t.bind(this);

        this.init();

    }

    init() {
        let dom = domFromString(this.template);
        let ast = parseDOM(dom);
        this.render = getRenderer(ast);
    }
}