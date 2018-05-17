import App from '/dist/circular.js'

let app = new App({
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
                    <button c-on:click='obj.txt += "r"'>Ajouter un r</button>
                    <p>{{obj.txt}}</p>
                </div>
            `,
            model: {
                obj: {
                    txt: "bonjour"
                }
            }
        }
    }
});

app.mount("#app");