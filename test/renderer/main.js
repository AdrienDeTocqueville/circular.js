import Component from '../../src/component/component.js'

let c = new Component({
    tagName: 'hello',
    template: `
        <div>
            <div c-for="chat in chats">
                <div c-for="i in 9">
                    <p>{{i}} is {{chat}}</p>
                </div>
            </div>

            <ul c-for="arme, type in armes">
                <li>le {{type}} est un {{arme}}</li>
            </ul>
        </div>


        
        
    `,

    model: {
        chats: ['garfield', 'chat de schrodinger', 'chat botté'],
        armes: {
            fusil: "m16",
            pistolet: "1911",
            sniper:"barett"
        }
    }
})