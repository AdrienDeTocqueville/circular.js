import {Component, ComponentFactory} from '../component/index.js'

export default class Router
{
	constructor(params)
	{
		if (!params.app)
			console.error("router: app must be sent as parameter");

		this.app = params.app;
		this.selector = params.selector || "router";
		
		this.defaultRoute = {
			url: params.defaultRoute || ""
		};
		this.notFoundRoute = {
			url: params.notFoundRoute || ""
		};

		this.routes = [];
		this.route = window.location.hash;
		this.current = undefined;


		this.app.root.factories = {};
		this.app.root.factories[this.selector.toUpperCase()] = this;
		Component.prototype.$router = this;

		this.onHashChange = this.onHashChange.bind(this);

		window.addEventListener('hashchange', this.onHashChange);
	}

	addRoute(route, component)
	{
		let newRoute = {
			url: new RegExp(route, 'gi'),
			stylesheets: this.buildStylesheets(component.stylesheets),
			factory: new ComponentFactory(component),
			component: null
		};

	    this.routes.push(newRoute);

		if (!this.defaultRoute.route && this.defaultRoute.url.match(newRoute.url))
			this.defaultRoute.route = newRoute;

		if (!this.notFoundRoute.route && this.notFoundRoute.url.match(newRoute.url))
			this.notFoundRoute.route = newRoute;

		if (!this.current)
			this.onHashChange();
	}

	buildStylesheets(stylesheets)
	{
		return stylesheets? stylesheets.map(file => {
			var el = document.createElement("link");
				el.setAttribute("rel", "stylesheet");
				el.setAttribute("type", "text/css");
				el.setAttribute("href", file);

        	return el;
		}): [];
	}

	onHashChange()
	{
		this.route = window.location.hash;

		if (!this.route)
		{
			console.log("default route", this.route);
			this.current = this.defaultRoute.route;
			return;
		}

		for (let route of this.routes)
		{
			if (this.route.search(route.url) != -1)
			{
				if (route == this.current)
					return;

				var match = route;
				break;
			}
		}
		console.log("m", match)

		if (match)
		{
			console.log("route match", this.route);

			if (this.current)
			{
				console.log("router hide", this.current);
			}

			this.params = match.url.exec(this.route);
			this.current = match;
			// this.show(match);
		}
		else
		{
			console.log("route unknown", this.route);

			match = this.routes.filter(route => this.notFoundRoute.match(route.url))[0];
			this.current = match;
			// match && this.show(match);
		}
	}

	create(parent)
	{
		// if (!this.current.component)
		// 	this.current.component = this.current.factory.create(parent);

		return this.current.factory.create(parent);
		// if (this.currentComponent)
		// {
		// 	this.currentComponent._hide(this.node);
		// 	this.currentComponent = null;
		// }

		// route.component._show(this.node);
		// this.currentComponent = route.component;
	}

	goto(route)
	{
		window.location.hash = route;
	}

	back()
	{
		history.back();
	}

	forward()
	{
		history.forward();
	}
}