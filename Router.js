


class Router {

    constructor(app){
        this.app = app
        this.routes = {}
        document.addEventListener('hashchange', {

        })
    }

    addRoute(url, componentName){
        this.routes[url] = componentName
    }

    route(){

    }
}