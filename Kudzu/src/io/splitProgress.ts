import { isNumber } from "../typeChecks";
import type { progressCallback } from "./progressCallback";

export function splitProgress(onProgress: progressCallback|undefined, weights: number | number[]) {

    let subProgressWeights: number[];
    if (isNumber(weights)) {
        subProgressWeights = new Array<number>(weights);
        for (let i = 0; i < subProgressWeights.length; ++i) {
            subProgressWeights[i] = 1 / weights;
        }
    }
    else {
        subProgressWeights = weights;
    }

    let weightTotal = 0;
    for (let i = 0; i < subProgressWeights.length; ++i) {
        weightTotal += subProgressWeights[i];
    }

    const subProgressValues = new Array<number>(subProgressWeights.length);

    const subProgressCallbacks = new Array<progressCallback>(subProgressWeights.length);
    const start = performance.now();
    const update = (i: number, subSoFar: number, subTotal: number, msg?: string) => {
        if (onProgress) {
            subProgressValues[i] = subSoFar / subTotal;
            let soFar = 0;
            for (let j = 0; j < subProgressWeights.length; ++j) {
                soFar += subProgressValues[j] * subProgressWeights[j];
            }

            const end = performance.now();
            const delta = end - start;
            const est = start - end + delta * weightTotal / soFar;
            onProgress(soFar, weightTotal, msg, est);
        }
    };

    for (let i = 0; i < subProgressWeights.length; ++i) {
        subProgressValues[i] = 0;
        subProgressCallbacks[i] = (soFar: number, total: number, msg?: string) => update(i, soFar, total, msg);
    }

    return subProgressCallbacks;
}

