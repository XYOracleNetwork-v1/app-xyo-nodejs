#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

// tslint:disable

var passFolder = path.resolve(__dirname, '..', 'config')
var files = fs.readdirSync(passFolder)
const config = process.argv[process.argv.length - 1]
var passFiles = files.filter(f => {
  return f === `${config}.password`
})
if (passFiles.length !== 1) {
  console.error(
    `Missing password file, ${config}.password in config`,
  )
  process.exit(1)
  return
}
const filePath = path.resolve(passFolder, passFiles[0])

const pass = fs.readFileSync(filePath, 'utf8')
process.argv.push(pass)
var main = require('../dist/index.js').main
main(process.argv)
