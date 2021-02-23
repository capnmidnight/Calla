export function splitProgress(onProgress, subProgressWeights) {
    let weightTotal = 0;
    for (let i = 0; i < subProgressWeights.length; ++i) {
        weightTotal += subProgressWeights[i];
    }
    const subProgressValues = new Array(subProgressWeights.length);
    const subProgressCallbacks = new Array(subProgressWeights.length);
    const start = performance.now();
    const update = (i, subSoFar, subTotal, msg) => {
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
        subProgressCallbacks[i] = (soFar, total, msg) => update(i, soFar, total, msg);
    }
    return subProgressCallbacks;
}
//# sourceMappingURL=splitProgress.js.map