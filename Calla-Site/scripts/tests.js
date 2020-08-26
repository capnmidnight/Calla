import { HtmlTestOutput as TestOutput } from "./test/testing/HtmlTestOutput";
import { MathTests } from "./test/tests/math";

const cons = new TestOutput(MathTests);
document.body.append(cons.element);
cons.run();