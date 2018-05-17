import View from '../view/view.js';


export default class App
{
    constructor(params)
    {
        params = params || {};

        this.currentView = null;
        this.selector = params.selector;

        if (params.view)
            this.defaultView = new View(params.view);
    }

    mount(selector)
    {
        this.selector = selector || this.selector || "body";
        this.node = document.querySelector(this.selector);

        if (this.defaultView)
            this.defaultView.show(this.node);
    }

    show(view)
    {
        if (view == this.currentView)
            return;

        if (this.currentView)
        {
            this.currentView.hide();
        }

        this.currentView = view;
        this.currentView.show(this.node);
    }
}
