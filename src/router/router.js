export default class Router
{
	constructor()
	{
		this.routes = [];

		const doHashChange = () => { this.onHashChange(); };

		window.addEventListener('hashchange', doHashChange);
		document.addEventListener('DOMContentLoaded', doHashChange);
	}

	addRoute(url, component, node)
	{
	    this.routes.push(
	    {
			url: new RegExp(url, 'gi'),
			instance: null,
			component,
			node
		});
	}

	onHashChange()
	{
		let hash = window.location.hash;
		if (!hash.length)
			window.location.hash = hash = "";

		for (let route of this.routes)
		{
			if ( hash.match(route.url) )
			{
				if (!route.instance)
					route.instance = route.component.clone(route.node);
			}
			else if (route.instance)
			{
				route.component.destroy(route.instance);
				route.instance = null;
			}
		}
	}
}