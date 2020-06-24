import { isFunction } from "../src/html/evts.js";
import { TestOutputResultsEvent } from "./TestOutputResultsEvent.js";
import { TestState } from "./TestState.js";
import { TestRunner } from "./TestRunner.js";

export class TestOutput extends EventTarget {
    constructor(...rest) {
        super();
        this.rest = rest;
    }
    async run(className, testName) {
        const testRunner = new TestRunner(...this.rest);
        testRunner.addEventListener("testrunnerresults", (evt) => {
            const table = evt.results;
            let totalFound = 0, totalRan = 0, totalCompleted = 0, totalIncomplete = 0, totalSucceeded = 0, totalFailed = 0;
            for (let testCaseName in table) {
                const testCase = table[testCaseName];
                for (let testName in testCase) {
                    const test = testCase[testName];
                    ++totalFound;
                    if (test.state & TestState.started) {
                        ++totalRan;
                    }
                    if (test.state & TestState.completed) {
                        ++totalCompleted;
                    }
                    else {
                        ++totalIncomplete;
                    }
                    if (test.state & TestState.succeeded) {
                        ++totalSucceeded;
                    }
                    if (test.state & TestState.failed) {
                        ++totalFailed;
                    }
                }
            }
            const stats = {
                totalFound,
                totalRan,
                totalCompleted,
                totalIncomplete,
                totalSucceeded,
                totalFailed
            };
            this.dispatchEvent(new TestOutputResultsEvent(table, stats));
        });
        testRunner.run(className, testName);
    }
}
