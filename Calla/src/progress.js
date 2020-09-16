import { isNumber } from "./typeChecks";

/**
 * @param {import("./fetching").progressCallback} onProgress
 * @param {Number|Number[]} subProgressWeights
 * @returns {import("./fetching").progressCallback[])
 */
export function splitProgress(onProgress, subProgressWeights) {
    if (isNumber(subProgressWeights)) {
        const numWeights = subProgressWeights;
        subProgressWeights = new Array(numWeights);
        for (let i = 0; i < numWeights; ++i) {
            subProgressWeights[i] = 1 /numWeights;
        }
    }

    let weightTotal = 0;
    for (let i = 0; i < subProgressWeights.length; ++i) {
        weightTotal += subProgressWeights[i];
    }

    /** @type {Number[]} */
    const subProgressValues = new Array(subProgressWeights.length);

    /** @type {import("./fetching").progressCallback[]} */
    const subProgressCallbacks = new Array(subProgressWeights.length);

    /**
     * @param {Number} i
     * @param {Number} subSoFar
     * @param {Number} subTotal
     * @param {String?} msg
     **/
    const update = (i, subSoFar, subTotal, msg) => {
        subProgressValues[i] = subSoFar / subTotal;
        let soFar = 0;
        for (let j = 0; j < subProgressWeights.length; ++j) {
            soFar += subProgressValues[j] * subProgressWeights[j];
        }
        onProgress(soFar, weightTotal, msg);
    };

    for (let i = 0; i < subProgressWeights.length; ++i) {
        subProgressValues[i] = 0;
        subProgressCallbacks[i] = (soFar, total, msg) => update(i, soFar, total, msg);
    }

    return subProgressCallbacks;
}