export class TestRunnerResultsEvent extends Event {
    constructor(results) {
        super("testrunnerresults");
        this.results = results;
    }
}
