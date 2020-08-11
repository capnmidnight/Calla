import { HtmlTestOutput as TestOutput } from "./test/testing/HtmlTestOutput.js";
import { MathTests } from "./test/tests/math.js";

const cons = new TestOutput(MathTests);
document.body.append(cons.element);
cons.run();