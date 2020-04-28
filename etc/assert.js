class TestOutputResultsEvent extends Event {
    constructor(table, stats) {
        super("testoutputresults");
        this.table = table;
        this.stats = stats;
    }
}

class TestOutput extends EventTarget {
    constructor(...CaseClasses) {
        super();
        this.CaseClasses = CaseClasses;
    }

    async run(className, testName) {
        const testRunner = new TestRunner(...this.CaseClasses);

        testRunner.addEventListener("testrunneresults", (evt) => {
            const table = evt.results;
            let totalFound = 0,
                totalRan = 0,
                totalCompleted = 0,
                totalIncomplete = 0,
                totalSucceeded = 0,
                totalFailed = 0;

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

                    if (test.state & TestState.incomplete) {
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

export class ConsoleTestOutput extends TestOutput {
    constructor(TestRunnerClass, ...CaseClasses) {
        super(TestRunnerClass, ...CaseClasses);
        this.addEventListener("testoutputresults", (evt) => {
            console.clear();
            for (let testCaseName in evt.table) {
                console.group(testCaseName);
                console.table(evt.table[testCaseName]);
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
    constructor(container, ...CaseClasses) {
        super(...CaseClasses);

        const draw = (evt) => {
            console.table(evt.stats);

            const table = document.createElement("table"),
                tbody = document.createElement("tbody"),
                progRow = document.createElement("tr"),
                progCell = document.createElement("td"),
                rerunCell = document.createElement("td"),
                progFound = document.createElement("span"),
                progFailed = document.createElement("span"),
                progSucceeded = document.createElement("span"),
                rerunButton = document.createElement("button");

            table.style.width = "100%";

            progCell.colSpan = 4;
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

            rerunButton.type = "button";
            rerunButton.innerHTML = "\u{1F504}\u{FE0F}";
            rerunButton.addEventListener("click", (evt) => {
                this.run();
            });

            progCell.appendChild(progSucceeded);
            progCell.appendChild(progFailed);
            progCell.appendChild(progFound);
            progRow.appendChild(progCell);

            rerunCell.appendChild(rerunButton);
            progRow.appendChild(rerunCell);
            tbody.appendChild(progRow);

            for (let testCaseName in evt.table) {
                const groupHeaderRow = document.createElement("tr"),
                    groupHeaderCell = document.createElement("td"),
                    rerunGroupCell = document.createElement("td"),
                    rerunGroupButton = document.createElement("button");

                groupHeaderCell.colSpan = 4;
                groupHeaderCell.appendChild(document.createTextNode(testCaseName));

                rerunGroupCell.appendChild(rerunGroupButton);
                rerunGroupButton.type = "button";
                rerunGroupButton.innerHTML = "\u{1F504}\u{FE0F}";
                rerunGroupButton.addEventListener("click", (evt) => {
                    this.run(testCaseName);
                });

                groupHeaderRow.appendChild(groupHeaderCell);
                groupHeaderRow.appendChild(rerunGroupCell);
                tbody.appendChild(groupHeaderRow);

                for (let testName in evt.table[testCaseName]) {
                    const e = evt.table[testCaseName][testName],
                        funcRow = document.createElement("tr"),
                        nameCell = document.createElement("td"),
                        stateCell = document.createElement("td"),
                        valueCell = document.createElement("td"),
                        msgCell = document.createElement("td"),
                        rerunTestCell = document.createElement("td"),
                        rerunTestButton = document.createElement("button");

                    nameCell.appendChild(document.createTextNode(testName));
                    stateCell.innerHTML = TestStateNames[e.state];
                    valueCell.appendChild(document.createTextNode(e.value));
                    msgCell.appendChild(document.createTextNode(e.message));

                    rerunTestButton.type = "button";
                    rerunTestButton.innerHTML = "\u{1F504}\u{FE0F}";
                    rerunTestButton.addEventListener("click", (evt) => {
                        this.run(testCaseName, testName);
                    });

                    rerunTestCell.appendChild(rerunTestButton);

                    funcRow.appendChild(nameCell);
                    funcRow.appendChild(stateCell);
                    funcRow.appendChild(valueCell);
                    funcRow.appendChild(msgCell);
                    funcRow.appendChild(rerunTestCell);

                    tbody.appendChild(funcRow);
                }
            }

            container.innerHTML = "";
            table.appendChild(tbody);
            container.appendChild(table);
        };

        this.addEventListener("testoutputresults", draw);
    }
}

const TestState = {
    found: 0,
    started: 1,
    succeeded: 2,
    failed: 4,
    completed: 8,
    incomplete: 16,
};

const TestStateNames = {
    0: "Found",
    1: "Started",
    3: "Success",
    5: "Failure",
    11: "Succeeded",
    13: "Failed",
    17: "Incomplete",
    18: "Incomplete",
    19: "Incomplete",
    20: "Incomplete",
    21: "Incomplete",
    22: "Incomplete",
    23: "Incomplete",
    24: "Incomplete",
    25: "Incomplete",
    26: "Incomplete",
    27: "Incomplete",
    28: "Incomplete",
    29: "Incomplete",
    30: "Incomplete",
    31: "Incomplete",
};

class TestScore {
    constructor(name) {
        this.name = name;
        this.state = TestState.found;
        this.value = null;
        this.message = null;
    }

    start() {
        this.state |= TestState.started;
    }

    success(message) {
        this.state |= TestState.succeeded;
        this.message = message;
    }

    fail(message) {
        this.state |= TestState.failed;
        this.message = message;
    }

    complete(value) {
        this.state |= TestState.completed;
        this.value = value;
    }

    incomplete(value) {
        this.state |= TestState.incomplete;
        this.value = value;
    }
}

class TestRunnerResultsEvent extends Event {
    constructor(results) {
        super("testrunneresults");
        this.results = results;
    }
}

class TestRunner extends EventTarget {
    constructor(...CaseClasses) {
        super();
        this.CaseClasses = CaseClasses;
    }

    async run(testCaseName, testName) {

        const results = {};
        const onUpdate = () => this.dispatchEvent(new TestRunnerResultsEvent(results));

        for (let CaseClass of this.CaseClasses) {
            results[CaseClass.name] = {};
            for (let name of this.testNames(CaseClass.prototype)) {
                if (this.isTest(CaseClass.prototype, name)) {
                    results[CaseClass.name][name] = new TestScore(name);
                    onUpdate();
                }
            }
        }

        const q = [];
        for (let CaseClass of this.CaseClasses) {
            const className = CaseClass.name;
            if (className === testCaseName
                || testCaseName === undefined
                || testCaseName === null) {
                for (let funcName of this.testNames(CaseClass.prototype)) {
                    if (this.isTest(CaseClass.prototype, funcName, testName)) {
                        q.push(this.runTest.bind(this, CaseClass, funcName, results, className, onUpdate));
                    }
                }
            }
        }

        const update = () => {
            if (q.length > 0) {
                const test = q.shift();
                test()
                    .then(restart)
                    .catch(restart);
            }
        },
            restart = () => setTimeout(update, 0);
        restart();
    }

    async runTest(CaseClass, funcName, results, className, onUpdate) {
        const testCase = new CaseClass(),
            func = testCase[funcName],
            score = results[className][funcName],
            onSuccess = (evt) => {
                score.success(evt.message);
                onUpdate();
            },
            onFailure = (evt) => {
                score.fail(evt.message);
                onUpdate();
            };
        testCase.addEventListener("testcasesuccess", onSuccess);
        testCase.addEventListener("testcasefail", onFailure);
        try {
            score.start();
            onUpdate();
            testCase.setup();
            let value = func.call(testCase);
            if (value instanceof Promise) {
                value = await value;
            }
            score.complete(value);
            onUpdate();
            testCase.teardown();
        }
        catch (error) {
            score.incomplete(error);
        }
        testCase.removeEventListener("testcasefail", onFailure);
        testCase.removeEventListener("testcasesuccess", onSuccess);
        onUpdate();
    }

    isTest(testCase, name, testName) {
        return (name === testName
            || ((testName === undefined || testName === null)
                && name.startsWith("test_")))
            && testCase[name] instanceof Function;
    }

    testNames(TestClass) {
        return Object.getOwnPropertyNames(TestClass);
    }
}

class TestCaseSuccessEvent extends Event {
    constructor(message) {
        super("testcasesuccess");
        this.message = message;
    }
}

class TestCaseFailEvent extends Event {
    constructor(message) {
        super("testcasefail");
        this.message = message;
    }
}

export class TestCase extends EventTarget {
    setup() { }
    teardown() { }

    success(message) {
        message = message || "Success";
        this.dispatchEvent(new TestCaseSuccessEvent(message));
    }

    fail(message) {
        message = message || "Fail";
        this.dispatchEvent(new TestCaseFailEvent(message));
    }

    isEqualTo(actual, expected, message) {
        this._twoValueTest(actual, "===", expected, (a, b) => a === b, message);
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
        this._twoValueTest(actual, "!==", expected, (a, b) => a !== b, message);
    }

    isLessThan(actual, expected, message) {
        this._twoValueTest(actual, "<", expected, (a, b) => a < b, message);
    }

    isLessThanEqual(actual, expected, message) {
        this._twoValueTest(actual, "<=", expected, (a, b) => a <= b, message);
    }

    isGreaterThan(actual, expected, message) {
        this._twoValueTest(actual, ">", expected, (a, b) => a > b, message);
    }

    isGreaterThanEqual(actual, expected, message) {
        this._twoValueTest(actual, ">=", expected, (a, b) => a >= b, message);
    }

    throws(func, message) {
        this._throwTest(func, true, message);
    }

    doesNotThrow(func, message) {
        this._throwTest(func, false, message);
    }


    _twoValueTest(actual, op, expected, testFunc, message) {
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

    _throwTest(func, op, message) {
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
}