import { makeBundles, warnings } from "my-rollup";

const opts = {
    surpressions: [
        warnings.and(warnings.isInModule(/lib-jitsi-meet\.min\.js$/), warnings.isEval),
        warnings.and(warnings.isInModule(/@microsoft[\/\\]signalr[\/\\]/), warnings.isThisUndefined)
    ]
};

export function makeConfig() {
    const tasks = [];

    if (process.env.PROJECT && process.env.BUILD) {
        console.log("Building:", process.env.PROJECT, process.env.BUILD);
        tasks.push(...makeBundles("basic", "src/basic/index.js", "wwwroot/scripts", "iife", opts));
        tasks.push(...makeBundles("game", "src/game/index.js", "wwwroot/scripts", "iife", opts));
    }

    return tasks;
}

export default makeConfig();