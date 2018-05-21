# circular.js
MVC framework written in javascript

## Authors
  - Adrien de Tocqueville
  - Marin Postma
  
## Basics
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

## Templating
Let's make use of the template engine.\n
You can declare data inside a model object and use it inside your html view

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
      <input c-model="myVar">
      <h1>Hello {{myVar}}!</h1>
    `,
    
    model: {
      myVar: "world"
    }
}).mount();
````
The attribute c-model of the input tag will create a two-way data binding between myVar and the input.
It is called a directive and will be exlained in the next paragraph

## Directives
circular defines 6 directives for the user:
  - c-model: Easily create a two-way data binding
  - c-watch: Used to inform circular that the view depends of some variable extern to the model. It will be detailed later.
  - c-bind: Bind the content of a variable to an html attribute
  - c-for: Display a list by iterating on an object or array
  - c-on: Attach a callback to a specific event triggered on an html tag
  - c-if: Render an html tag conditionally
