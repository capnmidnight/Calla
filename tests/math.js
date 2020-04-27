import { TestCase } from "../etc/assert.js";
import { lerp } from "../scripts/math.js";

export class MathTests extends TestCase {
    test_Lerp() {
        const start = 0,
            end = 1,
            p = 0.5,
            actual = lerp(start, end, p),
            expected = 0.5;

        this.isEqualTo(actual, expected);
    }
}