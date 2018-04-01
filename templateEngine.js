class TemplateEngine {


    constructor(component) {
        this.$el = document.querySelector(component.tagname)
        this.component = component
    }

    render() {
        let newDom = this.makeDOM(this.component.template)
        this.updateElement(this.$el, newDom, this.DOM || null)
        this.DOM = newDom
    }

    makeDOM(template) {
        return this.virtualify(this.domify(template))
    }

    hasChanged(node1, node2) {
        return typeof node1 !== typeof node2 ||
            typeof node1 === 'string' && node1 !== node2 ||
            node2.type !== node1.type

    }

    updateElement($parent, newNode, oldNode, index = 0) {
        if (!oldNode) {
            $parent.appendChild(this.realify(newNode))
        } else if (!newNode) {
            $parent.removeChild($parent.childNodes[index])
        } else if (this.hasChanged(newNode, oldNode)) {
            $parent.replaceChild(this.realify(newNode), $parent.childNodes[index])
        } else if (newNode.type) {
            const nl = newNode.children.length
            const ol = oldNode.children.length
            for (let i = 0; i < nl || i < ol; i++) {
                this.updateElement(
                    $parent.childNodes[index],
                    newNode.children[i],
                    oldNode.children[i],
                    i
                )
            }
        }
    }

    realify(node) {
        if (typeof node === 'string') {
            return document.createTextNode(node)
        }
        const $element = document.createElement(node.type)
        this.setProps($element, node.props)
        node.children
            .map((child) => {
                return this.realify(child)
            })
            .forEach($element.appendChild.bind($element));
        return $element
    }

    domify(templateString) {
        let template = document.createElement('template')
        templateString = templateString.trim()
        template.innerHTML = templateString
        return template.content.firstChild
    }

    _v(type, props, children) {
        return {
            type,
            props,
            children
        }
    }

    virtualify(node) {

        var children = []
        let type = node.localName
        let props = {}

        //checks if textnode
        if (node.nodeType == '3') {

            return this.evaluate(node.nodeValue, this.component)
        }
        for (let i = 0, atts = node.attributes; i < node.attributes['length']; i++) {
            let att = atts[i]
            props[att.nodeName] = att.nodeValue
        }

        for (let i = 0; i < node.childNodes.length; i++) {
            let child = node.childNodes[i]
            let newnode = this.virtualify(child)
            if (!(typeof newnode === 'string' && newnode.trim() == '')) {
                console.log("newnode", newnode, 'oftype', typeof newnode)
                children.push(newnode)
            }
        }
        return this._v(type, props, children)
    }

    evaluate(string, data) {
        let reg = /{{[\w.()*+\/-]*}}/ //update to capture more
        return string.replace(reg, function (result) {
            console.log('result', result)
            let expression = result.substring(2, result.length - 2)
            let fn = new Function("obj", `with(obj){return ${expression}}`)
            return fn(data)
        })
    }

    setProp($target, name, value) {
        $target.setAttribute(name, value)
    }

    setProps($target, props) {
        Object.keys(props).forEach(name => {
            if (!this.isCustomProp(name)) {
                this.setProp($target, name, props[name])
            } else {
                this.handleCustomProp($target, name, props[name])
            }

        })
    }

    removeProp($target, name) {
        $target.removeProp(name)
    }

    isCustomProp(name) {
        return /cc-/.test(name)
    }

    handleCustomProp($target, name, value) {
        //DO STUFF
        switch(name){
            case 'cc-reapeat':
                this.repeat($target, value)
        }
    }

}