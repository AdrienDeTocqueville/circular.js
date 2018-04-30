export default function domFromString(string) {
    let el = document.createElement('div');
    el.innerHTML = string;
    return el.firstChild;
}


