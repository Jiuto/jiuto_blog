## 在vue项目中配置eslint + prettier

### 前提：配置eslint
方案一：vue-cli初始化vue项目并选择初始化eslint
方案二：自行百度eslint相关编辑器插件和项目依赖
### 安装prettier相关依赖
`npm i --save-dev prettier eslint-plugin-prettier eslint-config-prettier prettier-eslint-cli`
安装eslint-plugin-prettier 配合eslint使用prettier
安装eslint-config-prettier 禁用一些eslint和prettier冲突的规则
安装prettier-eslint-cli 使我们可以敲命令格式化代码
### eslint配置更改
extends中添加'plugin:prettier/recommended'
plugins中添加'prettier'
rules中添加
"prettier/prettier": [
 "error",
 {
  "singleQuote": true,
  "trailingComma": "none",
  "bracketSpacing": true,
  "jsxBracketSameLine": true
 }
]
添加prettier支持并规避prettier配置和编辑器prettier配置冲突报错
### package.json设置命令
package.json的scripts中添加：
"format": "prettier-eslint --write \"src/**/*.js\" \"src/**/*.scss\" \"src/**/*.less\" \"src/**/*.vue\""
### 执行
`npm run format`
### 额外配置
可在package.json中增加以下配置，默认提交代码时自动格式化代码
```javascript
{
	"husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,md,html,vue,css,scss,less,json}": [
      "prettier-eslint --write",
      "git add"
    ],
    "package-lock.json": [
      "git rm --cached"
    ]
  }
}
```

---

#### 附：
eslint配置，可自由添加[规则（自行翻墙）](http://eslint.cn/docs/rules/)
```javascript
module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 6,
  },
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:vue/essential', 
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],
  plugins: [
    'vue',
    'prettier',
  ],
  globals: {
    require: true,
  },
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    'no-console': 0, //禁用 console
    'no-unused-vars': 1, //禁止出现未使用过的变量

    "prettier/prettier": [
      "error",
      {
        "singleQuote": true,
        "trailingComma": "none",
        "bracketSpacing": true,
        "jsxBracketSameLine": true,
         "endOfLine":"auto" //不同系统换行符不一致
      }
    ],
  }
}

```

