import Component from '../../src/component/component.js'

let c = new Component({
    tagName: 'hello',
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
})