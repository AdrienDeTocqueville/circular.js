import App from '/dist/circular.js'

let app = new App();

app.component("navbar", {
    template: `
        <ul>
            <li c-for="link in links">
                <a c-bind:class="($router.route==link.url)?'active':'none'" c-bind:href="link.url">{{link.label}}</a>
            </li>
        </ul>
    `,

    model: {
        links: [
            {
                label: 'Home',
                url: '#home'
            },
            {
                label: 'News',
                url: '#news'
            },
            {
                label: 'Contact',
                url: '#contact'
            },
            {
                label: 'About',
                url: '#about'
            }
        ]
    }
});

app.component("home", {
    template: `
        <div>
            <p>Home</p>
            <button c-on:click="$router.goto('#contact', {chat: 10})">Go to contact</button>
            <input c-on:keyup="text = e.target.value"/>
            <p>{{text}}</p>

            <p c-if="text == 'Adrien'">On m'a appelé ?</p>
        </div>
    `,
    model: {
        text: ""
    }
    
});

app.component("news", {
    template: `
        <p>News</p>
    `,
});

app.component("contact", {
    template: `
        <div>
            <h1>contact</h1>
            <button >click here</button>
        </div>
    `,
    methods: {
        onDisplay(params) {
            console.log(params? params.chat: "no chat available")
        }
    },
    model: {
        chat: false
    }
});

app.component("about", {
    template: `
        <p>About</p>
    `,
});

app.mount("#app");