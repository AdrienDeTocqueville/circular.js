

let app = new App('app')

app.add({
    tagname: "choop",
    model: {
        name: 'marin',
        age: 12
    },
    template: `
    <div>
    <input type="text" placeholder='name'>
        <p class='hello'>My name is {{model.name}} i am {{model.age}}</p>
        <p>my age is {{(Math.random()/10)+14}}</p>
        <button>click me</button>
        <button>or me</button>
        <button>or me</button>
        <test></test>
    </div>
    
    `,
    onLoad() {
        this.listen('input', 'change', (e) =>{
            model.name = e.target.value
        })

    }
})

app.add({
    tagname: 'test',
    template:`
        
    <ul cc-for="cat in model.cats" >
    <li>{{name}} loves {{food}} </li>
</ul>
    `,
    model: {
        name: 'blop',
        cats: [
            {
                name: 'choki',
                food: 'fish'
            },
            {
                name: 'garfield',
                food: 'lasagnas'
            }
        ]
    },
    chop(){
        return 'lol'
    }
})


app.add({
    tagname: "choop2",
    model: {
        name: 'marin',
        age: 0
    },
    template: `
    <div>
    <input type="text" placeholder='name'>
        <p>My name is {{model.name}}</p>
        <p>my age is {{model.age}}</p>
        <button>click me</button>
        <button>or me</button>
        <button>or me</button>
    </div>
    
    `,
    onLoad() {
        this.listen('input', 'change', (e) => {
            this.model.name = e.target.value
        })
        this.listenAll('button', 'click', () => {
            this.model.age++
            console.log(this.model.age)
        })
    }
})

