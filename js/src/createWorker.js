import { isFunction, isString } from "./typeChecks.js";

export function createWorker(script, stripFunc = true) {
    if (isFunction(script)) {
        script = script.toString();
        stripFunc = true;
    }
    else if (!isString(script)) {
        throw new Error("Script parameter must be either a string or function");
    }

    if (stripFunc) {
        script = script.trim();
        const start = script.indexOf('{');
        script = script.substring(start + 1, script.length - 1);
    }

    const blob = new Blob([script], { type: "text/javascript" }),
        dataURI = URL.createObjectURL(blob);
    return new Worker(dataURI);
}
