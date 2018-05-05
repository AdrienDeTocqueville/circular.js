import {extend} from '../utils/index.js'

export default class Router
{
	constructor(defaultRoute)
	{
		this.routes = [];
		this.defaultRoute = defaultRoute || "";
		
		this.route = window.location.hash;

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

	goto(route, data = null){
		this.from = data;
		window.location.hash = route;
	}

	onHashChange()
	{
		this.route = window.location.hash;
		if (!this.route.length)
			this.route = window.location.hash = this.defaultRoute;

		for (let route of this.routes)
		{
			if ( this.route.match(route.url) )
			{
				if (!route.component){
					route.component = route.factory.create(route.node, this);
				} else{
					route.component.display();
				}
			}
			else if (route.component)
				route.component.hide();
		}

		this.from = null;
	}
}