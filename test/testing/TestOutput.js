import { EventBase } from "../../js/src/index.js";
import { TestOutputResultsEvent } from "./TestOutputResultsEvent.js";
import { TestRunner } from "./TestRunner.js";
import { TestRunnerResultsEvent } from "./TestRunnerResultsEvent.js";
import { TestStates } from "./TestStates.js";

export class TestOutput extends EventBase {
    constructor(...rest) {
        super();
        this.rest = rest;
    }

    /**
     * Runs a specific test within a test case.
     * @param {string} caseName
     * @param {string} testName
     */
    async run(caseName, testName) {
        const testRunner = new TestRunner(...this.rest);
        testRunner.addEventListener("testrunnerresults", (/** @type {TestRunnerResultsEvent} */evt) => {
            const results = evt.results;
            let totalFound = 0,
                totalRan = 0,
                totalCompleted = 0,
                totalIncomplete = 0,
                totalSucceeded = 0,
                totalFailed = 0;
            for (let testCase of results.values()) {
                for (let test of testCase.values()) {
                    ++totalFound;
                    if (test.state & TestStates.started) {
                        ++totalRan;
                    }
                    if (test.state & TestStates.completed) {
                        ++totalCompleted;
                    }
                    else {
                        ++totalIncomplete;
                    }
                    if (test.state & TestStates.succeeded) {
                        ++totalSucceeded;
                    }
                    if (test.state & TestStates.failed) {
                        ++totalFailed;
                    }
                }
            }

            /** @type {TestStats} */
            const stats = {
                totalFound,
                totalRan,
                totalCompleted,
                totalIncomplete,
                totalSucceeded,
                totalFailed
            };
            this.dispatchEvent(new TestOutputResultsEvent(results, stats));
        });
        testRunner.run(caseName, testName);
    }
}
