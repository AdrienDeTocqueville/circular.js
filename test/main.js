import App from '/dist/circular.js'

let app = new App({
    model: {
        cntr: 3,
        obj: {
            txt: "bonjour"
        }
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
                </home>
            `,
        
            model: {
                txt: false
            }
        }
    }
}).mount("app");