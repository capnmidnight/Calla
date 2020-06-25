export default [{
    input: "index.js",
    output: {
        file: "bundle.js",
        format: "es"
    }
}, {
    input: "src/audio/ExternalJitsiAudioServer.js",
    output: {
        file: "etc/jitsihax.js",
        format: "es"
    }
}, {
    input: "tests/game/index.js",
    output: {
        file: "tests/game/bundle.js",
        format: "es"
    }
}];
