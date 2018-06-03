import App from '/dist/circular.js'

let app = new App({
    model: {
        cntr: 1,
        obj: {
            txt: "bonjour"
        },
        txt: 'Home'
    },

    controller: {
        getText: function(counter) {
            return counter ? this.obj.txt + this.getText(counter-1): '';
        }
    },

    components: {
        home: {
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
        }
    }
}).mount("app");