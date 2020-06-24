export class TestCaseSuccessEvent extends Event {
    constructor(message) {
        super("testcasesuccess");
        this.message = message;
    }
}
