import { Component } from "../component";

export default class Vue{

    constructor(name, template){
        this.name = name;
        this.init();
        this.isActive = false;
        this.app = undefined;
        this.template = template;

    }

    addComponent(name, params){
        const comp = new Component(params);
        this.components[name] = comp;
        comp.register(this)


    }

    update(){
        if (this.isActive){
            this.makeVdom();
            this.app.update(this.vd); //hands the new virtual dom to the app instance
        }
    }

    init() {
        let dom = domFromString(this.template);
        let ast = parseDOM(dom);

        this._e = _e.bind(this);
        this._l = _l.bind(this);
        this._t = _t.bind(this);
        
        this.render = getRenderer(ast);
        this.makeVdom();
    }

    replaceCustomComponents(vnode){
        if (this.isCustomComponent(vnode.name)){
            vnode = this.components[vnode.name].render()
        } else {
            vnode.children.map(child => this.replaceCustomComponents(child))
        }
    }

    isCustomComponent(name){
        return name in Object.keys(this.components)
    }


    makeVdom(){
        this.vd = this.render();
        this.replaceCustomComponents(this.vd);
    }


}