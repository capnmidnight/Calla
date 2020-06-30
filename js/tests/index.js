import { HtmlTestOutput as TestOutput } from "../testing/HtmlTestOutput.js";
import { MathTests } from "./math.js";
import { openTestWindow } from "../testing/windowing.js";

const cons = new TestOutput(MathTests);
document.body.append(cons.element);
cons.run();

window.openTestWindow = openTestWindow;

for (let link of document.querySelectorAll(".testWindow")) {
    link.href = `javascript:openTestWindow("${link.href}")`;
}