## 在vue/react项目中配置eslint + prettier

### 前提：配置eslint

安装eslint相关编辑器插件和项目依赖

vue：
```
  "eslint": "^4.15.0",
  "eslint-config-standard": "^10.2.1",
  "eslint-friendly-formatter": "^3.0.0",
  "eslint-loader": "^1.7.1",
  "eslint-plugin-import": "^2.7.0",
  "eslint-plugin-node": "^5.2.0",
  "eslint-plugin-promise": "^3.4.0",
  "eslint-plugin-standard": "^3.0.1",
  "eslint-plugin-vue": "^4.0.0",
```

react:
```
  "eslint": "=6.6.0",
  "eslint-plugin-import": "^2.22.1",
  "eslint-plugin-jsx-a11y": "^6.4.1",
  "eslint-plugin-react": "^7.22.0",
  "eslint-plugin-react-hooks": "^4.2.0",
```

### 安装prettier相关依赖

`npm i --save-dev prettier eslint-plugin-prettier eslint-config-prettier prettier-eslint-cli`

安装eslint-plugin-prettier 配合eslint使用prettier

安装eslint-config-prettier 禁用一些eslint和prettier冲突的规则

安装prettier-eslint-cli 使我们可以敲命令格式化代码

### eslint配置更改

extends中添加"plugin:prettier/recommended"

plugins中添加"prettier"

rules中添加如下配置来添加prettier支持并规避prettier配置和编辑器prettier配置冲突报错
```
"prettier/prettier": [
 "error",
 {
  "singleQuote": true,
  "trailingComma": "none",
  "bracketSpacing": true,
  "jsxBracketSameLine": true
 }
]
```

### package.json设置命令

package.json的scripts中添加：

"format": "prettier-eslint --write \"src/**/*.js\" \"src/**/*.scss\" \"src/**/*.less\" \"src/**/*.vue\""

### 执行

`npm run format`

### 额外配置

配合husky和lint-staged配置，可以在代码提交时自动格式化代码，减少人工操作成本

执行`npm i -D husky lint-staged`安装依赖

在package.json中增加以下配置，默认提交代码时自动格式化代码

```
{
	"husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx,md,html,vue,css,scss,less,json}": [
      "npm run format",
      "git add"
    ]
  }
}
```

---

#### 附：
eslint配置，可自由添加[规则](http://eslint.cn/docs/rules/)
```javascript
module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 6,
  },
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "plugin:vue/essential", // vue
    "plugin:react/recommended", // react
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  plugins: [
    "vue", // vue
    "react", // react
    "prettier",
  ],
  globals: {
    "require": true,
    "module": true
  },
  // add your custom rules here
  rules: {
    "generator-star-spacing": "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-console": 0, //禁用 console
    "no-unused-vars": 1, //禁止出现未使用过的变量
    "prettier/prettier": [
      "error",
      {
        "quoteProps": "preserve",
        "trailingComma": "none",
        "bracketSpacing": true,
        "jsxBracketSameLine": true,
         "endOfLine":"auto" //不同系统换行符不一致
      }
    ],
  }
}

```

