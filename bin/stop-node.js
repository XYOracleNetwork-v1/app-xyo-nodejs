#!/usr/bin/env node

// tslint:disable

var path = require('path')
var fs = require('fs')
var enquirer = require('enquirer')
var shelljs = require('shelljs')

var pidFolder = path.resolve(__dirname, '..', 'pids')

async function main(argv) {
  const optionalArg = argv.length >= 3 ? argv[2] : undefined

  try {
    console.log(pidFolder)
    var files = fs.readdirSync(pidFolder)
    var pidFiles = files.filter((f) => {
      if (optionalArg) return `${optionalArg}.pid` === f
      return f !== 'keep'
    })

    if (pidFiles.length === 0) {
      if (optionalArg) {
        console.log(`No XyoNode process found named ${optionalArg}`)
      } else {
        console.log(`No Xyo Nodes to close`)
      }

      process.exit(0)
    }

    if (pidFiles.length === 1) {
      killProc(pidFiles[0], pidFolder)
      return
    }

    var { pidFile} = await enquirer.prompt({
      type: 'select',
      message: `There are ${pidFiles.length} xyo-node process running. Which do you want to kill?`,
      choices: pidFiles,
      name: 'pidFile'
    })

    killProc(pidFile, pidFolder)
  
  } catch (err) {
    console.error(`There was an error`, err)
  }
}

function killProc(pidFile, pidFolder) {
  const filePath = path.resolve(pidFolder, pidFile)
  const val = fs.readFileSync(filePath, 'utf8')
  shelljs.exec(`kill -2 ${val}`)
  shelljs.rm(filePath)
}

module.exports = {
  killProcess: killProc,
  killAllProcesses: main
}

if(require.main === module) main(process.argv)

