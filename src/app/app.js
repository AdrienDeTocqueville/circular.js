import {Component, componentFactory} from '../component/index.js';
import {Router} from '../router/index.js';


export default class App
{
    constructor()
    {
        this.factories = {};
        this.router = new Router();

        Component.prototype.$router = this.router;
    }

    component(tagName, data)
    {
        this.factories[tagName] = new componentFactory(data);
    }

    mount(selector)
    {
        this.node = document.querySelector(selector || "body");

        for (let tag in this.factories)
        {
            let nodes = this.node.querySelectorAll(tag);
            let factory = this.factories[tag];

            for (let node of nodes)
            {
                let route = node.attributes["c-route"];

                if (route)
                    this.router.addRoute(route.value, factory, node);
                else
                    factory.create(node);
            }
        }
    }
}
