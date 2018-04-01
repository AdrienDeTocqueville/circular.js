

import {Beard} from "./beard.js"


export class App {
    constructor(tagname) {
        this.tagname = tagname
        this.components = []
        this.$el = document.querySelector(tagname)

    }

    
    add(component) {
        component.$element = this.$el.querySelector(component.tagname)
        if (component) {

            this.clean(component.$element)

            if (component.model) component.model = this.proxify(component.model, component)
            component.find = this.find
            component.findAll = this.findAll
            component.listen = this.listen
            component.listenAll = this.listenAll
            this.components.push(component)
            component.templateEngine = new Beard(component)
            component.templateEngine.make().then(() => {
                if (component.hasOwnProperty('onLoad')) {
                    component.onLoad(component.model)
                }
            })

        }

    }

    listen(selector, event, callback) {
        let item = this.find(selector)
        item.addEventListener(event, callback)
    }

    listenAll(selector, event, callback) {
        let items = this.findAll(selector)
        items.map(item => {
            item.addEventListener(event, callback)
        })

    }

    find(selector) {
        return this.$element.querySelector(selector)
    }

    findAll(selector) {
        return Array.prototype.slice.call(this.$element.querySelectorAll(selector))
    }


    proxify(object, component) {
        Object.keys(object).map(prop => {
            if (typeof object[prop] === 'object') {
                object[prop] = this.proxify(object[prop], component)
            }
        })
        return new Proxy(object, {
            set: (target, prop, val) => {
                target[prop] = val
                component.templateEngine.render()
                return true
            }
        })
    }

    clean(node) {
        if (node) {

            for (var n = 0; n < node.childNodes.length; n++) {
                var child = node.childNodes[n];
                if (
                    child.nodeType === 8 ||
                    (child.nodeType === 3 && !/\S/.test(child.nodeValue))
                ) {
                    node.removeChild(child);
                    n--;
                } else if (child.nodeType === 1) {
                    this.clean(child);
                }
            }
        }
    }
}