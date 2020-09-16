#!/usr/bin/env node

const deepTouch = require('../src/index');
const commander = require('commander');
const json = require('../package.json');

commander.version(json.version)
commander.arguments('<fileName...>')
         .option('-p,--path <path>','the path of directory which the new file belong to')
         .action((fileName,cmdObj)=>{
             deepTouch(fileName,cmdObj.path)
         })

commander.parse(process.argv)