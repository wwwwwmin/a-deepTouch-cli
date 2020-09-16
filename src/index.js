const path = require('path');
const fs = require('fs');
const child_process = require('child_process');
const chalk = require('chalk');
const boxen = require('boxen');
const readlineSync = require('readline-sync');
const { dir, Console } = require('console');


function createFileSync(path) {
    fs.writeFileSync(path, '/* This is a file created by deep-touch */');
    console.log(boxen(chalk.green(`create file success,the path is '${path}'`), { padding: 0 }));
    child_process.exec(`code --goto ${path}`, (error, stdout, stderr) => {
        if (error || stderr) {
            console.log(`execute command "code --goto ${path}" failed!`);
            console.log(error || stderr);
        }
    })
}

function checkFileName(fileName) {
    const isFile = (name) => /.+\..+$/.test(name);
    if (!isFile(fileName)) {
        throw new Error(chalk.red(`${fileName}是非法文件名!`));
        process.exit(1);
    }
}

function deepTouch(fileNames, pathName) {
    //当不传入pathName参数时，默认在当前文件夹下创建文件
    let cwd = process.cwd();
    if (pathName && pathName.indexOf('.') > -1) {
        const dirArr = pathName.split('.');

        //创建文件的路径上，没有相应的文件夹就创建文件夹
        dirArr.forEach(name => {
            cwd = path.join(cwd, name);
            console.log(cwd)
            if (!fs.existsSync(cwd)) {
                fs.mkdirSync(cwd);
            }
        });
    }

    if (fileNames.length) {
        fileNames.forEach(filename => {
           checkFileName(filename);
           const filePath = path.join(cwd,filename);
           if(fs.existsSync(filePath)){
               if(readlineSync.keyInYN(chalk.blueBright(`> file '${filename}' had been existed,do you want to create a new file?`))){
                  const newFileName = readlineSync.question(chalk.blueBright('> please input a new file name:'))
                  checkFileName(newFileName);
                  const newFilePath = path.join(cwd,newFileName);
                  createFileSync(newFilePath);
               }else{
                   console.log(boxen(chalk.green(`file '${filename}'had been skipped!`)))
               }
           }else{
               createFileSync(filePath)
           }
        })
    }

}


module.exports = deepTouch;