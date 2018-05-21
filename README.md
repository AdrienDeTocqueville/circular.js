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
    view: '<h1>Hello world</h1>'
});

app.mount();
````
