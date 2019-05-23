#!/usr/bin/env node

// tslint:disable

var App = require('../dist/index.js').App;
const app= new App()
app.main(process.argv);