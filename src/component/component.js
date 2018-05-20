import {updateDOM} from '../vdom/index.js'
import {_c, _e, _t, _l} from '../renderer/index.js'
import {makeReactive, extend} from '../utils/index.js';


export default class Component
{
    // Init
    constructor(stylesheets, model, renderer, controller, factories, parent)
    {
        this.stylesheets = stylesheets;

        this.proxify(model);

        this.$render = renderer;
        this._c = _c;
        this._e = _e;
        this._t = _t;
        this._l = _l;
        
        extend(this,  controller);

        this.$factories = factories;
        this.$parent = parent;

        this.$updater = null;
        this.$delay = 200;

        this.__update();
    }

    proxify(model)
    {
        extend(this, model);

        for (var prop in model)
            makeReactive(this, prop, this.update.bind(this));
    }

    // Display
    show(node)
    {
        if (!this.$vroot.el.isConnected)
        {
            this.applyStyle();
            node.parentNode.replaceChild(this.$vroot.el, node);

            return true;
        }

        return false;
    }

    hide(node)
    {
        if (this.$vroot.el.isConnected)
        {
            this.$vroot.el.parentNode.replaceChild(node, this.$vroot.el);
            this.removeStyle();

            return true;
        }

        return false;
    }

    applyStyle()
    {
        for (let stylesheet of this.stylesheets)
            document.head.appendChild(stylesheet);
    }

    removeStyle()
    {
        for (let stylesheet of this.stylesheets)
            document.head.removeChild(stylesheet);
    }


    update()
    {
        if (!this.$updater)
		    this.$updater = setTimeout(this.__update.bind(this), this.$delay);
    }

    __update()
    {
        this.$updater = null;

        let nvroot = this.$render();
        updateDOM(nvroot, this.$vroot);
        this.$vroot = nvroot;
    }
}