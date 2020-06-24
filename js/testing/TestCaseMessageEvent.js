export class TestCaseMessageEvent extends Event {
    constructor(message) {
        super("testcasemessage");
        this.message = message;
    }
}
