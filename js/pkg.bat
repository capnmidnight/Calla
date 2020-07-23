cmd /C node writeversion.js
cmd /C rollup -c
cmd /C minify bundle.js > bundle.min.js
cmd /C minify version.js > version.min.js