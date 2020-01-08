# vue-base

## 命令

### 项目启动
1. [node安装10.0.0+](https://nodejs.org/zh-cn/)

2. [yarn安装](https://yarn.bootcss.com/docs/install/#windows-stable)

3. 更换yarn源(可选操作项，如可翻墙，无需此步骤)
```
yarn config set registry 'https://registry.npm.taobao.org'
```

4. 安装依赖，项目目录下执行
```
yarn
```

5. 启动项目
```
npm start
```

5.浏览器访问：  http://localhost:8888

### 辅助工具安装

1. chrome安装插件 vue,vue performance


### 编译开发环境代码，开启热替换服务器
```
npm start
```

### 编译正式环境代码
```
npm run build
```

### 编译测试环境代码
```
npm run build:sit
```

### 编译UAT环境代码
```
npm run build:uat
```

### 运行本地接口mock
```
npm run mock:locall
```

### 运行yapi接口mock
```
npm run mock
```

### 运行代码自动修复
```
npm run lint
```

### 运行单元测试
```
npm run test
```

### 项目结构
```
|   .browserslistrc
|   .editorconfig
|   .env.mock
|   .env.yapi
|   .eslintrc.js
|   .gitignore
|   babel.config.js
|   package.json
|   postcss.config.js
|   README.md
|   vue.config.js // 框架相关配置
|   
+---public // 静态资源目录
|       favicon.ico
|       index.html
|       particles.min.js
|       
+---src
|   |   App.vue
|   |   baseConfig.js
|   |   main.js
|   |   
|   +---assets // 图片，字体，音视频文件目录
|   |   
|   +---base // 基础配置，功能目录
|   |       
|   \---components // 公用组件目录
|       +---base // 框架公用组件（例如：菜单组件，权限组件等）
|       +---business // 业务公用组件（例如：上传组件，面包屑组件，编辑器组件等）
|       +---project // 具体项目中用到的公用组件
|   | 
|   +---helper // 辅助插件目录
|   |           
|   +---http // http模块
|   |    api.js
|   |    common.js
|   |    ...
|   |  
|   +---mock // mock逻辑目录
|   |       
|   +---router // 路由目录
|   |       getRoutes.js
|   |       index.js
|   |       
|   +---store // vuex
|   |   |   
|   |   \---modules
|   |           permission.js
|   |           userInfo.js
|   |           
|   +---utils // 工具函数
|   | 
|   \---views // 视图
|       +---home
|               index.vue
|               ...
| 
|       |                   
|       \---login
|               index.vue
|               particles-app.js
|               
\---tests // 单元测试

```
所有可能复用的组件代码需要放在*componnets*目录中。*componnets*中组件分为三大类

- base // 框架公用组件（例如：菜单组件，权限组件等）
- business // 业务公用组件（例如：上传组件，面包屑组件，编辑器组件等）
- project // 具体项目中用到的公用组件

所有页面代码需要放在*views*目录中，且目录层级遵循路由结构层级。

### 规范

#### 页面编写流程

以开发 **系统管理 > 系统权限 > 日志管理** 页面为例

1. 创建页面，我们需要先在**技术权限管理**页面添加此日志菜单。并添加日志管理的访问权限(注意：此处我们还添加了其他一些权限，可忽略)。

![](http://wiki.hongguaninfo.com/download/attachments/10093458/image2019-11-18_16-5-6.png?version=1&modificationDate=1574064306839&api=v2) 

2. 我们在此登录用户下添加用户管理页面的访问权限，**系统管理 > 系统权限 > 日志管理**下

- ![](http://wiki.hongguaninfo.com/download/attachments/10093458/image2019-11-18_16-6-42.png?version=1&modificationDate=1574064402908&api=v2)

- ![](http://wiki.hongguaninfo.com/download/attachments/10093458/image2019-11-18_16-7-53.png?version=1&modificationDate=1574064474010&api=v2)

- 此时，我们已经看到日志管理已经在此权限树中。

- ![](http://wiki.hongguaninfo.com/download/attachments/10093458/image2019-11-18_16-8-48.png?version=1&modificationDate=1574064528363&api=v2)
    

3. 新增页面路由。注意：我们规定，页面及页面内的权限是在路由对象中同时定义的。在*router*目录下添加如下代码：

![](http://wiki.hongguaninfo.com/download/attachments/10093458/image2019-11-18_16-13-35.png?version=1&modificationDate=1574064815831&api=v2)

      
**日志管理**页面为**系统权限**模块下的子页面，所以需要在**系统权限**模块下的 *children*对象下添加一个**日志管理**的子对象，用于表示**日志管理**页面。
    
注意，此处并没有结束，我们只是添加了一个**日志管理**的子页面，还需要在此页面下定义若干权限（eg:查看用户权限，编辑用户权限）。所以在**日志管理**的*children*对象下又添加了一条访问权限。
    
路由对象各配置项说明：

- path: 页面路径
- name: 页面名称，此名称必须与在**基础权限管理**中添加的页面或者权限编码值一致，用于页面的唯一标识。
- redirect 自动重定向到其他页面的路径 
- meta.title 页面显示名称
- meta.dicts 页面中用到的字典项key值数组
- meta.linkable 此页面的面包屑项是否是超链接
- children 子页面数组对象，每一项拥有以上所有配置项
- component 此页面关联的vue文件

4. 至此我们添加了页面的路由，且将该页面关联到了`src/views/home/system/sysLog`目录（vue将自动加载该目录下的*index.vue*文件作为该页面入口文件），创建该目录并在该目录下创建*index.vue*文件，添加测试代码，保存，就可以看到该页面了。

#### 代码规范

- 项目中引入了eslint代码规范检查插件，遵照eslint标准规范。具体细则参考[eslint规范细则](http://eslint.cn/docs/rules/)。未符合规范的代码将蒙层显示错误且提交不规范代码会提交失败。

#### 组件规范

1. 组件分类：公用组件，业务组件
2. 职能单一性原则
3. 组件内部逻辑组件内处理
4. 入参的校验
