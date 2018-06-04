import App from '../dist/circular.js'

let app = new App({
    view: `
        <app>
            <h1 c-on:click="cntr++">Home</h1>
            <p c-if="cntr%2 == 1">{{getText(cntr)}}</p>
            <home></home>
        </app>
    `,

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
                    <input c-model:keyup="$parent.obj.txt">
                    <p>{{$parent.cntr}}</p>
                    <h6>{{txt}}</h6>
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