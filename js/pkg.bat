cmd /C "npm version %1"
node writeversion.js
cmd /C rollup -c
minify bundle.js > bundle.min.js