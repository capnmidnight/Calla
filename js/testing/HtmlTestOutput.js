import { col, monospaceFamily, style } from "../src/html/attrs.js";
import { onClick } from "../src/html/evts.js";
import { Button, clear, Div, Span } from "../src/html/tags.js";
import { TestOutput } from "./TestOutput.js";
import { TestState } from "./TestState.js";


function bar(color, width) {
    return style({
        backgroundColor: color,
        color,
        width
    });
}

function refresher(thunk, ...rest) {
    return Button(
        onClick(thunk),
        col(1),
        "\u{1F504}\u{FE0F}",
        ...rest);
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
            const s = Math.round(100 * evt.stats.totalSucceeded / evt.stats.totalFound),
                f = Math.round(100 * evt.stats.totalFailed / evt.stats.totalFound),
                t = Math.round(100 * (evt.stats.totalFound - evt.stats.totalSucceeded - evt.stats.totalFailed) / evt.stats.totalFound),
                basicStyle = style({
                    display: "inline-block",
                    overflow: "hidden",
                    height: "1em"
                }),
                table = Div(
                    style({
                        fontFamily: monospaceFamily,
                        width: "100%",
                        display: "grid",
                        gridTemplateColumns: "auto auto auto 1fr",
                        columnGap: "1em"
                    }),
                    refresher(() => this.run()),
                    Div(
                        col(2, 3),
                        style({
                            height: "2em",
                            whiteSpace: "nowrap",
                            overflow: "hidden"
                        }),
                        Span(basicStyle, bar("green", s + "%")),
                        Span(basicStyle, bar("red", f + "%")),
                        Span(basicStyle, bar("grey", t + "%"))),
                    Div(col(1), "Rerun"),
                    Div(col(2), "Name"),
                    Div(col(3), "Status"));
            for (let testCaseName in evt.table) {
                table.append(
                    Div(col(2, 3), testCaseName),
                    refresher(() => this.run(testCaseName)));
                for (let testName in evt.table[testCaseName]) {
                    const e = evt.table[testCaseName][testName];
                    table.append(
                        refresher(() => this.run(testCaseName, testName)),
                        Div(col(2), testName),
                        Div(col(3), makeStatus(e.state)),
                        Div(col(4), e.messages.join(", ")));
                }
            }
            clear(this.element);
            this.element.appendChild(table);
        };
        this.addEventListener("testoutputresults", draw);
    }
}
