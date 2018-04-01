

let app = new App('app')
app.add({
    tagname: "choop",
    model: {
        //name: 'marin',
        age: 12
    },
    templateURL: "http://localhost:3000/choopTemplate.html",
    onLoad(model) {
        this.listen('input', 'change', (e) =>{
            model.name = e.target.value
        })
        this.listen('button', 'click', () => {
            this.model.age++
        })

        setTimeout(()=>{model.name = 'jean'}, 3000)
    },
    say(){
        
    }
})

app.add({
    tagname: 'test',
    template:`
        <p>test {{$scope.chop()}}</p>
    `,
    model: {
        name: 'blop'
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
    templateURL: "choop2template.html",
    onLoad() {
        this.listen('input', 'change', (e) => {
            this.model.name = e.target.value
        })
        this.listenAll('button', 'click', () => {
            this.model.age++
        })
    }
})


app.add({
    tagname: "cats",
    template:`
    <div>
        <p> hello {{$scope.model.catName}}</p>
        <input type="text" cc-bind="catName" placeholder="cat name">
        <input type="text" cc-bind="favFood" placeholder="Fav food">
        <button class='add-btn'>add</button>
        <button class='remove-btn'>remove</button>
        <ul cc-repeat="$cat in $scope.model.cats">
            <li>i am  {{$cat.name}} and i like {{$cat.food}}</li>
        </ul>
    </div>
    `,

    model:{
        name: "marin",
        cats:[
           
        ]
    },
    onLoad(){
        this.listen('.add-btn', 'click', (e) => {
            this.model.cats.push({name: this.model.catName, food: this.model.favFood})
        })

        this.listen('.remove-btn', 'click', (e) => {
            this.model.cats.pop()
        })
    }
})

