#!/usr/bin/env node

// tslint:disable

var main = require('../dist/index.js').main;
console.log(`Cmd: ${process.argv}`)
main(process.argv);