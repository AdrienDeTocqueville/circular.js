
/*

VDOM= {
    type: 1 | 3
    tagname,
    children
}
*/


function updateDom(newvnode,oldvnode){
    //TODO:
}


function createElement(node){
    if (node.text){
        node.el = document.createTextNode(text); 
        return node.el;
    } else { 
        const $el = document.createElement(node.tagname);
        node.el = $el;
        setAttributes($el, node.attibutes);
        node.children.map(child => createElement(child)).forEach(element => {
            $el.appendChild(element);
        });
        return $el;
    }

}


function setAttributes(element, attibutes){
    //TODO:
}

