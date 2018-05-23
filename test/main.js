import App from '/dist/circular.js'
import Router from '/dist/router.js'

let app = new App({
    selector: "app",

    stylesheets: ['home.css'],

    model: {
        cntr: 0,
        obj: {
            txt: "bonjour"
        }
    },

    controller: {
        getText: function(counter) {
            return counter ? "Adrien " + this.getText(counter-1): '';
        }
    }
});

let router = new Router({
    app,
    selector: "router",
    defaultRoute: "#home",
    notFoundRoute: '#404'
})

router.addRoute("#home", {
    view: `
        <div>
            <input c-model:change="$parent.obj.txt">
            <child></child>
        </div>
    `,

    model: {
        txt: false
    },

    components: {
        child: {
            view: `
                <p>
                    Hierarchy test {{$parent.txt}}
                </p>
            `
        }
        
    }
})

router.addRoute("#404", {
    view: `
        <div>
            <h1>404: Page not found</h1>
            <h3>Page {{$router.route}} does not exist</h3>
            <button c-on:click="$router.goto('#home')">Home page</button>
            <button c-on:click="$router.back()">Previous page</button>
        </div>
    `
})

app.mount();