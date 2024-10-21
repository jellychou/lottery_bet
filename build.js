const inquirer = require('inquirer')
const AdmZip = require('adm-zip')
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const os = require('os')

const zip = new AdmZip()

const execSyncStdio = command => execSync(command, { stdio: [ 0, 1, 2 ] })


const release = async() => {
    console.log('执行线上打包发布命令')

    const productPath = path.join(path.resolve(__dirname, '..'), '2021-million-project-git', 'million_lottery_wap')

    const productGit = fs.existsSync(productPath)

    if (!productGit) return console.log('未发现需要发布的git库')

    execSyncStdio(`cd ${productPath} && git pull`)

    const { commitMsg } = await inquirer.prompt([
        {
            type: 'input',
            message: '输入发布git提交信息',
            name: 'commitMsg'
        }
    ])
    console.log('————————————————')
    console.log('开始项目打包')
    execSyncStdio('vue-cli-service build')

    console.log('项目打包完成')
    const buildPath = path.join(__dirname, 'dist')
    zip.addLocalFolder(buildPath)
    zip.writeZip('./dist/million_lottery_wap.zip')
    console.log('项目压缩zip')

    if (os.type() == 'Windows_NT') {  
        //windows
        execSyncStdio(`xcopy /y ${buildPath}\\million_lottery_wap.zip ${productPath} `)
    }  else{
        // 默认执行linux
        execSyncStdio(`cp -r ${buildPath}/million_lottery_wap.zip ${productPath} `) 
    }

    execSyncStdio(`cd ${productPath} && git add . && git commit -m "${commitMsg}"`)
    execSyncStdio(`cd ${productPath} && git pull --rebase`)
    execSyncStdio(`cd ${productPath} && git push`)
    console.log('发布成功')
}

release()
