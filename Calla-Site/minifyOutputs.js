const util = require("util");
const exec = util.promisify(require("child_process").exec);

const files = [
    "wwwroot/scripts/game/index"
];

async function act(file) {
    const inFile = file + ".js";
    const outFile = file + ".min.js";
    const cmd = `minify ${inFile} > ${outFile}`;
    console.log(cmd);
    await exec(cmd);
}

(async function () {
    await Promise.all(files.map(act));
})();