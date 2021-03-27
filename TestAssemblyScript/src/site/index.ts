import { sleep } from "kudzu/events/sleep";

const [inputT, sourceT, outputT] = Array.from(document.getElementsByTagName("textarea"));

sourceT.addEventListener("keydown", async (evt) => {
    if (evt.key === "Enter"
        && evt.ctrlKey
        && !evt.shiftKey
        && !evt.altKey
        && !evt.metaKey) {
        outputT.value = "";
        console.clear();
        await sleep(250);
        const func = new Function("input", "let output = '';" +  sourceT.value + ";return output;");
        outputT.value = func(inputT.value);
    }
})