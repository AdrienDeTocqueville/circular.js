/**
 * 
 * @param {ASTElement} ASTElement 
 * @param {string} property 
 * 
 * @returns {string} 
 * 
 * removes the given attribute from attibute list and returns it's value
 */
export function getAndRemoveAttribute(ASTElement, key)
{
    let attrib = ASTElement.attribs[key];
    if (attrib)
    {
        ASTElement.attribs.removeNamedItem(key)
        return attrib;
    }
}