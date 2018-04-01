


export class Beard {


    constructor(component) {
        this.$el = component.$element
        this.component = component

    }

    make() {
        let self = this
        return new Promise((resolve, reject) => {
            this.fetchTemplate()
                .then(res => {
                    this.template = this.domify(res)
                    this.render()
                    resolve()
                })
        })
    }

    render() {
        if (!this.template) return
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
        if ($parent){

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
    }

    realify(node) {
        if (typeof node === 'string') {
            return document.createTextNode(node)
        }
        const $element = document.createElement(node.type)
        if ("cc-bind" in node.props && node.type == 'input') {
            $element.addEventListener('change', e => {
                this.component.model[node.props["cc-bind"]] = e.target.value
            })
        }

        let ons = this.ownPropsByRegex(node.props, /cc-on:/)
        if (ons) {
            ons.forEach(key => {
                let expression = node.props[key]
                let event = /\w*$/.exec(key)[0].trim()
                let fn = new Function("scope", `{
                    let $scope = scope;
                    ${expression};
                }`)
                $element.addEventListener(event, e => fn(this.component))

            })
        }
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
        let repeat = false

        //checks if textnode
        if (node.nodeType == '3') {

            return this.evaluate(node.nodeValue, data)

        }


        Array.prototype.slice.call(node.attributes)
            .forEach(att => {
                if (att.nodeName == 'cc-repeat') {
                    repeat = true
                    children = []
                    let expression = att.nodeValue
                    let child = node.childNodes[0]
                    children = this.ccrepeat(expression, child, data)
                } else if (att.nodeName == 'cc-if') {
                    return
                } else {
                    props[att.nodeName] = att.nodeValue
                }
            })

        if (!repeat)
            Array.prototype.slice.call(node.childNodes)
            .forEach(child => {
                let newnode = this.virtualify(child, data)
                if (!(typeof newnode === 'string' && newnode.trim() == '')) {
                    children.push(newnode)
                }
            })


        return this._v(type, props, children)
    }

    evaluate(string, data) {
        let reg = /{{.*?}}/g //update to capture more
        let self = this
        return string.replace(reg, function (result) {
            let expression = result.substring(2, result.length - 2)
            let obj = /\$\w*/.exec(expression)
            let scope = (obj == "$scope") ? self.component : data
            let fn = new Function("obj", `
            let ${obj || "data"} = obj;
            return ${expression}
             `)
            let res = fn(scope)
            return (typeof res === 'undefined') ? '' : res
        })
    }

    setProp($target, name, value) {
        $target.setAttribute(name, value)
    }

    setProps($target, node) {
        Object.keys(node.props).forEach(name => {
            if (!this.isCustomProp(name)) {
                this.setProp($target, name, node.props[name])
            }
        })
    }

    removeProp($target, name) {
        $target.removeProp(name)
    }

    isCustomProp(name) {
        return /cc-/.test(name)
    }

    ccrepeat(expression, child, data, ) {
        let expr = expression.split(" ")
        let self = this
        return new Function("child", "data", "self", `
            let children =[];
            const $scope = self.component;
            let count = 0
            for (${expr[0]} of ${expr[2]}){
                count++;
               const newChild = self.virtualify(child, ${expr[0]});
                children.push(newChild);

            }
            return children;
        `)(child, data, this)
    }

    ownPropsByRegex(o, reg) {
        let props = []
        Object.keys(o).forEach(key => {
            if (key.match(reg)) props.push(key)
        })
        return props
    }


    fetchTemplate() {
        let url = this.component.templateURL || null
        let templateString = this.component.template || null
        return new Promise((resolve, reject) => {
            if (templateString) {
                resolve(templateString)
            } else if (url) {
                fetch(url)
                    .then(res => {
                        resolve(res.text())
                        }
                    )
            } else {
                reject("no template found")
            }
        })
    }
}