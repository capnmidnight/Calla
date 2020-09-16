import fs from "fs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const traceKit = fs.readFileSync("node_modules/tracekit/tracekit.js", { encoding: "utf8" });
const banner = `${traceKit}
(function(){
var keepTrying = true;
TraceKit.report.subscribe((err) => {
    if(keepTrying){
        try{
            err.userAgent = navigator.userAgent;
            const xhr = new XMLHttpRequest();
            xhr.onerror = function() { keepTrying = false; };
            xhr.open("POST", "/ErrorLog");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(err));
        }
        catch(exp){
            keepTrying = false;
        }
    }
});
})();
try{
`;
const footer = `
} catch(exp) {
    TraceKit.report(exp);
}`;

function def(name, withTraceKit, minify) {
    const opts = {
        input: `scripts/${name}/index.js`,
        plugins: [
            nodeResolve()
        ],
        output: [{
            sourcemap: true,
            file: `wwwroot/scripts/${name}.js`
        }]
    };

    if (process.env.BUILD === "production" && minify) {
        opts.output.push({
            sourcemap: true,
            file: `wwwroot/scripts/${name}.min.js`,
            plugins: [terser({
                module: true
            })]
        });
    }

    if (withTraceKit) {
        for (let output of opts.output) {
            output.banner = banner;
            output.footer = footer;
        }
    }

    return opts;
}

const bundles = [
    def("tests", false, false),
    def("version", false, true),
    def("basic", false, true),
    def("game", true, true)];


if (process.env.BUILD === "production") {
    bundles.push({
        input: `scripts/calla/index.js`,
        plugins: [
            nodeResolve()
        ],
        output: [{
            format: "cjs",
            file: `scripts/calla/calla.cjs.js`
        }]
    });
}

export default bundles;