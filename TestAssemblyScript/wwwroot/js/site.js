function sleep(dt) {
    return new Promise((resolve) => {
        setTimeout(resolve, dt);
    });
}

function nodeList2Array(list) {
    const arr = new Array(list.length);
    for (let i = 0; i < list.length; ++i) {
        arr[i] = list[i];
    }
    return arr;
}

const [inputT, sourceT, outputT] = nodeList2Array(document.getElementsByTagName("textarea"));
sourceT.addEventListener("keydown", async (evt) => {
    if (evt.key === "Enter"
        && evt.ctrlKey
        && !evt.shiftKey
        && !evt.altKey
        && !evt.metaKey) {
        outputT.value = "";
        console.clear();
        await sleep(250);
        const func = new Function("input", "let output = '';" + sourceT.value + ";return output;");
        outputT.value = func(inputT.value);
    }
});
//# sourceMappingURL=site.js.map
