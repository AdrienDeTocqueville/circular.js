export default class Router
{
	constructor(defaultURL)
	{
		this.routes = [];
		this.defaultURL = defaultURL || "";

		const doHashChange = () => { this.onHashChange(); };

		window.addEventListener('hashchange', doHashChange);
		document.addEventListener('DOMContentLoaded', doHashChange);
	}

	addRoute(url, factory, node)
	{
	    this.routes.push(
	    {
			url: new RegExp(url, 'gi'),
			component: null,
			factory,
			node
		});
	}

	onHashChange()
	{
		let hash = window.location.hash;
		if (!hash.length)
			window.location.hash = hash = this.defaultURL;

		for (let route of this.routes)
		{
			if ( hash.match(route.url) )
			{
				if (!route.component)
					route.component = route.factory.create(route.node);
				else
					route.component.display();
			}
			else if (route.component)
				route.component.hide();
		}
	}
}