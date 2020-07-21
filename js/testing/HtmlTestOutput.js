import { gridCol, gridCols, monospaceFamily, style } from "../src/html/attrs.js";
import { onClick } from "../src/html/evts.js";
import { Button, clear, Div, Span } from "../src/html/tags.js";
import { TestOutput } from "./TestOutput.js";
import { TestOutputResultsEvent } from "./TestOutputResultsEvent.js";
import { TestStates } from "./TestStates.js";


/**
 * Creates a portion of a progress bar.
 * @param {string} color - a CSS color value
 * @param {string} width - a CSS size value
 */
function bar(color, width) {
    return style({
        backgroundColor: color,
        color,
        width
    });
}

/**
 * @callback onClickCallback
 * @param {MouseEvent} evt
 */

/**
 * 
 * @param {onClickCallback} thunk
 * @param {...any} rest
 */
function refresher(thunk, ...rest) {
    return Button(
        onClick(thunk),
        gridCol(1),
        "\u{1F504}\u{FE0F}",
        ...rest);
}

function makeStatus(id) {
    const complete = id & TestStates.completed;

    if (id & TestStates.failed) {
        return complete ? "Failure" : "Failing";
    }
    else if (id & TestStates.succeeded) {
        return complete ? "Success" : "Succeeding";
    }
    else if (id & TestStates.started) {
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
        /**
         * 
         * @param {TestOutputResultsEvent} evt
         */
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
                    gridCols("auto", "auto", "auto", "1fr"),
                    style({
                        fontFamily: monospaceFamily,
                        width: "100%",
                        columnGap: "1em"
                    }),
                    refresher(() => this.run()),
                    Div(
                        gridCol(2, 3),
                        style({
                            height: "2em",
                            whiteSpace: "nowrap",
                            overflow: "hidden"
                        }),
                        Span(basicStyle, bar("green", s + "%")),
                        Span(basicStyle, bar("red", f + "%")),
                        Span(basicStyle, bar("grey", t + "%"))),
                    Div(gridCol(1), "Rerun"),
                    Div(gridCol(2), "Name"),
                    Div(gridCol(3), "Status"));
            for (let [testCaseName, testCase] of evt.results.entries()) {
                table.append(
                    Div(gridCol(2, 3), testCaseName),
                    refresher(() => this.run(testCaseName)));
                for (let [testName, test] of testCase.entries()) {
                    table.append(
                        refresher(() => this.run(testCaseName, testName)),
                        Div(gridCol(2), testName),
                        Div(gridCol(3), makeStatus(test.state)),
                        Div(gridCol(4), test.messages.join(", ")));
                }
            }
            clear(this.element);
            this.element.appendChild(table);
        };
        this.addEventListener("testoutputresults", draw);
    }
}
