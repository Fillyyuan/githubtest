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
    return src('./src/js/scripts.js')
    .pipe(uglify())
    .pipe(rename({
        extname: '.min.js'
    }))
    .pipe(dest('./src/js/minify/'))    
}

exports.taskjs = ugjs


// uglify css 壓縮css
const cleanCSS = require('gulp-clean-css');

function mincss(){
   return src('./src/sass/style.css')
   .pipe(cleanCSS({compatibility: 'ie10'}))
   .pipe(rename({
       extname: '.min.css'
   }))
   .pipe(dest('./src/sass/css/'))
}

exports.css = mincss


// uglify css 同時執行 壓縮 js css
exports.alltasks = parallel(ugjs, mincss)


// 拷貝多個文件檔案

function copy(){

    return src(['./src/sass/*.css', '!./src/sass/about.css'])
    .pipe(dest('./src/sass/css/all'))
}

exports.move = copy;


// gulp-file-include 合併 html
const fileinclude = require('gulp-file-include')

function html(){

    return src('./src/*.html')
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(dest('dist'));    
}

exports.h = html;


// gulp sass & SourceMap
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');    // SourceMap

function sassstyle(){
    return src('./src/sass/*.scss')
    .pipe(sourcemaps.init())    // SourceMap
    .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write())   // SourceMap
    .pipe(dest('./dist/css'));
}

exports.style = sassstyle;


// gulp watch
// function watch(){
//     watch(['./src/sass/*.scss', './src/sass/**/*.scss'], sassstyle);
//     watch(['./src/*.html', './src/**/*.html'], html)
// }

exports.watch = () =>
    watch('./src/sass/*.scss', sassstyle);
    watch(['./src/*.html', './src/**/*.html'], html);
    watch('./src/js/*.js', ugjs);
    watch('./src/sass/*.css', mincss);


// gulp 壓縮圖片
const imagemin = require('gulp-imagemin');

function minify(){
    return src('src/images/*.*')
    .pipe(imagemin([
        imagemin.mozjpeg({quality: 70, progressive: true}) // 壓縮品質      quality越低 -> 壓縮越大 -> 品質越差 
        // imagemin.optipng({optimizationLevel: 5}),
    ]))
    .pipe(dest('dist/images'))
}

exports.img = minify;


// gulp 瀏覽器同步
const browserSync = require('browser-sync');
const reload = browserSync.reload;

function browser(done) {
    browserSync.init({
        server: {
            baseDir: "./dist",
            index: "index.html"
        },
        port: 3000
    });
    watch(['./src/sass/*.scss', './src/sass/**/*.scss'], sassstyle).on('change', reload);
    watch(['./src/*.html', './src/**/*.html'], html).on('change', reload);
    watch('./src/js/*.js', ugjs).on('change', reload);
    done();
}

exports.default = browser;


// gulp 解決跨瀏覽器的問題
const autoprefixer = require('gulp-autoprefixer');

exports.prefixer = () => (
    src('./output/css/*.css')
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(dest('./dist/css/prefixer/'))
);

// exports.packages = series(minify, mincss, prefixer)



// gulp babel es6 - > es5
const babel = require('gulp-babel');

function babel5() {
    return src('src/js/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(dest('dist/js'));
}

exports.es5 = babel5;


// gulp 清除舊檔案
const clean = require('gulp-clean');

function clear() {
    return src('dis/*.*' ,{ read: false }) // 不讀檔 增加刪除效率
    .pipe(clean({force: true}));    //強制刪除
}

exports.clean = clear;