const commonjs = require("@rollup/plugin-commonjs");
const json = require("@rollup/plugin-json");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const replace = require("@rollup/plugin-replace");
const typescript = require("@rollup/plugin-typescript");
const glslify = require("rollup-plugin-glslify");
const { terser } = require("rollup-plugin-terser");

module.exports.warnings = {
    and(a, b) {
        return (c) => a(c) && b(c);
    },

    isCircularDependency(warning) {
        return warning.code === "CIRCULAR_DEPENDENCY";
    },

    isThisUndefined(warning) {
        return warning.code === "THIS_IS_UNDEFINED";
    },

    isEval(warning) {
        return warning.code === "EVAL";
    },

    isInModule(test) {
        return (warning) => {
            const file = warning.loc && warning.loc.file || warning.importer;
            return test.test(file);
        };
    }
};

function makeBundle(name, inputFile, outputDir, isProduction, options) {
    options = options || {};
    const devOptions = options.dev || {};
    const prodOptions = options.prod || {};

    if ("dev" in options) {
        delete options.dev;
    }

    if ("prod" in options) {
        delete options.prod;
    }

    options = Object.assign(options, isProduction ? prodOptions : devOptions);

    const opts = {
        input: `scripts/${name}/index.ts`,
        plugins: [
            nodeResolve(),
            commonjs(),
            replace({
                "process.env.NODE_ENV": JSON.stringify(isProduction ? "production" : "development"),
                "__filename__": function (match) {
                    const curDir = process.cwd().replace('\\', '/');
                    let path = match.replace('\\', '/');
                    path = path.substring(curDir.length);
                    return path;
                }
            }),
            json()
        ],
        output: {
            format: options.isWorker ? "es" : "iife",
            sourcemap: true
        }
    };

    if (options.webgl) {
        opts.plugins.push(glslify());
    }

    if (/\.ts$/.test(inputFile)) {
        opts.plugins.push(typescript());
    }

    if (options.surpressions) {
        opts.onwarn = (warning, defaultHandler) => {
            if (options.surpressions.every(thunk => !thunk(warning))) {
                defaultHandler(warning);
            }
        };
    }

    if (isProduction) {
        opts.output.file = `${outputDir}/${name}.min.js`;
        opts.plugins.push(
            terser({
                format: {
                    comments: false
                }
            }));
    }
    else {
        opts.output.file = `${outputDir}/${name}.js`;
    }

    return opts;
}

module.exports.makeBundles = function makeBundles(name, inputFile, outputDir, options) {
    const tasks = [];
    const inDevelopment = process.env.BUILD === "development"
        || process.env.BUILD === "all";
    const inProduction = process.env.BUILD === "production"
        || process.env.BUILD === "all";
    const inBuild = process.env.PROJECT === "all"
        || process.env.PROJECT === name;
    if (inBuild) {
        if (inDevelopment) {
            console.log("\tIncluding:", name, "development");
            tasks.push(makeBundle(name, inputFile, outputDir, false, options));
        }
        if (inProduction) {
            console.log("\tIncluding:", name, "production");
            tasks.push(makeBundle(name, inputFile, outputDir, true, options));
        }
    }
    return tasks;
}