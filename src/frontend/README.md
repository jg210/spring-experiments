The top-level [README](../../README.md) explains how this [Create React App](https://facebook.github.io/create-react-app/) project fits into the enclosing [Spring](https://spring.io/) project.

## Development Build Instructions
Install nodenv and node-build (or use any other way to put correct version of node on PATH):

* https://github.com/nodenv/nodenv#installation
* https://github.com/nodenv/node-build#installation

```
nodenv install $(cat .node-version)
npm install
npm start
```

View the application using:

http://localhost:3000/

## Release Build Instructions

Build using the enclosing gradle project.

## Development Environment

Same as Development Build Instructions, but also need to:

* Install Visual Studio Code (VSC).

* Accept "workspace recommendations" in VSC to install required plugins.

* Restart VSC after installing plugins, otherwise chrome debugger doesn't work.

* Install Google Chrome (for debugging with VSC).

* Install React Developer Tools in Chrome.
