/**
 * for rendering, root element should be added to component's element
 * 
 */

export default function updateDOM(nvnode, ovnode) {
    let root;
    
    if (!ovnode) {
        if (nvnode.isRoot) {
            createElement(nvnode);
        } else {
            nvnode.parent.el.appendChild(nvnode.el);
        }
    } else if (!nvnode) {
        ovnode.el.remove();
    } else if (haschanged(nvnode, ovnode)) {

        nvnode.parent.el.replaceChild(createElement(nvnode), ovnode.el)
    } else if (nvnode.children) {
        nvnode.el = ovnode.el;
        const nl = nvnode.children.length
        const ol = ovnode.children.length
        for (let i = 0; i < nl || i < ol; i++) {
            updateDOM(nvnode.children[i], ovnode.children[i])
        }
    }
}

/**
 * @description return true if node changed
 * @param {*} node1 
 * @param {*} node2 
 */
function haschanged(node1, node2) {
    let test = typeof node1 !== typeof node2 ||
   ( node1.text && node1 !== node2 )||
    node2.type !== node1.type; 

    if(node1.attributes && node2.attributes){
        return JSON.stringify(node1.data.attributes) !== JSON.stringify(node2.data.attributes) || test;
    }

    return test;
        
}

function createElement(node) {
    if (node.text) {
        node.el =  document.createTextNode(node.text);
        return node.el;
    } else {
        const $el = document.createElement(node.tagName);
        node.el = $el;
      
        setAttributes($el, node.data.attributes);
        setEventListeners($el, node.data.listeners);
        
        node.children.map(child => createElement(child)).forEach(element => {
            $el.appendChild(element);
        });
        return $el;
    }
}


function setAttributes(element, attributes) {
    for (let attribute in attributes) {
        element.setAttribute(attribute, attributes[attribute]);
    }
}

function setEventListeners(element, listeners) {
    for (let event in listeners) {
        element.addEventListener(event, listeners[event]);
    }
}