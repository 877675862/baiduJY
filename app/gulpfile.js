var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var htmlMin = require('gulp-htmlmin');
var cssMin = require('gulp-clean-css');
var jsMin = require('gulp-uglify');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var connect = require('gulp-connect');
var htmlRep = require('gulp-html-replace');
var reName = require('gulp-rename');
var fs = require('fs');
var myJson = JSON.parse(fs.readFileSync('./package.json')); // 读取package.json 的内容。get the content of package.json
var appVersion = String(myJson.name +'-v'+ myJson.version); // 获取项目package.json里的名称（"name":"app"）和版本号("version":"1.0.0") get the key:val
// 声明页面文件夹结构
var dirc = ['aboutMe','contactUs','products'] //页面的文件夹要先定义并列出。

//*************** init START **********************************************
// init the project add the files in the /lib/ to servers's root dictionary. 
// 项目初始化 把 lib 的文件添加到各个环节。
// init .css files.
gulp.task('appinit-css',function(){
    gulp.src('lib/**/*.css')
        .pipe(gulp.dest('pages/style/css'))
        .pipe(gulp.dest('demo/style/css'));
});
// init .js files.
gulp.task('appinit-js',function(){
    gulp.src('lib/**/*.js')
        .pipe(gulp.dest('pages/style/js'))
        .pipe(gulp.dest('demo/style/js'));
});
gulp.task('appinit',['appinit-css','appinit-js']);
//*************** init END ************************************************

// build less
gulp.task('app-css',function(){
    gulp.src('src/scss/*.less')
        .pipe(less())
        .pipe(gulp.dest('pages/style/css'))
        .pipe(connect.reload());
});
// build js
gulp.task('app-js',function(){
    gulp.src('src/script/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest(['pages/style/js','demo/style/js']))
        .pipe(connect.reload());   
});
// 监听src
gulp.task('app-watch',function(){
    gulp.watch('src/scss/*.less',['app-css']);
    gulp.watch('src/script/*.js',['app-js']);
});
// setting servers to run in the browsers. The URL like this: http://localhost:8080.
// server for pages
gulp.task('server-pages',function(){
    connect.server({
        name:'pages',
        port:8080,
        root:'pages',
        livereload:true
    });
});
// server for demo
gulp.task('server-demo',function(){
    connect.server({
        name:'demo',
        port:8090,
        root:'demo',
        livereload:true
    });
});
// server for version
gulp.task('server-version',function(){
    connect.server({
        name:'version',
        port:8080,
        root:'versions',
        livereload:true
    });
});

//----------- tasks for pages START-------------------------------------------

gulp.task('p-html',function(){
    gulp.src('pages/**/*.html')
        .pipe(connect.reload());
});
gulp.task('p-watch',function(){
    gulp.watch('pages/**/*.html',['p-html']);
});
    // pages default task
gulp.task('p-start',['server-pages','app-watch','p-watch']);

//----------- tasks for pages END---------------------------------------------


//&&&&&&&&&&&&&&&&&&&&&&&&& tasks fot demo START &&&&&&&&&&&&&&&&&&&&&&&&&
gulp.task('d-css',function(){
    gulp.src('src/scss/entry.less')     //这里做了合并，如果你的.less文件没有用@import 合并，则把这里改成：‘src/scss/*.less’，然后用.pipe(concat())合并。
        .pipe(less())
        .pipe(gulp.dest('demo/style/css'))
        .pipe(connect.reload());
        
});
gulp.task('d-js',function(){
    gulp.src('src/script/*.js')
        .pipe(concat('unmin.js'))
        .pipe(gulp.dest('demo/style/js'))
        .pipe(connect.reload());
});
gulp.task('d-html',function(){
    for(p in dirc){
        gulp.src('pages/'+dirc[p]+'/*.html')
        .pipe(gulp.dest('demo/'+dirc[p]))
        .pipe(connect.reload());
    }  
});

gulp.task('d-watch',function(){
    gulp.watch('src/scss/*.less',['d-css']);
    gulp.watch('src/script/*.js',['d-js']);
    gulp.watch('pages/**/*.html',['d-html']);
});

    //demo default task
gulp.task('d-start',['server-demo','app-watch','d-watch']);
//&&&&&&&&&&&&&&&&&&&&&&&&& tasks fot demo END &&&&&&&&&&&&&&&&&&&&&&&&&


//************************* tasks fot versions START ******************************
    // versions init
gulp.task('v-init-css',function(){
    gulp.src('lib/**/*.css')
        .pipe(gulp.dest('versions/'+ myJson.version +'/style/css'))
        .pipe(connect.reload());
});
gulp.task('v-init-js',function(){
    gulp.src('lib/**/*.js')
        .pipe(gulp.dest('versions/'+ myJson.version +'/style/js'))
        .pipe(connect.reload());
});
gulp.task('v-init',['v-init-css','v-init-js']);

    // .css add version NO.
gulp.task('v-css',function(){
    gulp.src('src/scss/entry.css')
        .pipe(less())
        .pipe(cssMin())
        .pipe(reName(appVersion+'.min.css'))
        .pipe(gulp.dest('versions/' + myJson.version + '/style/css'))
        .pipe(connect.reload());     
});
    // .less add version NO.
gulp.task('v-less',function(){
    gulp.src('src/scss/entry.less')
        .pipe(reName(appVersion + '.less'))
        .pipe(gulp.dest('versions/' + myJson.version+'/style'));
});
    // .js add version NO.
gulp.task('v-js',function(){
    gulp.src('src/script/*.js')
        .pipe(concat(appVersion+'min.js'))
        .pipe(jsMin())
        .pipe(gulp.dest('versions/' + myJson.version+'/style'))
        .pipe(connect.reload());        
});
    // change the links of cssFile add the src of jsFile to htmlFiles
gulp.task('v-html',function(){
    // use for(){}
    // 用for 循环处理。
        for(v in dirc){
            gulp.src('pages/'+ dirc[v] +'/*.html')
                .pipe(htmlRep({
                    js : appVersion +'min.js',
                    css : appVersion +'min.css'
                }))
                .pipe(htmlMin())
                .pipe(gulp.dest('versions/'+myJson.version+'/'+dirc[v]))
                .pipe(connect.reload());
        }
});
    // versions default task
gulp.task('v-start',['server-v','v-init','v-css','v-js','v-html']);

//****************************** tasks fot versions END ******************************