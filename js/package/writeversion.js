const pkg = require("./package.json"),
    fs = require("fs");
fs.writeFile("./src/version.js", `export const version = "${pkg.version}";`, (err) => {
    if (err) {
        console.error(err);
    }
    else {
        console.log("done: " + pkg.version);
    }
});