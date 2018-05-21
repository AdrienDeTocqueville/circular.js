# circular.js
MVC framework written in javascript

## Authors
  - Adrien de Tocqueville
  - Marin Postma
  
## Quickstart
### Basics
Create a basic html page
```html
<html>
    <head>
        <meta charset="UTF-8">
    </head>

    <body>
        <myApp></myApp>
    </body>
    
    <script type="module" src="main.js"></script>
</html>
```

Include the framework in the linked js file

````javascript
import App from '/dist/circular.js'
````

Create an app with a basic view and mount it
````javascript
let app = new App({
    selector: "myApp",
    view: '<h1>Hello world!</h1>'
});

app.mount();
````

### Templating
Let's make use of the template engine.

You can declare data inside a model object and use it inside your html view.
The best part is that your view will automatically update when the variable changes.

````javascript
let app2 = new App({
    selector: "myApp",
    
    view: '<h1>Hello {{myVar}}!</h1>',
    
    model: {
      myVar: "world"
    }
});

app2.mount();
````

Now to make it more dynamic
````javascript
new App({
    selector: "myApp",
    
    view: `
        <div>
            <input c-model="myVar">
            <h1>Hello {{myVar}}!</h1>
        </div>
    `,
    
    model: {
      myVar: "world"
    }
}).mount();
````
The attribute c-model of the input tag will create a two-way data binding between myVar and the input.
It is called a directive and will be exlained in the next paragraph

### Directives
circular defines 6 directives for the user:
  - c-model: Easily create a two-way data binding
  - c-watch: Used to inform circular that the view depends of some variable extern to the model. It will be detailed later.
  - c-bind: Bind the content of a variable to an html attribute
  - c-for: Display a list by iterating on an object or array
  - c-on: Attach a callback to a specific event triggered on an html tag
  - c-if: Render an html tag conditionally

### Components
You can also define components for your app.
````javascript
new App({
    selector: "myApp",
    
    view: `
        <div>
            <h1>See my custom component</h1>
            <greetings></greetings>
        </div>
    `,
    
    model: {
      myVar: "world"
    },
    
    components: {
      greetings: {
        view: '<p>Hello {{$parent.myVar}}! {{message}}</p>',
        model: {
          message: 'How are you ?'
        }
      }
    }
}).mount();
````

A component can also have child components. The variable `$parent` contains a reference to the parent component.

However, you may note that the child components won't get updated when a variable external to the model changes (in this example, it is `$parent.myVar`). To solve this, you must add a `c-watch="$parent.myVar"` attribute to the appropriate tag.



Finally, you can add a controller to your component, which allows you to assign logic to a component.
For the greeting component, you could define: 
````javascript
new App({
    selector: "app",
    
    view: `
        <div>
            <input c-model="myVar">
            <greetings></greetings>
        </div>
    `,
    
    model: {
      myVar: "world"
    },
    
    components: {
        greetings: {
            view: `
                <p c-watch="$parent.myVar">
                    Hello {{capitalize()}}! {{message}}
                </p>`,

            model: {
                message: 'How are you ?'
            },

            controller: {
                capitalize: function() {
                    return this.$parent.myVar.toUpperCase();
                }
            }
        }
    }
}).mount();
````
