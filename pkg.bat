cmd /C "copy /Y js\Calla.js game\lib\Calla.js"
cmd /C "rollup -c"
cmd /C "minify bundle.js > web\bundle.min.js"
cmd /C "minify version.js > web\version.min.js"