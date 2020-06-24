export class TestOutputResultsEvent extends Event {
    constructor(table, stats) {
        super("testoutputresults");
        this.table = table;
        this.stats = stats;
    }
}
