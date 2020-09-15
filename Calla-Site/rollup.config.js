import fs from "fs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
//import typescript from "@rollup/plugin-typescript";

const traceKit = fs.readFileSync("node_modules/tracekit/tracekit.js", { encoding: "utf8" });
const banner = `${traceKit}

TraceKit.report.subscribe((err) => {
    err.userAgent = navigator.userAgent;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/ErrorLog", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(err));
});

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
            //    typescript({
            //        tsconfig: false,
            //        noImplicitAny: false,
            //        alwaysStrict: true,
            //        noEmitOnError: true,
            //        removeComments: false,
            //        sourceMap: true,
            //        module: "ES2020",
            //        target: "ES6",
            //        allowJs: true,
            //        checkJs: true,
            //        esModuleInterop: true,
            //        skipLibCheck: true
            //    }),
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

const bundles = [];


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

if (process.env.BUILD === "yarrow"
    || process.env.BUILD === "development"
    || process.env.BUILD === "production") {
    bundles.push(def("yarrow", true, true));
    bundles.push(def("vrtest", true, true));
}

if (process.env.BUILD === "calla"
    || process.env.BUILD === "development"
    || process.env.BUILD === "production") {
    bundles.push(
        def("tests", false, false),
        def("version", false, true),
        def("basic", false, true),
        def("game", true, true));
}

export default bundles;