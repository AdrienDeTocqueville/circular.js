import {Component} from "./index.js";

import {getRenderer} from "../renderer/index.js";
import {domFromString, parseDOM} from '../parser/index.js'
import {isFunction} from "../utils/index.js";


export default class componentFactory
{
    constructor(params)
    {
        this.render = params.template;
    
        this.model = params.model || {};
        this.methods = params.methods || {};
    }

    create(element)
    {
        let model = JSON.parse(JSON.stringify(this.model)); // deep copy
        return new Component(model, this.methods, this.getRenderer(), element);
    }

    getRenderer()
    {
        if (!isFunction(this.render))
        {
            let dom = domFromString(this.render);
            let ast = parseDOM(dom);
            this.render = getRenderer(ast);
        }

        return this.render;
    }
}