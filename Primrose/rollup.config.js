import { makeBundles, warnings } from "my-rollup";

export default makeBundles("calla", "index.js", "dist", "iife", {
    output: {
        name: "Calla"
    },
    surpressions: [
        warnings.and(warnings.isInModule(/lib-jitsi-meet\.min\.js$/), warnings.isEval),
        warnings.and(warnings.isInModule(/@microsoft[\/\\]signalr[\/\\]/), warnings.isThisUndefined)
    ]
});