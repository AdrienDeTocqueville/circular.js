import {
    _v,
    toFunc
} from './functions'


export function virtualify(node) {

    if (node.nodeType == '3') return toFunc(node.nodeValue)

    let type = node.localName
    let props = vProps(node.attributes)
    let children = vChild(node.childNodes)
    
    return _v(type, props, children)
}


function vChild(childNodes) {
    let children = []
    Array.prototype.slice.call(childNodes)
        .forEach(child => {
            let newnode = virtualify(child, data)
            if (!(typeof newnode === 'string' && newnode.trim() == '')) {
                children.push(newnode)
            }
        })
    return children
}

function vProps(attributes) {
    let props = {}
    Array.prototype.slice.call(attributes)
        .forEach(att => {
            let value = toFunc(att.nodeValue)
            let name = att.nodeName
            props[name] = value
        })
    return props
}