export default class Router
{
	constructor()
	{
		this.routes = [];

        const doHashChange = () => { this.onHashChange(); };

        window.addEventListener('hashchange', doHashChange);
        document.addEventListener('DOMContentLoaded', doHashChange);
	}

	addRoute(url, component, element)
	{
	    this.routes.push(
	    {
            url,
			component,
			element
        });
	}

	onHashChange()
	{
        var hash = window.location.hash;
		if (!hash.length)
			window.location.hash = hash = "";

        var routes = this.routes.filter(route => hash.match(new RegExp(route.url, 'gi')));

		if (routes.length)
		{
			for (let route of routes)
			{
				// TODO: register component to list of active elements for destruction
				route.component.instantiate(route.element);
			}
		}
	}
}