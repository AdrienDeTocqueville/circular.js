import Component from '../component/component.js'
import Router from '../router/router.js';

export default class App
{
    constructor()
    {
        this.components = {};
        this.router = new Router();
    }

    component(tagName, data)
    {
        this.components[tagName] = new Component(data);
    }

    mount(selector)
    {
        this.node = document.querySelector(selector);

        for (let tag in this.components)
        {
            let nodes = this.node.querySelectorAll(tag);
            let component = this.components[tag];

            for (let node of nodes)
            {
                let route = node.attributes["c-route"];

                if (route)
                    this.router.addRoute(route, component, node);
                else
                    component.instantiate(node);
            }
        }
    }
} 