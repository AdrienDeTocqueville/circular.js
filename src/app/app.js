import View from '../view/view.js';


export default class App
{
    constructor(view)
    {
        this.defaultView = new View(view);
    }

    mount(selector)
    {
        this.node = document.querySelector(selector || "body");

        this.defaultView.show(this.node);
    }
}
