import {makeReactive} from './index.js'
import {updateDOM} from '../vdom/index.js'
import {_c,_e, _t, _l} from '../renderer/index.js'
import {extend} from '../utils/index.js';


export default class Component
{
    constructor(model, methods, renderer, element)
    {
        this.proxify(model);
        extend(this,  methods);

        this.$updater = null;
        this.$delay = 200;

        this.$render = renderer;
        this._c = _c;
        this._e = _e;
        this._t = _t;
        this._l = _l;

        this.$original = element;
        this.$vroot = this.$render();

        updateDOM(this.$vroot);
        this.__display();

        if (this.onCreate)
            this.onCreate();
        if (this.onDisplay)
            this.onDisplay();
    }

    display()
    {
        if (this.$original.isConnected)
        {
            this.__display();

            if (this.onDisplay)
                this.onDisplay();
        }
    }

    __display()
    {
        this.$original.parentNode.replaceChild(this.$vroot.el, this.$original);
    }

    hide()
    {
        if (this.$vroot.el.isConnected)
        {
            this.$vroot.el.parentNode.replaceChild(this.$original, this.$vroot.el);
            
            if (this.onHide)
                this.onHide();
        }
    }

    proxify(model)
    {
        extend(this, model);

        for (var prop in model)
            makeReactive(this, prop, this);
    }


    update()
    {
        if (this.$updater != null)
            clearTimeout(this.$updater);

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