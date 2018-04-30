
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
        return document.createTextNode(text);
    } else { 
        const $el = document.createElement(node.tagname);
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

