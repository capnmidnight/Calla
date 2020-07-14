/**
 * @typedef {object} TestStats
 * @property {number} totalFound
 * @property {number} totalRan
 * @property {number} totalCompleted
 * @property {number} totalIncomplete
 * @property {number} totalSucceeded
 * @property {number} totalFailed
 * */

export class TestOutputResultsEvent extends Event {
    /**
     * 
     * @param {any} results
     * @param {TestStats} stats
     */
    constructor(results, stats) {
        super("testoutputresults");
        this.results = results;
        this.stats = stats;
    }
}
