import App from '/dist/circular.js'
import Router from '/dist/router.js'

let notFound = {
    body: `
        <div>
            <h1>404: Page not found</h1>
            <more></more>
        </div>
    `,

    components: {
        more: {
            template: `
                <div>
                    <h3>Page {{$router.route}} does not exist</h3>
                    <button c-on:click="$router.goto('#home')">Home page</button>
                    <button c-on:click="$router.back()">Previous page</button>
                </div>
            `
        }
    }
}

let app = new App({notFound: {body: '<h3>Page not found</h3>'}});
let router = new Router({app, default: '#home', notFound});

router.addRoute('^#home$', {
    stylesheets: ['home.css'],

    body: `
        <div>
            <h1>Bonjour</h1>
            <home></home>
        </div>
    `,

    components: {
        home: {
            template: `
                <div>
                    <h1>Home</h1>
                    <button c-on:click='cntr++'>Encore un</button>
                    <p c-if="cntr!=4" c-on:click="obj.txt += obj.txt">{{getText(cntr)}}</p>
                    <p c-if="cntr==4" c-on:click="obj = {txt: 2, zeg: {ze: 3}}">Ou suis-je ?</p>
                    {{obj.txt}}
                </div>
            `,
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
        }
    }
});

app.mount("#app");