import { updateDOM } from "../vdom/index.js";


export default class App{


    constructor(name){

        this.name = name;
        this.element = document.querySelector(name);
        this.ovd = undefined;
        this.currentVue = null;
        this.router = undefined;
        
    }

    add(name, vue){
        view.app = this;
    }

    update(nvd){
        updateDOM(nvd,ovd);
        this.ovd= nvd;
    }

    changeVue(vue){
        this.currentVue.isActive = false;
        vue.isActive = true;
        this.currentVue = vue;
        this.element.appendChild(this.ovd.element);
    }
}
