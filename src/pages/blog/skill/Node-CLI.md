---
title: 编写并发布 node 命令行脚本
description: 编写并发布 node 命令行脚本
image: /img/node.jpg
date: 2022-05-18 18:05:29
---

[[toc]]

## 脚本的编写

### 编写流程

```bash
mkdir cli-name
cd cli-name
npm init
# 新建并打开 cli.js
# 编写脚本，保存
# 打开 package.json，添加 `"bin": "cli.js"` 字段并保存
npm link # 将命令(package.json -> name)添加到系统
cli-name # 执行脚本
```

### 依赖包的使用

**`commander`**
- 用于解析输入的参数，[详细使用](https://github.com/tj/commander.js/blob/HEAD/Readme_zh-CN.md)
- 基本使用：

```js
const { program } = require('commander');
program.version('1.0.0');
program
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza');

program.parse(process.argv);

const options = program.opts();
if (options.debug) console.log(options);
console.log('pizza details:');
if (options.small) console.log('- small pizza size');
if (options.pizzaType) console.log(`- ${options.pizzaType}`);
/*
$ pizza-options -d
{ debug: true, small: undefined, pizzaType: undefined }
pizza details:
$ pizza-options -p
error: option '-p, --pizza-type <type>' argument missing
$ pizza-options -ds -p vegetarian
{ debug: true, small: true, pizzaType: 'vegetarian' }
pizza details:
- small pizza size
- vegetarian
$ pizza-options --pizza-type=cheese
pizza details:
- cheese
*/
```

**`inquirer`**

- 用于获取用户输入/选择的结果，[官方文档](https://www.npmjs.com/package/inquirer/v/5.0.1)
- 基本使用：

```js
const inquirer = require('inquirer');
const optionList = [
  {
    name: 'type',
    type: 'list',
    message: '请选择你要提交的类型：',
    choices: [
      'feat     -> 新特性/功能',
      'fix      -> Bug 修复',
      'refactor -> 代码重构',
      'docs     -> 文档修改',
      'style    -> 代码格式修改，非 css',
      'test     -> 测试用例修改',
      'chore    -> 构建或者依赖的修改'
    ],
    filter: (val) => {
      return val.match(/\w+/)[0];
    }
  },
  {
    name: 'use_default_icon',
    type: 'confirm',
    message: '是否使用默认的 gitmoji ?'
  },
  {
    name: 'icon',
    type: 'input',
    message: '请输入你想使用的 gitmoji（只需名称，无需引号）：',
    when: ({ use_default_icon }) => {
      return !use_default_icon;
    },
    validate: (val) => {
      if (!val.indexOf(':') > -1) {
        return true;
      }
      return '只需名称，无需引号';
    }
  },
  {
    name: 'msg',
    type: 'input',
    message: '请输入此次提交的描述：',
    validate: (val) => {
      if (val.trim() !== '') {
        return true;
      }
      return '请勿输入空字符串！！！';
    }
  }
];
inquirer.prompt(optionList).then(({type, use_default_icon, icon, msg}) => {}).catch();
```

**`shelljs`**

- 用于执行系统命令

```js
//引入shelljs
const shell = require('shelljs')
 
//检查控制台是否以运行`git `开头的命令
if (!shell.which('git')) {
  //在控制台输出内容
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
}
 
shell.rm('-rf','out/Release'); //强制递归删除`out/Release目录`
shell.cp('-R','stuff/','out/Release'); //将`stuff/`中所有内容拷贝至`out/Release`目录
 
shell.cd('lib'); //进入`lib`目录
//找出所有的扩展名为js的文件，并遍历进行操作
shell.ls('*.js').forEach(function (file) {
  /* 这是第一个难点：sed流编辑器,建议专题学习，-i表示直接作用源文件 */
  //将build_version字段替换为'v0.1.2'
  shell.sed('-i', 'BUILD_VERSION', 'v0.1.2', file);
  //将包含`REMOVE_THIS_LINE`字符串的行删除
  shell.sed('-i', /^.*REMOVE_THIS_LINE.*$/, '', file);
  //将包含`REPLACE_LINE_WITH_MACRO`字符串的行替换为`macro.js`中的内容
  shell.sed('-i', /.*REPLACE_LINE_WITH_MACRO.*\n/, shell.cat('macro.js'), file);
});
 
//返回上一级目录
shell.cd('..');
 
//run external tool synchronously
//即同步运行外部工具
if (shell.exec('git commit -am "Auto-commit"').code !== 0){
  shell.echo('Error: Git commit failed');
  shell.exit(1);
}
```

## 发布脚本

1. 到[npm官网](https://npmjs.org)注册一个账号
2. 恢复为官方源 `npm config set registry https://registry.npmjs.org/`
3. 登录账号(密码不回显) `npm login`
4. 发布 `npm publish`(淘宝源每 10 分钟自动同步，不能及时同步的话去 https://npm.taobao.org/ 手动同步)
5. 切换为淘宝源 `npm config set registry https://registry.npm.taobao.org`

## 关于 `@name/sub-name` 包的发布

<n-alert type="warning">**踩坑**</n-alert>

### 403

**未登录或者包名被抢注**

```bash
# 查看当前登录的用户
npm whoami
```

### 402

**@开头的包默认发布为私有包，需要氪金**

**不氪金的话必须与账户同名，然后显示发布为公共包**

```bash
# 显示指定发布为公共包
npm publish --access public
# 初始化，自动加前缀
npm init --scope=@username
```