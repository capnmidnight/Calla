import { isModifierless } from "../events/isModifierless";
import { backgroundColor, color, columnGap, display, getMonospaceFamily, gridAutoFlow, gridColumn, height, left, opacity, overflow, overflowY, padding, pointerEvents, position, styles, top, width, zIndex } from "../html/css";
import { Div, elementClearChildren, elementSetDisplay, TextNode } from "../html/tags";
import { assertNever } from "../typeChecks";
import { ILogger, isWorkerLoggerMessageData, MessageType } from "./models";

function track(a: number, b: number) {
    return styles(
        gridColumn(`${a}/${b}`),
        getMonospaceFamily());
}

export class WindowLogger implements ILogger {
    private logs = new Map<string, Array<any>>();
    private rows = new Map<string, HTMLElement[]>();
    private container: HTMLElement;
    private grid: HTMLElement;
    private workerCount = 0;

    constructor() {
        this.container = Div(
            styles(
                position("fixed"),
                display("none"),
                top("0"),
                left("0"),
                width("100%"),
                height("100%"),
                zIndex(9001),
                padding("1em"),
                opacity("0.5"),
                backgroundColor("black"),
                color("white"),
                overflow("hidden"),
                pointerEvents("none")),
            this.grid = Div(
                styles(
                    display("grid"),
                    overflowY("auto"),
                    columnGap("0.5em"),
                    gridAutoFlow("row"))));

        document.body.appendChild(this.container);

        window.addEventListener("keypress", (evt) => {
            if (isModifierless(evt) && evt.key === '`') {
                elementSetDisplay(
                    this.container,
                    this.container.style.display === "none");
            }
        });
    }

    private render(): void {
        const toRemove = new Array<string>();
        for (const [id, row] of this.rows) {
            if (!this.logs.has(id)) {
                for (const cell of row) {
                    this.grid.removeChild(cell);
                }
                toRemove.push(id);
            }
        }

        for (const id of toRemove) {
            this.rows.delete(id);
        }

        let maxWidth = 0;
        for (const values of this.logs.values()) {
            maxWidth = Math.max(maxWidth, values.length);
        }

        this.grid.style.gridTemplateColumns = `auto repeat(${maxWidth}, 1fr)`;

        for (const [id, values] of this.logs) {
            let row = this.rows.get(id);
            if (!row) {
                row = [
                    Div(id, track(1, 2)),
                    ...values.map((_, i) => {
                        const isLast = i === values.length - 1;
                        const endTrack = isLast ? -1 : i + 3;
                        const cell = Div(track(i + 2, endTrack));
                        return cell;
                    })
                ];
                this.rows.set(id, row);
                this.grid.append(...row);
            }

            for (let i = 0; i < values.length; ++i) {
                const value = values[i];
                const cell = row[i + 1] as HTMLElement;
                elementClearChildren(cell);
                cell.appendChild(TextNode(JSON.stringify(value)));
            }
        }
    }

    log(id: string, ...values: any[]): void {
        this.logs.set(id, values);
        this.render();
    }

    delete(id: string): void {
        this.logs.delete(id);
        this.render();
    }

    clear(): void {
        this.logs.clear();
        this.render();
    }

    addWorker(name: string, worker: Worker) {
        worker.addEventListener("message", (evt): void => {
            const slug = `worker:${name || this.workerCount.toFixed(0)}:`;
            if (isWorkerLoggerMessageData(evt.data)) {
                switch (evt.data.method) {
                    case MessageType.Log:
                        this.log(slug + evt.data.id, ...evt.data.values);
                        break;
                    case MessageType.Delete:
                        this.delete(slug + evt.data.id);
                        break;
                    case MessageType.Clear:
                        for (const key of this.logs.keys()) {
                            if (key.startsWith(slug)) {
                                this.delete(key);
                            }
                        }
                        break;
                    default:
                        assertNever(evt.data.method);
                }
            }
        });

        ++this.workerCount;
    }
}
