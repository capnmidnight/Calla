class TestOutput extends EventTarget {
    constructor(TestRunnerClass, ...CaseClasses) {
        super();

        this.testRunner = new TestRunnerClass(...CaseClasses);
        this.testRunner.addEventListener("resultsupdated", (evt) => {
            const table = {};
            let totalFound = 0,
                totalRan = 0,
                totalCompleted = 0,
                totalIncomplete = 0,
                totalSucceeded = 0,
                totalFailed = 0;
            for (let name of evt.results.found) {
                ++totalFound;
                const parts = name.split("::"),
                    className = parts[0],
                    testName = parts[1];
                if (!table[className]) {
                    table[className] = {};
                }

                if (!table[className][testName]) {
                    table[className][testName] = {
                        started: false,
                        completed: false,
                        completedValue: null,
                        incomplete: false,
                        incompleteValue: null,
                        succeeded: false,
                        successMessage: null,
                        failed: false,
                        failedMessage: false
                    }
                }
            }

            for (let name of evt.results.started) {
                ++totalRan;
                const parts = name.split("::"),
                    className = parts[0],
                    testName = parts[1];
                table[className][testName].started = true;
            }

            for (let event of evt.results.succeeded) {
                ++totalSucceeded;
                const name = event.name,
                    parts = name.split("::"),
                    className = parts[0],
                    testName = parts[1],
                    message = event.message;
                table[className][testName].succeeded = true;
                table[className][testName].successMessage = message;
            }

            for (let event of evt.results.failed) {
                ++totalFailed;
                const name = event.name,
                    parts = name.split("::"),
                    className = parts[0],
                    testName = parts[1],
                    message = event.message;
                table[className][testName].failed = true;
                table[className][testName].failedMessage = message;
            }

            for (let event of evt.results.completed) {
                ++totalCompleted;
                const name = event.name,
                    parts = name.split("::"),
                    className = parts[0],
                    testName = parts[1],
                    value = event.value;
                table[className][testName].completed = true;
                table[className][testName].completedValue = value;
            }

            for (let event of evt.results.incomplete) {
                ++totalIncomplete;
                const name = event.name,
                    parts = name.split("::"),
                    className = parts[0],
                    testName = parts[1],
                    error = event.error;
                table[className][testName].incomplete = true;
                table[className][testName].incompleteValue = error;
            }

            const stats = {
                totalFound,
                totalRan,
                totalCompleted,
                totalIncomplete,
                totalSucceeded,
                totalFailed
            };

            this.dispatchEvent(new OutputResultsEvent(table, stats));
        });
    }

    async run(className, testName) {
        this.testRunner.run(className, testName);
    }
}

class OutputResultsEvent extends Event {
    constructor(table, stats) {
        super("outputresultsupdated");
        this.table = table;
        this.stats = stats;
    }
}

export class ConsoleTestOutput extends TestOutput {
    constructor(TestRunnerClass, ...CaseClasses) {
        super(TestRunnerClass, ...CaseClasses);
        this.addEventListener("outputresultsupdated", (evt) => {
            console.clear();
            for (let className in evt.table) {
                console.group(className);
                console.table(evt.table[className]);
                console.groupEnd();
            }
            console.table(evt.stats);

            let foundLabel = "%c",
                failedLabel = "%c",
                succeededLabel = "%c";
            while (evt.stats.totalFound > 0) {
                if (evt.stats.totalFailed > 0) {
                    failedLabel += "o";
                    --evt.stats.totalFailed;
                }
                else if (evt.stats.totalSucceeded > 0) {
                    succeededLabel += "o";
                    --evt.stats.totalSucceeded;
                }
                else {
                    foundLabel += "o";
                }
                --evt.stats.totalFound;
            }

            console.log(succeededLabel + failedLabel + foundLabel, "color: green", "color: red", "color: grey");
        });
    }
}

export class HtmlTestOutput extends TestOutput {
    constructor(container, TestRunnerClass, ...CaseClasses) {
        super(TestRunnerClass, ...CaseClasses);

        const draw = (evt) => {
            console.table(evt.stats);

            const table = document.createElement("table"),
                tbody = document.createElement("tbody"),
                progRow = document.createElement("tr"),
                progCell = document.createElement("td"),
                progFound = document.createElement("span"),
                progFailed = document.createElement("span"),
                progSucceeded = document.createElement("span");

            table.style.width = "100%";

            progCell.colSpan = 3;
            progCell.style.height = "2em";

            progSucceeded.style.position = "absolute";
            progSucceeded.style.overflow = "hidden";
            progSucceeded.style.backgroundColor = "green";
            progSucceeded.style.color = "green";
            progSucceeded.style.width = Math.round(100 * evt.stats.totalSucceeded / evt.stats.totalFound) + "%";
            progSucceeded.style.height = "1em";
            progSucceeded.innerHTML = ".";

            progFailed.style.position = "absolute";
            progFailed.style.overflow = "hidden";
            progFailed.style.backgroundColor = "red";
            progFailed.style.color = "red";
            progFailed.style.width = Math.round(100 * evt.stats.totalFailed / evt.stats.totalFound) + "%";
            progFailed.style.height = "1em";
            progFailed.innerHTML = ".";

            progFound.style.position = "absolute";
            progFound.style.overflow = "hidden";
            progFound.style.backgroundColor = "grey";
            progFound.style.color = "grey";
            progFound.style.width = Math.round(100 * (evt.stats.totalFound - evt.stats.totalSucceeded - evt.stats.totalFailed) / evt.stats.totalFound) + "%";
            progFound.style.height = "1em";
            progFound.innerHTML = ".";

            progCell.appendChild(progSucceeded);
            progCell.appendChild(progFailed);
            progCell.appendChild(progFound);
            progRow.appendChild(progCell);
            tbody.appendChild(progRow);

            for (let className in evt.table) {
                const groupHeaderRow = document.createElement("tr"),
                    groupHeaderCell = document.createElement("td");

                groupHeaderRow.appendChild(groupHeaderCell);
                groupHeaderCell.appendChild(document.createTextNode(className));
                groupHeaderCell.colSpan = 3;
                tbody.appendChild(groupHeaderRow);

                for (let funcName in evt.table[className]) {
                    const e = evt.table[className][funcName],
                        funcRow = document.createElement("tr"),
                        nameCell = document.createElement("td"),
                        stateCell = document.createElement("td"),
                        valueCell = document.createElement("td");

                    nameCell.appendChild(document.createTextNode(funcName));
                    stateCell.innerHTML = e.succeeded
                        ? "Success"
                        : e.failed
                            ? "Failed"
                            : e.completed
                                ? "Complete"
                                : e.incomplete
                                    ? "Incomplete"
                                    : e.started
                                        ? "Started"
                                        : "Not started";

                    valueCell.appendChild(document.createTextNode(
                        e.succeeded
                            ? e.successMessage
                            : e.failed
                                ? e.failedMessage
                                : e.completed
                                    ? e.completedValue
                                    : e.incomplete
                                        ? e.incompleteValue
                                        : e.started
                                            ? null
                                            : "Not started"));

                    funcRow.appendChild(nameCell);
                    funcRow.appendChild(stateCell);
                    funcRow.appendChild(valueCell);

                    tbody.appendChild(funcRow);
                }
            }

            container.innerHTML = "";
            table.appendChild(tbody);
            container.appendChild(table);
        };

        this.addEventListener("outputresultsupdated", draw);
    }
}

export class TestRunner extends EventTarget {
    constructor(...CaseClasses) {
        super();

        this.caseTypes = [];
        for (let CaseClass of CaseClasses) {
            this.addCase(CaseClass);
        }
    }

    addCase(CaseClass) {
        this.caseTypes.push(CaseClass);
    }

    async run(className, testName) {

        const results = {
            found: [],
            started: [],
            completed: [],
            incomplete: [],
            succeeded: [],
            failed: []
        };

        const onUpdate = () => this.dispatchEvent(new TestRunResultsEvent(results));

        let currentTestName = null;
        const cases = this.caseTypes
            .filter(Class => Class.name === className
                || className === undefined
                || className === null)
            .map(Class => {
                const testCase = new Class();
                testCase.addEventListener("testfound", (evt) => {
                    const name = Class.name + "::" + evt.name;
                    results.found.push(name);
                    onUpdate();
                });
                testCase.addEventListener("teststarted", (evt) => {
                    const name = Class.name + "::" + evt.name;
                    currentTestName = name;
                    results.started.push(name);
                    onUpdate();
                });
                testCase.addEventListener("testsucceeded", (evt) => {
                    evt.name = currentTestName;
                    results.succeeded.push(evt);
                    onUpdate();
                });
                testCase.addEventListener("testfailed", (evt) => {
                    evt.name = currentTestName;
                    results.failed.push(evt);
                    onUpdate();
                });
                testCase.addEventListener("testcompleted", (evt) => {
                    evt.name = currentTestName;
                    results.completed.push(evt);
                    onUpdate();
                });
                testCase.addEventListener("testnotcompleted", (evt) => {
                    evt.name = currentTestName;
                    results.incomplete.push(evt);
                    onUpdate();
                });
                testCase.find();
                return testCase;
            });

        for (let testCase of cases) {
            await testCase.run(testName);
        }
    }
}

class TestRunResultsEvent extends Event {
    constructor(results) {
        super("resultsupdated");
        this.results = results;
    }
}

export class TestCase extends EventTarget {
    setup() { }
    teardown() { }

    found(name) {
        this.dispatchEvent(new FoundEvent(name));
    }

    started(name) {
        this.dispatchEvent(new StartEvent(name));
    }

    complete(value) {
        this.dispatchEvent(new CompleteEvent(value));
    }

    incomplete(error) {
        this.dispatchEvent(new IncompleteEvent(error));
    }

    success(message) {
        message = message || "Success";
        this.dispatchEvent(new SuccessEvent(message));
    }

    fail(message) {
        message = message || "Fail";
        this.dispatchEvent(new FailEvent(message));
    }

    twoValueTest(actual, op, expected, testFunc, message) {
        const testValue = testFunc(actual, expected),
            testString = testValue ? "Success!" : "Fail!",
            testMessage = `Expect ${actual} ${op} ${expected} -> ${testString}`;

        message = ((message && message + ". ") || "") + testMessage;

        if (testValue) {
            this.success(message);
        }
        else {
            this.fail(message);
        }
    }

    isEqualTo(actual, expected, message) {
        this.twoValueTest(actual, "===", expected, (a, b) => a === b, message);
    }

    isNull(value, message) {
        this.isEqualTo(value, null, message);
    }

    isUndefined(value, message) {
        this.isEqualTo(value, undefined, message);
    }

    isTrue(value, message) {
        this.isEqualTo(value, true, message);
    }

    isFalse(value, message) {
        this.isEqualTo(value, false, message);
    }

    isEmpty(value, message) {
        this.isEqualTo(value.length, 0, message);
    }

    isNotEqualTo(actual, expected, message) {
        this.twoValueTest(actual, "!==", expected, (a, b) => a !== b, message);
    }

    isLessThan(actual, expected, message) {
        this.twoValueTest(actual, "<", expected, (a, b) => a < b, message);
    }

    isLessThanEqual(actual, expected, message) {
        this.twoValueTest(actual, "<=", expected, (a, b) => a <= b, message);
    }

    isGreaterThan(actual, expected, message) {
        this.twoValueTest(actual, ">", expected, (a, b) => a > b, message);
    }

    isGreaterThanEqual(actual, expected, message) {
        this.twoValueTest(actual, ">=", expected, (a, b) => a >= b, message);
    }

    throwTest(func, op, message) {
        let threw = false;
        try {
            func();
        }
        catch (exp) {
            threw = true;
        }

        const testValue = threw === op,
            testString = testValue ? "Success!" : "Fail!",
            testMessage = `Expected function to ${op} -> ${testString}`;

        message = ((message && message + ". ") || "") + testMessage;

        if (testValue) {
            this.success(message);
        }
        else {
            this.fail(message);
        }
    }

    throws(func, message) {
        this.throwTest(func, true, message);
    }

    doesNotThrow(func, message) {
        this.throwTest(func, false, message);
    }

    testNames() {
        return Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    }

    isTest(name, testName) {
        return (name === testName
            || ((testName === undefined || testName === null)
                && name.startsWith("test_")))
            && this[name] instanceof Function;
    }

    find() {
        for (let name of this.testNames()) {
            if (this.isTest(name)) {
                this.found(name);
            }
        }
    }

    async run(testName) {
        this.setup();
        for (let name of this.testNames()) {
            if (this.isTest(name, testName)) {
                const func = this[name];
                try {
                    this.started(name);

                    let value = func.call(this);
                    if (value instanceof Promise) {
                        value = await value;
                    }

                    this.complete(value);
                }
                catch (error) {
                    this.incomplete(error);
                }
            }
        }
        this.teardown();
    }
}

class FoundEvent extends Event {
    constructor(name) {
        super("testfound");
        this.name = name;
    }
}

class StartEvent extends Event {
    constructor(name) {
        super("teststarted");
        this.name = name;
    }
}

class SuccessEvent extends Event {
    constructor(message) {
        super("testsucceeded");
        this.message = message;
    }
}

class FailEvent extends Event {
    constructor(message) {
        super("testfailed");
        this.message = message;
    }
}

class CompleteEvent extends Event {
    constructor(value) {
        super("testcompleted");
        this.value = value;
    }
}

class IncompleteEvent extends Event {
    constructor(error) {
        super("testnotcompleted");
        this.error = error;
    }
}