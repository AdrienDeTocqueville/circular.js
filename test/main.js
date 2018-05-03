import App from '../../src/app/app.js'

let app = new App();

app.component("navbar", {
    template: `
        <ul>
            <li c-for="link in links">
                <a id="bonjou" class="test" c-bind:href="link.url">{{link.label}}</a>
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
        <p>Home</p>
    `,
});

app.mount("#app");