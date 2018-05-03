import App from '../../src/app/app.js'
import Router from '../../src/router/router.js';

/*
let router = new Router({
    routes: {
        // "^#/room/(.*)$": "hello" // Additional way to specify route
    }
});
*/

let app = new App();

app.component("hello", {
    template: `
        <div>
            <div c-for="chat in chats">
                <p id="test" c-for="i in 2">
                    {{chat}} {{i}} fois
                </p>
            </div>

            <ol>
                <li c-for="arme, type in armes">Le {{arme}} est un {{type}}</li>
            </ol>
        </div>
    `,

    model: {
        chats: ['garfield', 'chat de schrodinger', 'chat botté'],
        armes: {
            fusil: "m16",
            pistolet: "desert eagle",
            sniper:"barett"
        }
    }
});

app.mount("#app");