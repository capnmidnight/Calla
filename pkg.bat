cmd /C "cd game && rollup -c"
cmd /C "minify game\bundle.js > web\bundle.min.js"
cmd /C "minify game\version.js > web\version.min.js"