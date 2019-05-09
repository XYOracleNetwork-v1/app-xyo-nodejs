#!/usr/bin/env node

// tslint:disable

var App = require('../dist/index.js').App;
console.log(`Cmd: ${process.argv}`)
const app= new App()
app.main(process.argv);