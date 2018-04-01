class Beard {


    constructor(component) {
        this.$el = component.$element
        this.component = component
        this.template = this.domify(this.component.template)
    }

    render() {
        let newDom = this.virtualify(this.template, this.component)
        this.updateElement(this.$el, newDom, this.DOM || null)
        this.DOM = newDom
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
        this.setProps($element, node)
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
        templateString = templateString.replace(/>\s*</g, '><')
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

    virtualify(node, data) {

        var children = []
        let type = node.localName
        let props = {}

        //checks if textnode
        if (node.nodeType== '3') {
            console.log(node, "data", data)
            return this.evaluate(node.nodeValue, data)

        }
        let attributes = Array.prototype.slice.call(node.attributes)
            .forEach(att => {
                if (this.isCustomProp(att.nodeName)) {
                    if (node.children.length != 1) throw 'cc-for directive node should have unique child'
                    let child = node.childNodes[0]
                 
                    children = []
                    let expr = att.nodeValue
                   
                    if (/\w\s{1}in\s{1}[\w.]/.test(expr)) {
                        expr = expr.split(" ")
                        let obj = eval('data.' + expr[2])
                        obj.map(o => children.push(this.pushNewNode(child, o)))
                    }
                } else {
                    props[att.nodeName] = att.nodeValue
                }
            })

        let childnodes = Array.prototype.slice.call(node.childNodes)
            .forEach(child => children.push(this.pushNewNode(child, data)))
        return this._v(type, props, children)
    }

    pushNewNode(child, data){
        let newnode = this.virtualify(child, data)
                if (!(typeof newnode === 'string' && newnode.trim() == '')) {
                    return newnode
                }
    }

    evaluate(string, data) {
        let reg = /{{.*?}}/g //update to capture more
        return string.replace(reg, function (result) {
            let dat = data
            let expression = result.substring(2, result.length - 2)
            let fn = new Function("obj", `with(obj){
                
                return ${expression}
            }`)
            return fn(dat)
        })
    }

    setProp($target, name, value) {
        $target.setAttribute(name, value)
    }

    setProps($target, node) {
        Object.keys(node.props).forEach(name => {
                this.setProp($target, name, node.props[name])
        })
    }

    removeProp($target, name) {
        $target.removeProp(name)
    }

    isCustomProp(name) {
        return /cc-/.test(name)
    }




}