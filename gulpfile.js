
var gulp = require("gulp"),
    gulpUglify = require("gulp-uglify"),
    gulpRename = require("gulp-rename"),
    gulpHeader = require("gulp-header"),
    gulpJsBeautifier = require("gulp-jsbeautifier"),
    del = require("del"),
    pkg = require("./package.json");

var header = [
    "/*!",
    "* <%= pkg.name %> v<%= pkg.version %>",
    "* A lightweight Promises/A+ compliant implementation of ECMAScript Promise API.",
    "* Here the Belofte is an Afrikaans word, It means Promise.",
    "* This library is very useful for old browsers or old Javascript engines where",
    "* native Promise API is not available.",
    "*",
    "* @license Copyright (c) 2017 Rousan Ali, <%= pkg.license %> License",
    "*",
    "* Codebase: <%= pkg.url %>",
    "* Homepage: <%= pkg.homepage %>",
    "* Date: <%= pkg.buildDate %>",
    "*/",
    ""
].join("\n");

var parts = [
    "src/belofte.js"
];

pkg["buildDate"] = new Date();
pkg["name"] = pkg.name.replace(/^v/, function (found) {
    return found.toUpperCase();
});

gulp.task("clean", function () {
    return del(["./dist/*"]);
});

gulp.task("header", ["clean"], function() {
    return gulp.src(parts)
        .pipe(gulpHeader(header, { pkg: pkg }))
        .pipe(gulpJsBeautifier())
        .pipe(gulp.dest("./dist"));
});

gulp.task("uglify", ["header"], function () {
    return gulp.src("./dist/belofte.js")
        .pipe(gulpUglify())
        .pipe(gulpRename({suffix:".min"}))
        .pipe(gulp.dest("./dist"));
});

gulp.task("default", ["clean", "header", "uglify"]);