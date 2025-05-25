const { src, dest, watch, parallel, series } = require("gulp");
const scss = require("gulp-sass")(require("sass"));
const uglify = require("gulp-uglify-es").default;
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const clean = require("gulp-clean");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const include = require("gulp-include");
const rename = require('gulp-rename')

function pages() {
  return src("app/pages/*html")
    .pipe(
      include({
        includePaths: "app/components",
      })
    )
    .pipe(dest("app"))
    .pipe(browserSync.stream());
}

function images() {
  return src("app/images/src/*", { encoding: false })
    .pipe(newer("app/images"))
    .pipe(imagemin())
    .pipe(dest("app/images"));
}

function scripts() {
  return src(["app/js/main.js", "app/js/cart.js"])
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}

function styles() {
  return src("app/scss/style.scss")
    .pipe(
      scss({
        outputStyle: "compressed",
        sourceMap: false,
      }).on("error", scss.logError)
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 10 versions"],
      })
    )
    .pipe(concat("style.min.css"))
    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}

function watching() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
  });
  watch(["app/scss/style.scss"], styles);
  watch(["app/images/src"], images);
  watch(["app/js/main.js"], scripts);
  watch(["app/pages/*", "app/components/*"], pages);
  watch(["app/*.html"]).on("change", browserSync.reload);
}

function cleanDist() {
  return src("dist").pipe(clean());
}

function building() {
  return src(
    [
      "app/css/style.min.css",
      "app/images/*.*",
      "app/fonts/*.*",
      "app/js/main.min.js",
      "app/**/*.html",
    ],
    {
      base: "app",
    }
  ).pipe(dest("dist"));
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.images = images;
exports.pages = pages;

exports.build = series(cleanDist, building);
exports.default = parallel(styles, images, scripts, pages, watching);
