

export function _v(type, props, children) {
    return {
        type,
        props,
        children
    }
}

export function toFunc(string) {
    let str = "'" + string
    str = str.replace(/{{/g, "'+")
    str = str.replace(/}}/g, "+'")
    str += "'"
    let f = new Function('model', `
        return ${str}
    `)
    return f
}