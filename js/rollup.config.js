export default [{
    input: "index.js",
    output: {
        file: "bundle.js",
        format: "es"
    }
}, {
        input: "src/audio/ExternalJitsiAudioServer.js",
        output: {
            file: "jitsi-external-api-hax/jitsihax.js",
            format: "es"
        }
    }];
