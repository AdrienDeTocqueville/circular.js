import Component from '../component/component.js'
import Router from '../router/router.js';

export default class App
{
    constructor(router)
    {
        this.components = {};
        this.router = router || new Router();
    }

    component(tagName, data)
    {
        this.components[tagName] = new Component(data);
    }

    mount(selector)
    {
        this.element = document.querySelector(selector);

        for (let tag in this.components)
        {
            let elements = this.element.querySelectorAll(tag);
            let component = this.components[tag];

            for (let element of elements)
            {
                let route = element.attributes["c-route"];

                if (route)
                    this.router.addRoute(route, component, element);
                else
                    component.instantiate(element);
            }
        }
    }
} 