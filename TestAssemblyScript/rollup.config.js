import { makeBundles, warnings } from "my-rollup";

function basic(name, moduleType = "iife", opts = null) {
    if (moduleType
        && moduleType instanceof Object
        && !(moduleType instanceof String)
        && typeof moduleType !== "string"
        && !opts) {
        opts = moduleType;
        moduleType = "iife";
    }

    return makeBundles(name, `src/${name}/index.js`, "wwwroot/js", moduleType, opts);
}

export function makeConfig() {
    const tasks = [];

    if (process.env.PROJECT && process.env.BUILD) {
        console.log("Building:", process.env.PROJECT, process.env.BUILD);

        tasks.push(...basic("site", "es"));
        tasks.push(...basic("fetcher", "es"));
    }

    return tasks;
}

export default makeConfig();