export class TestCaseFailEvent extends Event {
    constructor(message) {
        super("testcasefail");
        this.message = message;
    }
}
