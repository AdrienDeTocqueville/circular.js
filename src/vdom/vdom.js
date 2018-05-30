/**
 * @description for rendering, root element should be added to component's element
 */

function updateDOM(nvnode, ovnode)
{
    if (!ovnode) {
        nvnode.createElement();
    }
    else if (!nvnode) {
        ovnode.el.remove();
    }
    else if (haschanged(nvnode, ovnode)) {
        nvnode.createElement();
        ovnode.el.parentElement.replaceChild(nvnode.el, ovnode.el)
    }
    else {
        nvnode.el = ovnode.el;

        if (nvnode.children)
        {
            const nl = nvnode.children.length
            const ol = ovnode.children.length
            for (let i = 0; i < nl || i < ol; i++) {
                updateDOM(nvnode.children[i], ovnode.children[i])
            }
        }
    }
}

/**
 * @description return true if node changed
 * @param {*} node1 
 * @param {*} node2 
 */
function haschanged(node1, node2)
{
    let test = (node1.tagName !== node2.tagName)
            || (node1.factory !== node2.factory)
            || (node1.isEmpty !== node2.isEmpty)
            || (node1.text !== node2.text)
            || (JSON.stringify(node1.attributes) !== JSON.stringify(node2.attributes));

    return test;
}

export default function updateTree(newNode, oldNode)
{
	if (newNode.children)
	{
		let o = oldNode ? oldNode.children: [];
		let n = newNode.children;
		let d = childDiff(o, n);

		let currO = 0;
		let currD = 0;

		for (let newChild of n)
		{
			if (currD < d.length && newChild.tagName == d[currD].tagName)
			{
				while (o[currO].tagName != newChild.tagName)
				{
					if (o[currO].isRoot())
						console.log("on hide", o[currO].tagName);

					currO++;
				}

				updateTree(newChild, o[currO]);

				currO++;
				currD++;
			}
			else
			{
				updateTree(newChild);
				if (newChild.isRoot())
					console.log("on show", newChild.tagName);
			}

		}

		while (currO < o.length)
		{
			if (o[currO].isRoot())
				console.log("on hide", o[currO].tagName);

			currO++;
		}
	}


	if (oldNode && !diff(oldNode, newNode))
	{
		newNode.el = oldNode.el;

		while (newNode.el.lastChild)
		newNode.el.removeChild(newNode.el.lastChild);
	}
	else
		newNode.createElement();


	if (newNode.children)
	{
		for (let child of newNode.children)
		{
			child.parent = newNode;
			newNode.el.appendChild(child.el);
		}
	}
}

function childDiff(a, b)
{
	return lcs(a, a.length, b, b.length);
}

function lcs(a, al, b, bl)
{
    if (al == 0 || bl == 0)
        return [];

    if (a[al - 1].tagName == b[bl - 1].tagName)
        return lcs(a, al-1, b, bl-1).concat(a[al - 1]);

    var x = lcs(a, al, b, bl-1);
    var y = lcs(a, al-1, b, bl);
    return (x.length > y.length) ? x : y;
}

function diff(a, b)
{
	if (a.type != b.type)
		return true;
		
	switch (a.type)
	{
		case 1: // element
			if ((a.tagName != b.tagName)
			|| (a.listeners || b.listeners)
			|| (JSON.stringify(a.attributes) != JSON.stringify(b.attributes)))
				return true;

			if (a.model || b.model)
			{
				if (a.model && b.model)
				{
					if ((a.model.on != b.model.on) || (a.model.var != b.model.var))
						return true;
				}
				else
					return true;
			}

			return false;
			
		case 2: // comment
			return false;
		
		case 3: // text
			return a.text !== b.text;
	}
}