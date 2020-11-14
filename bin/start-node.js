#!/usr/bin/env node

var App = require('../dist/index.js').App
const app = new App()
app.main(process.argv)
