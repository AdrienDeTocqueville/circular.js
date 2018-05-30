import {ComponentFactory} from '../component/index.js';
import {updateTree} from '../vdom/index.js'


export default class App
{
    constructor(params)
    {
        params = params || {};

        this.selector = params.selector;
        this.root = params;
    }

    mount(selector)
    {
        if (this.isMounted)
            return;

        this.selector = selector || this.selector || "app";
        this.node = document.querySelector(this.selector);

        if (!this.root.view)
            this.root.view = this.node.outerHTML;

        this.root = (new ComponentFactory(this.root)).create(); // create vdom
        updateTree(this.root.$vroot); // create dom
        this.root._show(this.node); // append dom
        // TODO: callbacks
        
        this.node = this.root.$vroot.el;

        this.isMounted = true;
    }
}
