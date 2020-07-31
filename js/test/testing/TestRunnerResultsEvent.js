import { TestScore } from "./TestScore.js";

/**
 * @typedef {Map<string, Map<string, TestScore>>} TestResults*/

/**
 * An Event that encapsulates a test result.
 **/
export class TestRunnerResultsEvent extends Event {
    /**
     * Creates a new test result event containing the results.
     * @param {TestResults} results
     */
    constructor(results) {
        super("testrunnerresults");
        this.results = results;
    }
}
