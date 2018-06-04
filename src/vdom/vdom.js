/**
 * 
 * @param {VNode} newNode
 * @param {VNode} oldNode
 * 
 * Analyze VDOM modifications to update DOM. Recursive.
 */
export default function updateTree(newNode, oldNode)
{
	if (oldNode)
		patch(newNode, oldNode);
	else
		newNode.createElement();


	if (newNode.children)
	{
		let currO = 0, currN = 0, currC = 0;
		let childNodes = newNode.el.childNodes;

		let o = oldNode ? oldNode.children: [];
		let n = newNode.children;
		let c = lcs(o, o.length, n, n.length);


		for (; currN < n.length; currN++)
		{
			n[currN].parent = newNode;

			if (currC < c.length && n[currN].tagName == c[currC].tagName) // Node needs to be updated
			{
				while (o[currO].tagName != n[currN].tagName) // Removes deleted children
				{
					if (o[currO].isRoot())
						console.log("on hide", o[currO].tagName);

					newNode.el.removeChild(o[currO].el);
					currO++;
				}

				updateTree(n[currN], o[currO]);

				if (n[currN].isRoot())
					console.log("on show", n[currN].tagName);


				if (currN >= childNodes.length)
					newNode.el.appendChild(n[currN].el);
				else if (n[currN].el != o[currO].el)
					newNode.el.replaceChild(n[currN].el, o[currO].el);

				currO++; currC++;
			}
			else // Node needs to be created
			{
				updateTree(n[currN]);

				if (n[currN].isRoot())
					console.log("on show", n[currN].tagName);


				if (currN >= childNodes.length-1)
					newNode.el.appendChild(n[currN].el);
				else
					newNode.el.insertBefore(n[currN].el, childNodes[currN+1]);
			}
		}

		// Remaining children need to be removed
		while (currO < o.length)
		{
			if (o[currO].isRoot())
				console.log("on hide", o[currO].tagName);

			newNode.el.removeChild(newNode.el.lastChild);
			currO++;
		}
	}
}

/**
 * 
 * @param {array} a old vnodes
 * @param {integer} al length of array a
 * @param {array} b new vnodes
 * @param {integer} bl length of array b
 * 
 * @returns {array} longest common subsequence of vnodes
 * 
 * https://en.wikipedia.org/wiki/Longest_common_subsequence_problem
 * returns the longest subsequence of vnodes common to a and b
 * (some of these nodes may still need an update)
 */
function lcs(a, al, b, bl)
{
    if (al == 0 || bl == 0)
        return [];

    if (a[al-1].tagName == b[bl-1].tagName || (a[al-1].factory && b[bl-1].factory && (a[al-1].componentTag == b[bl-1].tagName)))
        return lcs(a, al-1, b, bl-1).concat(b[bl-1]);

    var x = lcs(a, al, b, bl-1);
    var y = lcs(a, al-1, b, bl);
    return (x.length > y.length) ? x : y;
}

/**
 * 
 * @param {VNode} a new vnode
 * @param {VNode} b old vnode
 * 
 * Generates, modifies or copies the new DOM Node from the old one
 */
function patch(a, b)
{
	if (a.type == b.type || (a.factory && b.factory))
	{
		switch (a.type)
		{
			case 1: // element
				// This case is not very efficient
				let updated = false;
				if ((a.tagName != b.tagName)
				|| (a.listeners || b.listeners)
				|| (JSON.stringify(a.attributes) != JSON.stringify(b.attributes)))
					updated = true;

				// else if (a.model || b.model)
				// {
				// 	if (!a.model || !b.model)
				// 		updated = true;
				// 	else if ((a.model.on != b.model.on) || (a.model.var != b.model.var))
				// 		updated = true;
				// }

				if (updated)
					a.createElement();
				else
					a.el = b.el;

				return;

			case 2: // comment
				a.el = b.el;
				return;

			case 3: // text
				a.el = b.el;
				a.el.nodeValue = a.text;
				return;

			case 4: // component
				a.component = b.component;
                a.component.$vroot = a;

                a.copyComponent(b);

				a.el = b.el;
				return;

			default:
				console.error("Unknown vnode type", a.type);
				consle.error(a, b);
		}
	}
	else // Nothing to optimize
		a.createElement();
}