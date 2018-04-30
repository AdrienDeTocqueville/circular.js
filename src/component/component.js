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

        this.tagname = params.tagname;
        this.template = params.template;
        this.number = 10;
        this.methods = params.methods;
        this._e = _e.bind(this);
        this._l = _l.bind(this);
        this._t = _t.bind(this);

        this.init();
        this.ovd = undefined;
        console.log(this.render())

    }

    init() {
        let dom = domFromString(this.template);
        let ast = parseDOM(dom);
        this.render = getRenderer(ast);

    }
}