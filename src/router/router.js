import View from '../view/index.js'
import {Component} from '../component/index.js'
import {extend} from '../utils/index.js'

export default class Router
{
	constructor(params)
	{
		this.app = params.app;
		this.default = params.default || "";
		this.notFound = new View(params.notFound);
		
		this.app.defaultView = null;

		this.routes = [];
		this.route = window.location.hash;


		Component.prototype.$router = this;
		
		this.onHashChange = this.onHashChange.bind(this);

		window.addEventListener('hashchange', this.onHashChange);
		window.addEventListener('DOMContentLoaded', this.onHashChange);
	}

	addRoute(route, view)
	{
	    this.routes.push(
	    {
			url: new RegExp(route, 'gi'),
			view: new View(view)
		});
	}

	onHashChange()
	{
		this.route = window.location.hash || this.default;

		const route = this.routes.filter(route => this.route.match(route.url))[0];

		if (route)
			this.app.show(route.view);
		else
			this.app.show(this.notFound);
	}


	goto(route, data = null)
	{
		console.log("TODO: goto")
		this.from = data;
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