const {
    src, dest, series, parallel, watch
} = require('gulp')

// 任務1
function task(cb){
    console.log('gulp4');
    cb();
}

// 任務輸出
exports.do = task;

// 執行順序
function misA(cb){
    console.log('misA');
    cb();
}

function misB(cb){
    console.log('misB');
    cb();
}

function misC(cb){
    console.log('misC');
    cb();
}

function misD(cb){
    console.log('misD');
    cb();
}

// series 有順序執行
exports.async = series(misA, misB)
exports.tasks = series(misA, misB, parallel(misC, misD))

// parallel 同時執行
exports.sync = parallel(misA, misB)



// uglify js 壓縮js
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

function ugjs(){
    return src('js/scripts.js')
    .pipe(uglify())
    .pipe(rename({
        extname: '.min.js'
    }))
    .pipe(dest('js/minify/'))    
}

exports.taskjs = ugjs


// uglify css 壓縮css
const cleanCSS = require('gulp-clean-css');

function mincss(){
   return src('sass/style.css')
   .pipe(cleanCSS({compatibility: 'ie10'}))
   .pipe(rename({
       extname: '.min.css'
   }))
   .pipe(dest('sass/css/'))
}

exports.css = mincss


// uglify css 同時執行 壓縮 js css
exports.alltasks = parallel(ugjs, mincss)


// 拷貝多個文件檔案

function copy(){

    return src(['sass/*.css', '!sass/about.css'])
    .pipe(dest('sass/css/all'))
}

exports.move = copy;


// gulp-file-include 合併 html
const fileinclude = require('gulp-file-include')

function html(){

    return src('*.html')
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(dest('dist'));    
}

exports.h = html;