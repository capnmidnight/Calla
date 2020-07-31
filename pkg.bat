cmd /C "cd web && rollup -c"
cmd /C "cd web && minify bundle.js > bundle.min.js"
cmd /C "cd web && minify version.js > version.min.js"