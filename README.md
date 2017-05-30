# React - Weatherapp Demo


### Preview
[Click here](https://weatherapp-react-demo.herokuapp.com/)

 
Install instructions:
  - Clone this repo, install dependencies, then start
```sh
git clone https://github.com/allenRoyston/react-weatherapp.git
$ cd react-weatherapp
$ npm install
$ npm start
```
  - Open up a browser of your choice (Chrome/Firefox/etc) and enter the url:  
```sh
http://localhost:3000/
```


### Additional stuff
- Grunt (if you're using it) will watch for changes on any html/css/js and refresh the browser automatically.
- Typescript will convert any .ts into .js automatically.
- Jade files can automatically be converted into HTML if using the Atom Plugin: Jade Auto-compiler.  
- A very simple global variable is setup on the index page that can be accessed throught the entire site.  To access it (anywhere, regardless of script or component):  
```sh
$ console.log(_root.global)

// will return: 
/*
    _root = {
      globals: {
        enviroment: [production/development],
        isMobile: [true/false],
        isIphone: [true/false],
        isIpad: [true/false],
        isAndroid: [true/false],
        userAgent: [string]
      }
    }
*/
```
##### This feature can be removed entirely by removing it from the route/index.jade
