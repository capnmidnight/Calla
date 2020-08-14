import fs from "fs";

const traceKit = fs.readFileSync("../js/lib/tracekit.js", { encoding: "utf8" });
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

export default [{
    input: "bundleIndex.js",
    output: {
        file: "bundle.js",
        banner,
        footer,
        format: "es"
    }
}, {
	input: "versionIndex.js",
	output: {
		file: "version.js",
		format: "es"
	}
}];
