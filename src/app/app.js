import {ComponentFactory} from '../component/index.js';


export default class App
{
    constructor(params)
    {
        params = params || {};

        this.selector = params.selector;
        this.root = (new ComponentFactory(params)).create();
    }

    mount(selector)
    {
        this.selector = selector || this.selector || "app";
        this.node = document.querySelector(this.selector);

        if (this.root.show(this.node))
            this.node = this.root.$vroot.el;
    }
}
