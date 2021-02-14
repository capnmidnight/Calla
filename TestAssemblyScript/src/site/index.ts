import { sleep } from "kudzu/events/sleep";
import { nodeList2Array } from "kudzu/html/tags";

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
        const func = new Function("input", "let output = '';" +  sourceT.value + ";return output;");
        outputT.value = func(inputT.value);
    }
})