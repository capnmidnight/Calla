cmd /C node writeversion.js
cmd /C rollup -c
cmd /C minify Calla.js > Calla.min.js