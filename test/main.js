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

    view: `
        <div>
            <h1>Home</h1>
            <button c-on:click='cntr++'>Encore un</button>
            <p c-if="cntr!=4" c-on:click="obj.txt += obj.txt">{{getText(cntr)}}</p>
            <p c-if="cntr==4" c-on:click="obj = {txt: 2, zeg: {ze: 3}}">Ou suis-je ?</p>
            {{obj.txt}}
            <router></router>
        </div>
    `,

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
            <button c-on:click='test++'>Clic</button>
            <h3>{{test}}</h3>
        </div>
    `,

    model: {test: 0}
})

router.addRoute("#404", {
    model: {test: 0},

    view: `
        <div>
            <h1>404: Page not found</h1>
            <more></more>
        </div>
    `,

    components: {
        more: {
            view: `
                <div>
                    <h3>Page {{$router.route}} does not exist</h3>
                    <button c-on:click="$router.goto('#home')">Home page</button>
                    <button c-on:click="$router.back()">Previous page</button>
                </div>
            `
        }
    }
})

app.mount();