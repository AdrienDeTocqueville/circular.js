import {domFromString, parseDOM} from "../../src/parser/domparser.js"
import {getRenderer, getFunctions} from "../../src/renderer/renderer.js"

var elem = document.querySelector("#test");
var src = document.querySelector("#test").innerHTML;

var dom = domFromString(src);
var ast = parseDOM(dom);

var renderer = getRenderer(ast);

console.log(renderer);