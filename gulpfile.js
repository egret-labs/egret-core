/**
 * Created by wander on 15/9/9.
 */
var gulp = require('gulp');
var ts = require('gulp-typescript');
//var tsc = require("../TypeScript-master/built/local/typescript.js")
var sourcemaps = require('gulp-sourcemaps');
//var tsc = require("./tools/lib/typescript/tsclark.js")
//gulp.src(['tools/**/*.ts','!tools/templates/**/*.ts','!tools/lib/typescript/**/*.ts','!tools/lib/core/typescript/**/*.d.
gulp.task('build-tools', function () {
    var tsResult = gulp.src(['tools/**/*.ts','!tools/templates/**/*.ts','!tools/lib/typescript/**/*.ts','!tools/lib/core/typescript/**/*.d.ts'])
        .pipe(sourcemaps.init())
        .pipe(ts({
            //typescript:tsc,
            target:"ES5",
            module:"commonjs"
        }));
    return tsResult.js.pipe(sourcemaps.write(".")).pipe(gulp.dest('tools'));
});


gulp.task('watch', ['build-tools'], function() {
    gulp.watch('tools/**/*.ts', ['build-tools']);
});