import { getRenderer } from "../renderer/index.js";
import {
    domFromString
} from '../parser/index.js'

import {
    getRenderer
} from '../renderer/index.js'
import { Component } from "./index.js";

export default function componentFactory(params){

    let dom = domFromString(params.template);
    let ast = parseDOM(dom);
    this.render = getRenderer(ast);
    this.model = params.model;
    this.methods = params.methods;
    this.create = function createComponent(){
        let model = JSON.parse(JSON.stringify(this.model)); // deep copy
        return new Component(model, this.render, this.methods)
    }
}