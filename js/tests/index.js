import { HtmlTestOutput as TestOutput } from "../testing/HtmlTestOutput.js";
import { MathTests } from "./math.js";

const cons = new TestOutput(MathTests);
document.body.append(cons.element);
cons.run();