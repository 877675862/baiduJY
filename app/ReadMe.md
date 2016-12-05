# HTML+CSS+JAVASCRIPT 完整自动构建教程

本经验用于百度经验：[HTML+CSS+JAVASCRIPT自动构建教程](htts://jingyan.baidu.com/)的示例。

## 基本流程:
1. 安装nodejs。
2. 安装gulpjs。
3. 安装构建插件：`gulp-less;gulp-ruby-sass;`等。
4. 创建基本目录结构。 
5. 写**gulpfile.js**。
6. 测试。

## 基本目录结构
```
-app
    -src
    ----scss....//存放原始.less .sass 文件。
    ----script..//存放原始.js。
    ----img.....//存放原始图片。
    -lib........//存放像jquery这样的文件。
    -dist.......//文件暂存位置。
    -versions...//版本存放文件夹。
    -pages......//用于生产上线的页面。
    ----style...//最后版本的样式。
        ----CSS.//样式.CSS
        ----js..//js
        ----img.//处理后的img
        -page...//页面存放文件夹
        ----index.html..//首页
    -demo.......//开发阶段的页面。
    ----aboutMe.//demo下面的一些页面文件夹。
    ----index.html
    
```
**版本生成流程：先在``/pages/``里开发好，开始生成版本时放入``/demo/``做上线前的最后处理及测试。确认后生成版本放入``/versions/``文件夹。**

**用``git``的话建议``.gitignore``这样写：**
```
# 排除node模块文件
node_modules
# 排除src/
src
# 排除 lib
lib
# 排除 dist
dist
# 排除 pages
pages
# 排除 demo
demo
# 排除 visua studio code 编辑器的配置文件
.vscode
# 排除 webstorm 的配置文件
.idea
# 1. 如果你使用其他的编辑器，则记得把其产生的配置文件排除掉。
# 2. 如果是团队合作的话，则把 src lib pages demo 去掉，尽可能保留合作需要的文件。
```

