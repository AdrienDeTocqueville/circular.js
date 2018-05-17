import {makeReactive} from './index.js'
import {updateDOM} from '../vdom/index.js'
import {_c,_e, _t, _l} from '../renderer/index.js'
import {extend} from '../utils/index.js';


export default class Component
{
    constructor(model, controller, renderer, element)
    {
        this.proxify(model);
        extend(this,  controller);

        this.$render = renderer;
        this._c = _c;
        this._e = _e;
        this._t = _t;
        this._l = _l;

        this.$original = element;

        this.$updater = null;
        this.$delay = 200;

        this.__update();
        this.show();
    }

    show()
    {
        if (!this.$vroot.el.isConnected)
            this.$original.parentNode.replaceChild(this.$vroot.el, this.$original);
    }

    hide()
    {
        if (this.$vroot.el.isConnected)
            this.$vroot.el.parentNode.replaceChild(this.$original, this.$vroot.el);
    }

    proxify(model)
    {
        extend(this, model);

        for (var prop in model)
            makeReactive(this, prop, this.update.bind(this));
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