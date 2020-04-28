import "../scripts/protos.js";
import { TestCase } from "../etc/assert.js";
import { lerp } from "../scripts/math.js";

export class MathTests extends TestCase {
    test_Lerp0() {
        const start = 0,
            end = 1,
            p = 0,
            actual = lerp(start, end, p),
            expected = 0;

        this.isEqualTo(actual, expected);
    }
    test_Lerp1() {
        const start = 0,
            end = 1,
            p = 0.1,
            actual = lerp(start, end, p),
            expected = 0.1;

        this.isEqualTo(actual, expected);
    }
    test_Lerp2() {
        const start = 0,
            end = 1,
            p = 0.2,
            actual = lerp(start, end, p),
            expected = 0.2;

        this.isEqualTo(actual, expected);
    }
    test_Lerp3() {
        const start = 0,
            end = 1,
            p = 0.3,
            actual = lerp(start, end, p),
            expected = 0.3;

        this.isEqualTo(actual, expected);
    }
    test_Lerp4() {
        const start = 0,
            end = 1,
            p = 0.4,
            actual = lerp(start, end, p),
            expected = 0.4;

        this.isEqualTo(actual, expected);
    }
    test_Lerp5() {
        const start = 0,
            end = 1,
            p = 0.5,
            actual = lerp(start, end, p),
            expected = 0.5;

        this.isEqualTo(actual, expected);
    }
    test_Lerp6() {
        const start = 0,
            end = 1,
            p = 0.6,
            actual = lerp(start, end, p),
            expected = 0.6;

        this.isEqualTo(actual, expected);
    }
    test_Lerp7() {
        const start = 0,
            end = 1,
            p = 0.7,
            actual = lerp(start, end, p),
            expected = 0.7;

        this.isEqualTo(actual, expected);
    }
    test_Lerp8() {
        const start = 0,
            end = 1,
            p = 0.8,
            actual = lerp(start, end, p),
            expected = 0.8;

        this.isEqualTo(actual, expected);
    }
    test_Lerp9() {
        const start = 0,
            end = 1,
            p = 0.9,
            actual = lerp(start, end, p),
            expected = 0.9;

        this.isEqualTo(actual, expected);
    }
    test_Lerp10() {
        const start = 0,
            end = 1,
            p = 1,
            actual = lerp(start, end, p),
            expected = 1;

        this.isEqualTo(actual, expected);
    }
    test_Lerp11() {
        const start = 0,
            end = 1,
            p = 1.1,
            actual = lerp(start, end, p),
            expected = 1.1;

        this.isEqualTo(actual, expected);
    }

    async test_Mouse() {
        this.message("Move the mouse");
        const evt = await window.getEventValue("mousemove");
        this.hasValue(evt);
    }
}