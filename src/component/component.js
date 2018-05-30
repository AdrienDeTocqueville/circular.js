import {updateTree} from '../vdom/index.js'
import {_c, _e, _t, _l} from '../renderer/index.js'
import {makeReactive, extend} from '../utils/index.js';


export default class Component
{
    // Init
    constructor(model, renderer, controller, factories, parent)
    {
        this.$factories = factories;
        this.$parent = parent;

        this.$updater = null;
        this.$delay = 0;

        this.$render = renderer;
        this._c = _c;
        this._e = _e;
        this._t = _t;
        this._l = _l;
        

        extend(this, model);
        extend(this,  controller);

        this.onLoad && this.onLoad();

        this._proxify(model);
        this._render();
    }

    _proxify(model)
    {
        for (var prop in model)
            makeReactive(this, prop, this._update.bind(this));
    }

    // Display
    _show(node)
    {
        if (node && node.parentNode)
            node.parentNode.replaceChild(this.$vroot.el, node);

        this.onShow && this.onShow();
    }

    _hide(node)
    {
        if (node && this.$vroot.el.parentNode)
            this.$vroot.el.parentNode.replaceChild(node, this.$vroot.el);

        this.onHide && this.onHide();
    }

    _applyStyle()
    {
        for (let stylesheet of this.$stylesheets)
            document.head.appendChild(stylesheet);
    }

    _removeStyle()
    {
        for (let stylesheet of this.$stylesheets)
            document.head.removeChild(stylesheet);
    }


    _update()
    {
        if (!this.$updater)
		    this.$updater = setTimeout(this.__update.bind(this), this.$delay);
    }

    __update()
    {
        this.$updater = null;

        let oldVroot = this.$vroot;
        this._render();

        updateTree(this.$vroot, oldVroot);

        if (oldVroot.parent)
            oldVroot.parent.replaceChild(this.$vroot, oldVroot);
        else
            this._show(oldVroot.el);
    }

    _render()
    {
        try
        {
            this.$vroot = this.$render();
        }
        catch (e)
        {
            console.error("circular: Property or method", e.message);
            console.error(e);
        }
    }
}