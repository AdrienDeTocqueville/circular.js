import App from '/dist/circular.js'
import Router from '/dist/router.js'

let app = new App({
    model: {
        cntr: 0,
        obj: {
            txt: "bonjour"
        }
    },

    controller: {
        getText: function(counter) {
            return counter ? this.obj.txt + this.getText(counter-1): '';
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
    stylesheets: ['home.css'],

    view: `
        <home>
            <input c-model:change="$parent.obj.txt">
            <p>{{$parent.cntr}}</p>
            <h6>{{txt}}</h6>
            <child></child>
        </home>
    `,

    model: {
        txt: "success"
    },

    components: {
        child: {
            view: `
                <p c-on:click="$parent.txt = $parent.txt.toUpperCase()">
                    Hierarchy test: {{$parent.txt}}
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