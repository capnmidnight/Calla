import { colSpan, monospaceFamily, style } from "../src/html/attrs.js";
import { clear, Div, Span, Table, TBody, TD, TR, Button } from "../src/html/tags.js";
import { TestOutput } from "./TestOutput.js";
import { TestState } from "./TestState.js";
import { onClick } from "../src/html/evts.js";


function bar(color, width) {
    return style({
        backgroundColor: color,
        color,
        width
    });
}

function refresher(thunk) {
    return TD(Button(
        onClick(thunk),
        "\u{1F504}\u{FE0F}"));
}

function makeStatus(id) {
    const complete = id & TestState.completed;

    if (id & TestState.failed) {
        return complete ? "Failure" : "Failing";
    }
    else if (id & TestState.succeeded) {
        return complete ? "Success" : "Succeeding";
    }
    else if (id & TestState.started) {
        return complete ? "No test ran" : "Running";
    }
    else {
        return "Found";
    }
}

export class HtmlTestOutput extends TestOutput {
    constructor(...CaseClasses) {
        super(...CaseClasses);
        this.element = Div(style({
            overflowY: "scroll"
        }));
        const draw = (evt) => {
            const s = Math.round(100 * evt.stats.totalSucceeded / evt.stats.totalFound), f = Math.round(100 * evt.stats.totalFailed / evt.stats.totalFound), t = Math.round(100 * (evt.stats.totalFound - evt.stats.totalSucceeded - evt.stats.totalFailed) / evt.stats.totalFound), basicStyle = style({
                display: "inline-block",
                overflow: "hidden",
                height: "1em"
            }), table = Table(style({
                fontFamily: monospaceFamily,
                width: "100%"
            }), TBody(TR(TD(colSpan(3), style({ height: "2em" }), Span(basicStyle, bar("green", s + "%")), Span(basicStyle, bar("red", f + "%")), Span(basicStyle, bar("grey", t + "%"))), refresher(() => this.run())), TR(TD("Name"), TD("Status"), TD(), TD("Rerun")))), tbody = table.querySelector("tbody");
            for (let testCaseName in evt.table) {
                tbody.appendChild(TR(TD(colSpan(3), testCaseName), refresher(() => this.run(testCaseName))));
                for (let testName in evt.table[testCaseName]) {
                    const e = evt.table[testCaseName][testName];
                    tbody.appendChild(TR(TD(testName), TD(makeStatus(e.state)), TD(e.messages.join(", ")), refresher(() => this.run(testCaseName, testName))));
                }
            }
            clear(this.element);
            this.element.appendChild(table);
        };
        this.addEventListener("testoutputresults", draw);
    }
}
