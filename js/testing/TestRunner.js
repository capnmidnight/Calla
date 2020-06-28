import { TestScore } from "./TestScore.js";
import { TestRunnerResultsEvent } from "./TestRunnerResultsEvent.js";
import { isFunction } from "../src/events.js";

export class TestRunner extends EventTarget {
    constructor(...rest) {
        super();
        this.props = rest.filter(v => !isFunction(v));
        this.CaseClasses = rest.filter(v => isFunction(v));
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
        }, restart = () => setTimeout(update, 0);
        restart();
    }
    async runTest(CaseClass, funcName, results, className, onUpdate) {
        const testCase = new CaseClass(),
            func = testCase[funcName],
            score = results[className][funcName],
            onMessage = (evt) => {
                score.messages.push(evt.message);
                onUpdate();
            }, onSuccess = (evt) => {
                score.success(evt.message);
                onUpdate();
            }, onFailure = (evt) => {
                score.fail(evt.message);
                onUpdate();
            };

        for (let prop of this.props) {
            Object.assign(testCase, prop);
        }

        testCase.addEventListener("testcasemessage", onMessage);
        testCase.addEventListener("testcasesuccess", onSuccess);
        testCase.addEventListener("testcasefail", onFailure);
        let message = null;
        try {
            score.start();
            onUpdate();
            testCase.setup();
            message = func.call(testCase);
            if (message instanceof Promise) {
                message = await message;
            }
        }
        catch (exp) {
            message = exp;
            onFailure({ message: exp });
        }
        score.finish(message);
        onUpdate();
        testCase.teardown();
        testCase.removeEventListener("testcasefail", onFailure);
        testCase.removeEventListener("testcasesuccess", onSuccess);
        testCase.removeEventListener("testcasemessage", onMessage);
        onUpdate();
    }
    isTest(testCase, name, testName) {
        return (name === testName
            || ((testName === undefined || testName === null)
                && name.startsWith("test_")))
            && testCase[name] instanceof Function;
    }
    testNames(TestClass) {
        const names = Object.getOwnPropertyNames(TestClass);
        names.sort();
        return names;
    }
}
