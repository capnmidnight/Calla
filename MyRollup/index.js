const commonjs = require("@rollup/plugin-commonjs");
const json = require("@rollup/plugin-json");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const replace = require("@rollup/plugin-replace");
const sourcemaps = require("rollup-plugin-sourcemaps");
const { terser } = require("rollup-plugin-terser");
const glslify = require("rollup-plugin-glslify");
const del = require("rollup-plugin-delete");
const fs = require("fs");

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

function coallesceOptions(options, isProduction) {
    options = options || {};
    const devOptions = options.dev || {};
    const prodOptions = options.prod || {};

    if ("dev" in options) {
        delete options.dev;
    }

    if ("prod" in options) {
        delete options.prod;
    }

    options = Object.assign(
        options,
        isProduction
            ? prodOptions
            : devOptions);

    return options;
}

function clean(name, outputDir) {
    const paths = [
        `${outputDir}/${name}.js`,
        `${outputDir}/${name}.js.map`,
        `${outputDir}/${name}.min.js`,
        `${outputDir}/${name}.min.js.map`
    ];

    for (const path of paths) {
        const stat = fs.statSync(path);
        if (stat) {
            console.log(`Deleting ${path}`);
            fs.unlinkSync(path);
        }
    }
}

function makeBundle(name, input, outputDir, format, isProduction, options) {
    options = coallesceOptions(options, isProduction);

    const replaceOpts = Object.assign({
        preventAssignment: true,
        "const isWorker = false": options.isWorker ? "const isWorker = true" : "const isWorker = false",
        "process.env.NODE_ENV": JSON.stringify(isProduction ? "production" : "development"),
        "__filename": function (match) {
            const curDir = process.cwd().replace('\\', '/');
            let path = match.replace('\\', '/');
            path = path.substring(curDir.length);
            return JSON.stringify(path);
        }
    }, options.replace);

    const opts = {
        input,
        plugins: [
            glslify({
                include: [
                    /\.vs$/,
                    /\.fs$/,
                    /\.vert$/,
                    /\.frag$/,
                    /\.glsl$/
                ],
                compress: true
            }),
            nodeResolve(),
            commonjs(),
            replace(replaceOpts),
            json()
        ],
        output: {
            name,
            format,
            sourcemap: true,
            file: isProduction
                ? `${outputDir}/${name}.min.js`
                : `${outputDir}/${name}.js`
        }
    };

    if (options.plugins) {
        opts.plugins.push(...options.plugins);
    }

    opts.plugins.push(sourcemaps());

    if (isProduction) {
        opts.plugins.push(
            terser({
                format: {
                    comments: false
                }
            }));
    }

    if (options.surpressions) {
        opts.onwarn = (warning, defaultHandler) => {
            if (options.surpressions.every(thunk => !thunk(warning))) {
                defaultHandler(warning);
            }
        };
    }

    if (options.output) {
        for (const key in options.output) {
            opts.output[key] = options.output[key];
        }
    }

    return opts;
}

module.exports.makeBundles = function makeBundles(name, inputFile, outputDir, format, options) {
    const tasks = [];
    const inBuild = process.env.PROJECT === "all"
        || process.env.PROJECT === name;
    if (inBuild) {
        const isDevelopment = process.env.BUILD === "development"
            || process.env.BUILD === "all";
        const isProduction = process.env.BUILD === "production"
            || process.env.BUILD === "all";
        const isClean = process.env.BUILD === "clean";

        if (isDevelopment) {
            console.log("\tIncluding:", name, "development");
            tasks.push(makeBundle(name, inputFile, outputDir, format, false, options));
        }

        if (isProduction) {
            console.log("\tIncluding:", name, "production");
            tasks.push(makeBundle(name, inputFile, outputDir, format, true, options));
        }

        if (isClean) {
            console.log("\Cleaning:", name);
            clean(name, outputDir);
        }
    }
    return tasks;
};
