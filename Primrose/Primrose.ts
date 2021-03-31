import { TypedEvent, TypedEventBase } from "kudzu/events/EventBase";
import { Point } from "kudzu/graphics2d/Point";
import { Rectangle } from "kudzu/graphics2d/Rectangle";
import { Size } from "kudzu/graphics2d/Size";
import { CanvasTypes, Context2D, createUtilityCanvas, isHTMLCanvas, isOffscreenCanvas, setContextSize } from "kudzu/html/canvas";
import { border, display, height, padding, overflow, styles, width, getMonospaceFamily } from "kudzu/html/css";
import { isApple, isFirefox } from "kudzu/html/flags";
import { Canvas, elementClearChildren } from "kudzu/html/tags";
import { isDefined, isString } from "kudzu/typeChecks";
import { multiLineOutput, singleLineOutput } from "./controlTypes";
import { Cursor } from "./Cursor";
import {
    Grammar,
    grammars, JavaScript
} from "./grammars";
import { FinalTokenType, isFinalTokenType, Token } from "./Grammars/Token";
import {
    MacOS, Windows
} from "./os";
import { Row } from "./Row";
import { Dark as DefaultTheme } from "./themes";
import { TimedEvent } from "./TimedEvent";

interface HistoryFrame {
    value: string,
    frontCursor: number,
    backCursor: number;
}

export interface PrimroseOptions {
    readOnly: boolean;
    multiLine: boolean;
    wordWrap: boolean;
    scrollBars: boolean;
    lineNumbers: boolean;
    padding: number;
    fontSize: number;
    language: string | Grammar;
    scaleFactor: number;
    element: HTMLElement;
    width: number;
    height: number;
}

function isPrimroseOption(key: string): key is keyof PrimroseOptions {
    return key === "readOnly"
        || key === "multiLine"
        || key === "wordWrap"
        || key === "scrollBars"
        || key === "lineNumbers"
        || key === "padding"
        || key === "fontSize"
        || key === "language"
        || key === "scaleFactor"
        || key === "element"
        || key === "width"
        || key === "height";
}

//>>>>>>>>>> PRIVATE STATIC FIELDS >>>>>>>>>>
let elementCounter = 0,
    focusedControl: Primrose = null,
    hoveredControl: Primrose = null,
    publicControls = new Array<Primrose>();

const wheelScrollSpeed = 4,
    vScrollWidth = 2,
    scrollScale = isFirefox ? 3 : 100,
    optionDefaults: Partial<PrimroseOptions> = Object.freeze({
        readOnly: false,
        multiLine: true,
        wordWrap: true,
        scrollBars: true,
        lineNumbers: true,
        padding: 0,
        fontSize: 16,
        language: "JavaScript",
        scaleFactor: devicePixelRatio
    }),
    controls = new Array<Primrose>(),
    elements = new WeakMap<any, Primrose>(),
    ready = (document.readyState === "complete"
        ? Promise.resolve("already")
        : new Promise((resolve) => {
            document.addEventListener("readystatechange", () => {
                if (document.readyState === "complete") {
                    resolve("had to wait for it");
                }
            }, false);
        }))
        .then(() => {
            for (const element of Array.from(document.getElementsByTagName("primrose"))) {
                new Primrose({
                    element: element as HTMLElement
                });
            }
        });



//<<<<<<<<<< PRIVATE STATIC FIELDS <<<<<<<<<<



export class Primrose extends TypedEventBase<{
    out: TypedEvent<"out">;
    over: TypedEvent<"over">;
    blur: TypedEvent<"blur">;
    focus: TypedEvent<"focus">;
    change: TypedEvent<"change">;
    update: TypedEvent<"update">;
}> {
    private elementID: number;
    private longPress: TimedEvent;
    private tx = 0;
    private ty = 0;
    private pressed = false;
    private dragging = false;
    private scrolling = false;
    private lastScrollDX: number = null;
    private lastScrollDY: number = null;

    private outEvt = new TypedEvent("out");
    private overEvt = new TypedEvent("over");
    private blurEvt = new TypedEvent("blur");
    private focusEvt = new TypedEvent("focus");
    private changeEvt = new TypedEvent("change");
    private updateEvt = new TypedEvent("update");

    constructor(options: Partial<PrimroseOptions>) {
        super();

        //>>>>>>>>>> VALIDATE PARAMETERS >>>>>>>>>>
        options = options || {};

        if (options.element === undefined) {
            options.element = null;
        }

        if (options.element !== null
            && !(options.element instanceof HTMLElement)) {
            throw new Error("element must be null, an instance of HTMLElement, an instance of HTMLCanvaseElement, or an instance of OffscreenCanvas");
        }

        options = Object.assign({}, optionDefaults, options);
        //<<<<<<<<<< VALIDATE PARAMETERS <<<<<<<<<<


        //>>>>>>>>>> PRIVATE METHODS >>>>>>>>>>
        //>>>>>>>>>> RENDERING >>>>>>>>>>
        let render = () => {
            // do nothing, disabling rendering until the object is fully initialized;
        };

        const fillRect = (gfx: Context2D, fill: string, x: number, y: number, w: number, h: number) => {
            gfx.fillStyle = fill;
            gfx.fillRect(
                x * character.width,
                y * character.height,
                w * character.width + 1,
                h * character.height + 1);
        };

        const strokeRect = (gfx: Context2D, stroke: string, x: number, y: number, w: number, h: number) => {
            gfx.strokeStyle = stroke;
            gfx.strokeRect(
                x * character.width,
                y * character.height,
                w * character.width + 1,
                h * character.height + 1);
        };

        const renderCanvasBackground = () => {
            const minCursor = Cursor.min(frontCursor, backCursor),
                maxCursor = Cursor.max(frontCursor, backCursor);

            bgfx.clearRect(0, 0, canv.width, canv.height);
            if (theme.regular.backColor) {
                bgfx.fillStyle = theme.regular.backColor;
                bgfx.fillRect(0, 0, canv.width, canv.height);
            }

            bgfx.save();
            bgfx.scale(scaleFactor, scaleFactor);
            bgfx.translate(
                (gridBounds.x - scroll.x) * character.width + pad,
                -scroll.y * character.height + pad);


            // draw the current row highlighter
            if (focused) {
                fillRect(bgfx, theme.currentRowBackColor ||
                    DefaultTheme.currentRowBackColor,
                    0, minCursor.y,
                    gridBounds.width,
                    maxCursor.y - minCursor.y + 1);
            }

            const minY = scroll.y | 0,
                maxY = minY + gridBounds.height,
                minX = scroll.x | 0,
                maxX = minX + gridBounds.width;
            tokenFront.setXY(rows, 0, minY);
            tokenBack.copy(tokenFront);
            for (let y = minY; y <= maxY && y < rows.length; ++y) {
                // draw the tokens on this row
                const row = rows[y].tokens;
                for (let i = 0; i < row.length; ++i) {
                    const t = row[i];
                    tokenBack.x += t.length;
                    tokenBack.i += t.length;

                    // skip drawing tokens that aren't in view
                    if (minX <= tokenBack.x && tokenFront.x <= maxX) {
                        // draw the selection box
                        const inSelection = minCursor.i <= tokenBack.i
                            && tokenFront.i < maxCursor.i;
                        if (inSelection) {
                            const selectionFront = Cursor.max(minCursor, tokenFront),
                                selectionBack = Cursor.min(maxCursor, tokenBack),
                                cw = selectionBack.i - selectionFront.i;
                            fillRect(bgfx, theme.selectedBackColor ||
                                DefaultTheme.selectedBackColor,
                                selectionFront.x, selectionFront.y,
                                cw, 1);
                        }
                    }

                    tokenFront.copy(tokenBack);
                }

                tokenFront.x = 0;
                ++tokenFront.y;
                tokenBack.copy(tokenFront);
            }

            // draw the cursor caret
            if (focused) {
                const cc = theme.cursorColor || DefaultTheme.cursorColor,
                    w = 1 / character.width;
                fillRect(bgfx, cc, minCursor.x, minCursor.y, w, 1);
                fillRect(bgfx, cc, maxCursor.x, maxCursor.y, w, 1);
            }
            bgfx.restore();
        };

        const renderCanvasForeground = () => {
            fgfx.clearRect(0, 0, canv.width, canv.height);
            fgfx.save();
            fgfx.scale(scaleFactor, scaleFactor);
            fgfx.translate(
                (gridBounds.x - scroll.x) * character.width + pad,
                pad);

            const minY = scroll.y | 0,
                maxY = minY + gridBounds.height,
                minX = scroll.x | 0,
                maxX = minX + gridBounds.width;
            tokenFront.setXY(rows, 0, minY);
            tokenBack.copy(tokenFront);
            for (let y = minY; y <= maxY && y < rows.length; ++y) {
                // draw the tokens on this row
                const row = rows[y].tokens,
                    textY = (y - scroll.y) * character.height;

                for (let i = 0; i < row.length; ++i) {
                    const t = row[i];
                    tokenBack.x += t.length;
                    tokenBack.i += t.length;

                    // skip drawing tokens that aren't in view
                    if (minX <= tokenBack.x
                        && tokenFront.x <= maxX) {

                        // draw the text
                        const style = isFinalTokenType(t.type) && theme[t.type] || {},
                            fontWeight = style.fontWeight
                                || theme.regular.fontWeight
                                || DefaultTheme.regular.fontWeight
                                || "",
                            fontStyle = style.fontStyle
                                || theme.regular.fontStyle
                                || DefaultTheme.regular.fontStyle
                                || "",
                            font = `${fontWeight} ${fontStyle} ${context.font}`;
                        fgfx.font = font.trim();
                        fgfx.fillStyle = style.foreColor || theme.regular.foreColor;
                        fgfx.fillText(
                            t.value,
                            tokenFront.x * character.width,
                            textY);
                    }

                    tokenFront.copy(tokenBack);
                }

                tokenFront.x = 0;
                ++tokenFront.y;
                tokenBack.copy(tokenFront);
            }

            fgfx.restore();
        };

        const renderCanvasTrim = () => {
            tgfx.clearRect(0, 0, canv.width, canv.height);
            tgfx.save();
            tgfx.scale(scaleFactor, scaleFactor);
            tgfx.translate(pad, pad);

            if (showLineNumbers) {
                fillRect(tgfx,
                    theme.selectedBackColor ||
                    DefaultTheme.selectedBackColor,
                    0, 0,
                    gridBounds.x, this.width - pad * 2);
                strokeRect(tgfx,
                    theme.regular.foreColor ||
                    DefaultTheme.regular.foreColor,
                    0, 0,
                    gridBounds.x, this.height - pad * 2);
            }

            let maxRowWidth = 2;
            tgfx.save();
            {
                tgfx.translate((lineCountWidth - 0.5) * character.width, -scroll.y * character.height);
                let lastLineNumber = -1;
                const minY = scroll.y | 0,
                    maxY = minY + gridBounds.height;
                tokenFront.setXY(rows, 0, minY);
                tokenBack.copy(tokenFront);
                for (let y = minY; y <= maxY && y < rows.length; ++y) {
                    const row = rows[y];
                    maxRowWidth = Math.max(maxRowWidth, row.stringLength);
                    if (showLineNumbers) {
                        // draw the left gutter
                        if (row.lineNumber > lastLineNumber) {
                            lastLineNumber = row.lineNumber;
                            tgfx.font = "bold " + context.font;
                            tgfx.fillStyle = theme.regular.foreColor;
                            tgfx.fillText(
                                row.lineNumber.toFixed(0),
                                0, y * character.height);
                        }
                    }
                }
            }
            tgfx.restore();

            // draw the scrollbars
            if (showScrollBars) {
                tgfx.fillStyle = theme.selectedBackColor ||
                    DefaultTheme.selectedBackColor;

                // horizontal
                if (!wordWrap && maxRowWidth > gridBounds.width) {
                    const drawWidth = gridBounds.width * character.width - pad,
                        scrollX = (scroll.x * drawWidth) / maxRowWidth + gridBounds.x * character.width,
                        scrollBarWidth = drawWidth * (gridBounds.width / maxRowWidth),
                        by = this.height - character.height - pad,
                        bw = Math.max(character.width, scrollBarWidth);
                    tgfx.fillRect(scrollX, by, bw, character.height);
                    tgfx.strokeRect(scrollX, by, bw, character.height);
                }

                //vertical
                if (rows.length > gridBounds.height) {
                    const drawHeight = gridBounds.height * character.height,
                        scrollY = (scroll.y * drawHeight) / rows.length,
                        scrollBarHeight = drawHeight * (gridBounds.height / rows.length),
                        bx = this.width - vScrollWidth * character.width - 2 * pad,
                        bw = vScrollWidth * character.width,
                        bh = Math.max(character.height, scrollBarHeight);
                    tgfx.fillRect(bx, scrollY, bw, bh);
                    tgfx.strokeRect(bx, scrollY, bw, bh);
                }
            }

            tgfx.restore();
            if (!focused) {
                tgfx.fillStyle = theme.unfocused || DefaultTheme.unfocused;
                tgfx.fillRect(0, 0, canv.width, canv.height);
            }
        };

        const doRender = () => {
            if (theme) {
                const textChanged = lastText !== value,
                    focusChanged = focused !== lastFocused,
                    fontChanged = context.font !== lastFont,
                    paddingChanged = pad !== lastPadding,
                    themeChanged = theme.name !== lastThemeName,
                    boundsChanged = gridBounds.toString() !== lastGridBounds,
                    characterWidthChanged = character.width !== lastCharacterWidth,
                    characterHeightChanged = character.height !== lastCharacterHeight,

                    cursorChanged = frontCursor.i !== lastFrontCursor
                        || backCursor.i !== lastBackCursor,

                    scrollChanged = scroll.x !== lastScrollX
                        || scroll.y !== lastScrollY,

                    layoutChanged = resized
                        || boundsChanged
                        || textChanged
                        || characterWidthChanged
                        || characterHeightChanged
                        || paddingChanged
                        || scrollChanged
                        || themeChanged,

                    backgroundChanged = layoutChanged
                        || cursorChanged,

                    foregroundChanged = layoutChanged
                        || fontChanged,

                    trimChanged = layoutChanged
                        || focusChanged;

                if (backgroundChanged) {
                    renderCanvasBackground();
                }
                if (foregroundChanged) {
                    renderCanvasForeground();
                }
                if (trimChanged) {
                    renderCanvasTrim();
                }

                context.clearRect(0, 0, canv.width, canv.height);
                context.save();
                context.translate(vibX, vibY);
                context.drawImage(bg, 0, 0);
                context.drawImage(fg, 0, 0);
                context.drawImage(tg, 0, 0);
                context.restore();

                lastGridBounds = gridBounds.toString();
                lastText = value;
                lastCharacterWidth = character.width;
                lastCharacterHeight = character.height;
                lastPadding = pad;
                lastFrontCursor = frontCursor.i;
                lastBackCursor = backCursor.i;
                lastFocused = focused;
                lastFont = context.font;
                lastThemeName = theme.name;
                lastScrollX = scroll.x;
                lastScrollY = scroll.y;
                resized = false;
                this.dispatchEvent(this.updateEvt);
            }
        };
        //<<<<<<<<<< RENDERING <<<<<<<<<<

        const refreshControlType = () => {
            const lastControlType = controlType;

            if (readOnly && multiLine) {
                controlType = multiLineOutput;
            }
            else if (readOnly && !multiLine) {
                controlType = singleLineOutput;
            }
            else if (!readOnly && multiLine) {
                controlType = multiLineInput;
            }
            else {
                controlType = singleLineInput;
            }

            if (controlType !== lastControlType) {
                refreshAllTokens();
            }
        };

        const refreshGutter = () => {
            if (!showScrollBars) {
                bottomRightGutter.set(0, 0);
            }
            else if (wordWrap) {
                bottomRightGutter.set(vScrollWidth, 0);
            }
            else {
                bottomRightGutter.set(vScrollWidth, 1);
            }
        };

        const setValue = (txt: string, setUndo: boolean) => {
            txt = txt || "";
            txt = txt.replace(/\r\n/g, "\n");
            if (txt !== value) {
                value = txt;
                if (setUndo) {
                    pushUndo();
                }
                refreshAllTokens();
                this.dispatchEvent(this.changeEvt);
            }
        };

        const setSelectedText = (txt: string) => {
            txt = txt || "";
            txt = txt.replace(/\r\n/g, "\n");

            if (frontCursor.i !== backCursor.i || txt.length > 0) {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor),
                    startRow = rows[minCursor.y],
                    endRow = rows[maxCursor.y],

                    unchangedLeft = value.substring(0, startRow.startStringIndex),
                    unchangedRight = value.substring(endRow.endStringIndex),

                    changedStartSubStringIndex = minCursor.i - startRow.startStringIndex,
                    changedLeft = startRow.substring(0, changedStartSubStringIndex),

                    changedEndSubStringIndex = maxCursor.i - endRow.startStringIndex,
                    changedRight = endRow.substring(changedEndSubStringIndex),

                    changedText = changedLeft + txt + changedRight;

                value = unchangedLeft + changedText + unchangedRight;
                pushUndo();

                refreshTokens(minCursor.y, maxCursor.y, changedText);
                frontCursor.setI(rows, minCursor.i + txt.length);
                backCursor.copy(frontCursor);
                scrollIntoView(frontCursor);
                this.dispatchEvent(this.changeEvt);
            }
        };

        const refreshAllTokens = () => {
            refreshTokens(0, rows.length - 1, value);
        };

        const refreshTokens = (startY: number, endY: number, txt: string) => {

            while (startY > 0
                && rows[startY].lineNumber === rows[startY - 1].lineNumber) {
                --startY;
                txt = rows[startY].text + txt;
            }

            while (endY < rows.length - 1 && rows[endY].lineNumber === rows[endY + 1].lineNumber) {
                ++endY;
                txt += rows[endY].text;
            }


            const newTokens = language.tokenize(txt),
                startRow = rows[startY],
                startTokenIndex = startRow.startTokenIndex,
                startLineNumber = startRow.lineNumber,
                startStringIndex = startRow.startStringIndex,
                endRow = rows[endY],
                endTokenIndex = endRow.endTokenIndex,
                tokenRemoveCount = endTokenIndex - startTokenIndex,
                oldTokens = tokens.splice(startTokenIndex, tokenRemoveCount, ...newTokens);

            // figure out the width of the line count gutter
            lineCountWidth = 0;
            if (showLineNumbers) {
                for (let token of oldTokens) {
                    if (token.type === FinalTokenType.newLines) {
                        --lineCount;
                    }
                }

                for (let token of newTokens) {
                    if (token.type === FinalTokenType.newLines) {
                        ++lineCount;
                    }
                }

                lineCountWidth = Math.max(1, Math.ceil(Math.log(lineCount) / Math.LN10)) + 1;
            }

            // measure the grid
            const x = Math.floor(lineCountWidth + pad / character.width),
                y = Math.floor(pad / character.height),
                w = Math.floor((this.width - 2 * pad) / character.width) - x - bottomRightGutter.width,
                h = Math.floor((this.height - 2 * pad) / character.height) - y - bottomRightGutter.height;
            gridBounds.set(x, y, w, h);

            // Perform the layout
            const tokenQueue = newTokens.map(t => t.clone()),
                rowRemoveCount = endY - startY + 1,
                newRows = [];

            let currentString = "",
                currentTokens = [],
                currentStringIndex = startStringIndex,
                currentTokenIndex = startTokenIndex,
                currentLineNumber = startLineNumber;

            for (let i = 0; i < tokenQueue.length; ++i) {
                const t = tokenQueue[i],
                    widthLeft = gridBounds.width - currentString.length,
                    wrap = wordWrap && t.type !== FinalTokenType.newLines && t.length > widthLeft,
                    breakLine = t.type === FinalTokenType.newLines || wrap;

                if (wrap) {
                    const split = t.length > gridBounds.width
                        ? widthLeft
                        : 0;
                    tokenQueue.splice(i + 1, 0, t.splitAt(split));
                }

                currentTokens.push(t);
                currentString += t.value;

                if (breakLine
                    || i === tokenQueue.length - 1) {
                    newRows.push(new Row(currentString, currentTokens, currentStringIndex, currentTokenIndex, currentLineNumber));
                    currentStringIndex += currentString.length;
                    currentTokenIndex += currentTokens.length;

                    currentTokens = [];
                    currentString = "";

                    if (t.type === FinalTokenType.newLines) {
                        ++currentLineNumber;
                    }
                }
            }

            rows.splice(startY, rowRemoveCount, ...newRows);

            // renumber rows
            for (let y = startY + newRows.length; y < rows.length; ++y) {
                const row = rows[y];
                row.lineNumber = currentLineNumber;
                row.startStringIndex = currentStringIndex;
                row.startTokenIndex += currentTokenIndex;

                currentStringIndex += row.stringLength;
                currentTokenIndex += row.numTokens;

                if (row.tokens[row.tokens.length - 1].type === FinalTokenType.newLines) {
                    ++currentLineNumber;
                }
            }

            // provide editing room at the end of the buffer
            if (rows.length === 0) {
                rows.push(Row.emptyRow(0, 0, 0));
            }
            else {
                const lastRow = rows[rows.length - 1];
                if (lastRow.text.endsWith('\n')) {
                    rows.push(Row.emptyRow(lastRow.endStringIndex, lastRow.endTokenIndex, lastRow.lineNumber + 1));
                }
            }

            maxVerticalScroll = Math.max(0, rows.length - gridBounds.height);

            render();
        };

        const minDelta = (v: number, minV: number, maxV: number) => {
            const dvMinV = v - minV,
                dvMaxV = v - maxV + 5;
            let dv = 0;
            if (dvMinV < 0 || dvMaxV >= 0) {
                // compare the absolute values, so we get the smallest change
                // regardless of direction.
                dv = Math.abs(dvMinV) < Math.abs(dvMaxV)
                    ? dvMinV
                    : dvMaxV;
            }

            return dv;
        };

        const clampScroll = () => {
            const toHigh = scroll.y < 0 || maxVerticalScroll === 0,
                toLow = scroll.y > maxVerticalScroll;

            if (toHigh) {
                scroll.y = 0;
            }
            else if (toLow) {
                scroll.y = maxVerticalScroll;
            }
            render();

            return toHigh || toLow;
        };

        const scrollIntoView = (currentCursor: Cursor) => {
            const dx = minDelta(currentCursor.x, scroll.x, scroll.x + gridBounds.width),
                dy = minDelta(currentCursor.y, scroll.y, scroll.y + gridBounds.height);
            this.scrollBy(dx, dy);
        };

        const pushUndo = () => {
            if (historyIndex < history.length - 1) {
                history.splice(historyIndex + 1);
            }
            history.push({
                value,
                frontCursor: frontCursor.i,
                backCursor: backCursor.i
            });
            historyIndex = history.length - 1;
        };

        const moveInHistory = (dh: number) => {
            const nextHistoryIndex = historyIndex + dh;
            if (0 <= nextHistoryIndex && nextHistoryIndex < history.length) {
                const curFrame = history[historyIndex];
                historyIndex = nextHistoryIndex;
                const nextFrame = history[historyIndex];
                setValue(nextFrame.value, false);
                frontCursor.setI(rows, curFrame.frontCursor);
                backCursor.setI(rows, curFrame.backCursor);
            }
        };
        //<<<<<<<<<< PRIVATE METHODS <<<<<<<<<<


        //>>>>>>>>>> KEY EVENT HANDLERS >>>>>>>>>>
        const keyDownCommands = new Map([
            ["CursorUp", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                minCursor.up(rows);
                maxCursor.copy(minCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorDown", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                maxCursor.down(rows);
                minCursor.copy(maxCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorLeft", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                if (minCursor.i === maxCursor.i) {
                    minCursor.left(rows);
                }
                maxCursor.copy(minCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorRight", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                if (minCursor.i === maxCursor.i) {
                    maxCursor.right(rows);
                }
                minCursor.copy(maxCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorPageUp", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                minCursor.incY(rows, -gridBounds.height);
                maxCursor.copy(minCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorPageDown", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                maxCursor.incY(rows, gridBounds.height);
                minCursor.copy(maxCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorSkipLeft", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                if (minCursor.i === maxCursor.i) {
                    minCursor.skipLeft(rows);
                }
                maxCursor.copy(minCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorSkipRight", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                if (minCursor.i === maxCursor.i) {
                    maxCursor.skipRight(rows);
                }
                minCursor.copy(maxCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorHome", () => {
                frontCursor.home();
                backCursor.copy(frontCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorEnd", () => {
                frontCursor.end(rows);
                backCursor.copy(frontCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorFullHome", () => {
                frontCursor.fullHome();
                backCursor.copy(frontCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorFullEnd", () => {
                frontCursor.fullEnd(rows);
                backCursor.copy(frontCursor);
                scrollIntoView(frontCursor);
            }],

            ["SelectDown", () => {
                backCursor.down(rows);
                scrollIntoView(frontCursor);
            }],

            ["SelectLeft", () => {
                backCursor.left(rows);
                scrollIntoView(backCursor);
            }],

            ["SelectRight", () => {
                backCursor.right(rows);
                scrollIntoView(backCursor);
            }],

            ["SelectUp", () => {
                backCursor.up(rows);
                scrollIntoView(backCursor);
            }],

            ["SelectPageDown", () => {
                backCursor.incY(rows, gridBounds.height);
                scrollIntoView(backCursor);
            }],

            ["SelectPageUp", () => {
                backCursor.incY(rows, -gridBounds.height);
                scrollIntoView(backCursor);
            }],

            ["SelectSkipLeft", () => {
                backCursor.skipLeft(rows);
                scrollIntoView(backCursor);
            }],

            ["SelectSkipRight", () => {
                backCursor.skipRight(rows);
                scrollIntoView(backCursor);
            }],

            ["SelectHome", () => {
                backCursor.home();
                scrollIntoView(backCursor);
            }],

            ["SelectEnd", () => {
                backCursor.end(rows);
                scrollIntoView(backCursor);
            }],

            ["SelectFullHome", () => {
                backCursor.fullHome();
                scrollIntoView(backCursor);
            }],

            ["SelectFullEnd", () => {
                backCursor.fullEnd(rows);
                scrollIntoView(backCursor);
            }],

            ["SelectAll", () => {
                frontCursor.fullHome();
                backCursor.fullEnd(rows);
                render();
            }],

            ["ScrollDown", () => {
                if (scroll.y < rows.length - gridBounds.height) {
                    this.scrollBy(0, 1);
                }
            }],

            ["ScrollUp", () => {
                if (scroll.y > 0) {
                    this.scrollBy(0, -1);
                }
            }],

            ["DeleteLetterLeft", () => {
                if (frontCursor.i === backCursor.i) {
                    backCursor.left(rows);
                }
                setSelectedText("");
            }],

            ["DeleteLetterRight", () => {
                if (frontCursor.i === backCursor.i) {
                    backCursor.right(rows);
                }
                setSelectedText("");
            }],

            ["DeleteWordLeft", () => {
                if (frontCursor.i === backCursor.i) {
                    frontCursor.skipLeft(rows);
                }
                setSelectedText("");
            }],

            ["DeleteWordRight", () => {
                if (frontCursor.i === backCursor.i) {
                    backCursor.skipRight(rows);
                }
                setSelectedText("");
            }],

            ["DeleteLine", () => {
                if (frontCursor.i === backCursor.i) {
                    frontCursor.home();
                    backCursor.end(rows);
                    backCursor.right(rows);
                }
                setSelectedText("");
            }],

            ["Undo", () => {
                moveInHistory(-1);
            }],

            ["Redo", () => {
                moveInHistory(1);
            }],

            ["InsertTab", () => {
                tabPressed = true;
                setSelectedText(tabString);
            }],

            ["RemoveTab", () => {
                const row = rows[frontCursor.y],
                    toDelete = Math.min(frontCursor.x, tabWidth);
                for (let i = 0; i < frontCursor.x; ++i) {
                    if (row.text[i] !== ' ') {
                        // can only remove tabs at the beginning of a row
                        return;
                    }
                }

                backCursor.copy(frontCursor);
                backCursor.incX(rows, -toDelete);
                setSelectedText("");
            }]
        ]);

        this.readKeyDownEvent = this.debugEvt("keydown", (evt: KeyboardEvent) => {
            const command = os.makeCommand(evt);
            const func = keyDownCommands.get(command.command);
            if (func) {
                evt.preventDefault();
                func();
            }
        });


        const keyPressCommands = new Map([
            ["AppendNewline", () => {
                if (multiLine) {
                    let indent = "";
                    const row = rows[frontCursor.y].tokens;
                    if (row.length > 0
                        && row[0].type === "whitespace") {
                        indent = row[0].value;
                    }
                    setSelectedText("\n" + indent);
                }
                else {
                    this.dispatchEvent(this.changeEvt);
                }
            }],

            ["PrependNewline", () => {
                if (multiLine) {
                    let indent = "";
                    const row = rows[frontCursor.y].tokens;
                    if (row.length > 0
                        && row[0].type === "whitespace") {
                        indent = row[0].value;
                    }
                    frontCursor.home();
                    backCursor.copy(frontCursor);
                    setSelectedText(indent + "\n");
                }
                else {
                    this.dispatchEvent(this.changeEvt);
                }
            }],

            ["Undo", () => {
                moveInHistory(-1);
            }]
        ]);

        this.readKeyPressEvent = this.debugEvt("keypress", (evt: KeyboardEvent) => {
            const command = os.makeCommand(evt);
            if (!this.readOnly) {
                evt.preventDefault();

                if (keyPressCommands.has(command.command)) {
                    keyPressCommands.get(command.command)();
                }
                else if (command.type === "printable"
                    || command.type === "whitespace") {
                    setSelectedText(command.text);
                }

                clampScroll();
                render();
            }
        });

        this.readKeyUpEvent = this.debugEvt("keyup");
        //<<<<<<<<<< KEY EVENT HANDLERS <<<<<<<<<<


        //>>>>>>>>>> CLIPBOARD EVENT HANDLERS >>>>>>>>>>
        const copySelectedText = (evt: ClipboardEvent) => {
            if (focused && frontCursor.i !== backCursor.i) {
                evt.clipboardData.setData("text/plain", this.selectedText);
                evt.returnValue = false;
                return true;
            }

            return false;
        };

        this.readCopyEvent = this.debugEvt("copy", (evt: ClipboardEvent) => {
            copySelectedText(evt);
        });

        this.readCutEvent = this.debugEvt("cut", (evt: ClipboardEvent) => {
            if (copySelectedText(evt)
                && !this.readOnly) {
                setSelectedText("");
            }
        });

        this.readPasteEvent = this.debugEvt("paste", (evt: ClipboardEvent) => {
            if (focused && !this.readOnly) {
                evt.returnValue = false;
                const oldClipboard = (window as any).clipboardData;
                const clipboard = evt.clipboardData || oldClipboard,
                    str = clipboard.getData(oldClipboard ? "Text" : "text/plain");
                if (str) {
                    setSelectedText(str);
                }
            }
        });
        //<<<<<<<<<< CLIPBOARD EVENT HANDLERS <<<<<<<<<<


        //>>>>>>>>>> POINTER EVENT HANDLERS >>>>>>>>>>
        const pointerOver = () => {
            hovered = true;
            this.dispatchEvent(this.overEvt);
        };

        const pointerOut = () => {
            hovered = false;
            this.dispatchEvent(this.outEvt);
        };

        //>>>>>>>>>> MOUSE EVENT HANDLERS >>>>>>>>>> 
        const setMousePointer = (evt: PointerEvent) => {
            pointer.set(
                evt.offsetX,
                evt.offsetY);
        };
        this.readMouseOverEvent = this.debugEvt("mouseover", pointerOver);
        this.readMouseOutEvent = this.debugEvt("mouseout", pointerOut);
        this.readMouseDownEvent = this.debugEvt("mousedown", this.mouseLikePointerDown(setMousePointer));
        this.readMouseUpEvent = this.debugEvt("mouseup", this.mouseLikePointerUp);
        this.readMouseMoveEvent = this.debugEvt("mousemove", this.mouseLikePointerMove(setMousePointer));

        this.readWheelEvent = this.debugEvt("wheel", (evt: WheelEvent) => {
            if (hovered || focused) {
                if (!evt.ctrlKey
                    && !evt.altKey
                    && !evt.shiftKey
                    && !evt.metaKey) {
                    const dy = Math.floor(evt.deltaY * wheelScrollSpeed / scrollScale);
                    if (!this.scrollBy(0, dy) || focused) {
                        evt.preventDefault();
                    }
                }
                else if (!evt.ctrlKey
                    && !evt.altKey
                    && !evt.metaKey) {
                    evt.preventDefault();
                    this.fontSize += -evt.deltaY / scrollScale;
                }
                render();
            }
        });
        //<<<<<<<<<< MOUSE EVENT HANDLERS <<<<<<<<<<


        //>>>>>>>>>> TOUCH EVENT HANDLERS >>>>>>>>>>
        let vibX = 0,
            vibY = 0;

        const vibrate = (len: number) => {
            this.longPress.cancel();
            if (len > 0) {
                vibX = (Math.random() - 0.5) * 10;
                vibY = (Math.random() - 0.5) * 10;
                setTimeout(() => vibrate(len - 10), 10);
            }
            else {
                vibX = 0;
                vibY = 0;
            }
            render();
        };

        this.longPress = new TimedEvent(1000);

        this.longPress.addEventListener("tick", () => {
            this.startSelecting();
            backCursor.copy(frontCursor);
            frontCursor.skipLeft(rows);
            backCursor.skipRight(rows);
            render();
            navigator.vibrate(20);
            vibrate(320);
        });

        let currentTouchID: number = null;
        const findTouch = (touches: TouchList) => {
            for (const touch of Array.from(touches)) {
                if (currentTouchID === null
                    || touch.identifier === currentTouchID) {
                    return touch;
                }
            }
            return null;
        };

        const withPrimaryTouch = (callback: (evt: Touch) => void) => {
            return (evt: TouchEvent) => {
                evt.preventDefault();
                callback(findTouch(evt.touches)
                    || findTouch(evt.changedTouches));
            };
        };

        const setTouchPointer = (touch: Touch) => {
            if (isHTMLCanvas(canv)) {
                const cb = canv.getBoundingClientRect();
                pointer.set(
                    touch.clientX - cb.left,
                    touch.clientY - cb.top);
            }
        };

        this.readTouchStartEvent = this.debugEvt("touchstart", withPrimaryTouch(this.touchLikePointerDown(setTouchPointer)));
        this.readTouchMoveEvent = this.debugEvt("touchmove", withPrimaryTouch(this.touchLikePointerMove(setTouchPointer)));
        this.readTouchEndEvent = this.debugEvt("touchend", withPrimaryTouch(this.touchLikePointerUp));
        //<<<<<<<<<< TOUCH EVENT HANDLERS <<<<<<<<<<


        //>>>>>>>>>> UV POINTER EVENT HANDLERS >>>>>>>>>>
        const setUVPointer = (evt: { uv: { x: number, y: number; }) => {
            pointer.set(
                evt.uv.x * this.width,
                (1 - evt.uv.y) * this.height);
        };

        this.mouse = Object.freeze({

            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform the hover gestures.
            // </summary>
            readOverEventUV: this.debugEvt("mouseuvover", pointerOver),

            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform the end of the hover gesture.
            // </summary>
            readOutEventUV: this.debugEvt("mouseuvout", pointerOut),

            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform mouse-like behavior for primary-button-down gesture.
            // </summary>
            readDownEventUV: this.debugEvt("mouseuvdown", this.mouseLikePointerDown(setUVPointer)),

            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform mouse-like behavior for primary-button-up gesture.
            // </summary>
            readUpEventUV: this.debugEvt("mouseuvup", this.mouseLikePointerUp),

            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform mouse-like behavior for move gesture, whether the primary button is pressed or not.
            // </summary>
            readMoveEventUV: this.debugEvt("mouseuvmove", this.mouseLikePointerMove(setUVPointer))
        });

        this.touch = Object.freeze({

            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform the end of the hover gesture. This is the same as mouse.readOverEventUV, included for completeness.
            // </summary>
            readOverEventUV: this.debugEvt("touchuvover", pointerOver),

            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform the end of the hover gesture. This is the same as mouse.readOutEventUV, included for completeness.
            // </summary>
            readOutEventUV: this.debugEvt("touchuvout", pointerOut),

            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform touch-like behavior for the first finger touching down gesture.
            // </summary>
            readDownEventUV: this.debugEvt("touchuvdown", this.touchLikePointerDown(setUVPointer)),

            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform touch-like behavior for the first finger raising up gesture.
            // </summary>
            readMoveEventUV: this.debugEvt("touchuvmove", this.touchLikePointerMove(setUVPointer)),

            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform touch-like behavior for the first finger moving gesture.
            // </summary>
            readUpEventUV: this.debugEvt("touchuvup", this.touchLikePointerUp)
        });
        //<<<<<<<<<< UV POINTER EVENT HANDLERS <<<<<<<<<<
        //<<<<<<<<<< POINTER EVENT HANDLERS <<<<<<<<<<


        //>>>>>>>>>> PRIVATE MUTABLE FIELDS >>>>>>>>>>
        this.elementID = ++elementCounter;

        let value = "",
            pad = 0,
            theme = DefaultTheme,
            tabWidth = 2,
            canv: CanvasTypes = null,
            resized = false,
            hovered = false,
            focused = false,
            fontSize: number = null,
            scaleFactor = 2,
            tabString = "  ",
            readOnly = false,
            wordWrap = false,
            historyIndex = -1,
            multiLine = false,
            tabPressed = false,
            lineCount = 1,
            lineCountWidth = 0,
            element: HTMLElement = null,
            language = JavaScript,
            showScrollBars = false,
            showLineNumbers = false,
            controlType = singleLineOutput,
            maxVerticalScroll = 0,

            lastCharacterHeight: number = null,
            lastCharacterWidth: number = null,
            lastFrontCursor: number = null,
            lastGridBounds: string = null,
            lastBackCursor: number = null,
            lastThemeName: string = null,
            lastPadding: number = null,
            lastFocused: boolean = null,
            lastScrollX: number = null,
            lastScrollY: number = null,
            lastFont: string = null,
            lastText: string = null;

        const history = new Array<HistoryFrame>(),
            tokens = new Array<Token>(),
            rows = [Row.emptyRow(0, 0, 0)],
            scroll = new Point(),
            pointer = new Point(),
            character = new Rectangle(),
            bottomRightGutter = new Size(),
            gridBounds = new Rectangle(),
            tokenBack = new Cursor(),
            tokenFront = new Cursor(),
            backCursor = new Cursor(),
            frontCursor = new Cursor(),
            os = isApple ? MacOS : Windows;
        //<<<<<<<<<< PRIVATE MUTABLE FIELDS <<<<<<<<<<

        //>>>>>>>>>> SETUP CANVAS >>>>>>>>>>
        let currentValue = "",
            currentTabIndex = -1;

        if (options.element !== null) {
            const elem = options.element,
                width = elem.width,
                height = elem.height;
            currentTabIndex = elem.tabIndex;

            const optionsStr = elem.dataset.options || "",
                entries = optionsStr.trim().split(','),
                optionUser: Partial<PrimroseOptions> = {};
            for (let entry of entries) {
                entry = entry.trim();
                if (entry.length > 0) {
                    const pairs = entry.split('=');
                    if (pairs.length > 1) {
                        const key = pairs[0].trim(),
                            value = pairs[1].trim(),
                            boolTest = value.toLocaleLowerCase();
                        if (isPrimroseOption(key)) {
                            if (boolTest === "true"
                                || boolTest === "false") {
                                optionUser[key] = boolTest === "true";
                            }
                            else {
                                optionUser[key] = value;
                            }
                        }
                    }
                }
            }

            currentValue = elem.textContent;
            options = Object.assign(
                options,
                { width, height },
                optionUser);
        }


        if (options.element === null) {
            canv = createUtilityCanvas(options.width, options.height);
        }
        else if (isHTMLCanvas(options.element)) {
            element = canv = options.element;
            elementClearChildren(canv);
        }
        else {
            element = options.element;
            elementClearChildren(element);

            canv = Canvas(
                styles(
                    width("100%"),
                    height("100%")));

            element.appendChild(canv);
            element.removeAttribute("tabindex");

            styles(
                display("block"),
                padding("none"),
                border("2px inset #c0c0c0"),
                overflow("unset"))
                .apply(element);
        }

        if (canv.parentElement !== null
            && currentTabIndex === -1) {
            const tabbableElements = document.querySelectorAll("[tabindex]");
            for (let tabbableElement of tabbableElements) {
                currentTabIndex = Math.max(currentTabIndex, tabbableElement.tabIndex);
            }
            ++currentTabIndex;
        }

        if (canv instanceof HTMLCanvasElement
            && this.isInDocument) {
            canv.tabIndex = currentTabIndex;
            canv.style.touchAction = "none";
            canv.addEventListener("focus", () => this.focus());
            canv.addEventListener("blur", () => this.blur());

            canv.addEventListener("mouseover", this.readMouseOverEvent);
            canv.addEventListener("mouseout", this.readMouseOutEvent);
            canv.addEventListener("mousedown", this.readMouseDownEvent);
            canv.addEventListener("mouseup", this.readMouseUpEvent);
            canv.addEventListener("mousemove", this.readMouseMoveEvent);

            canv.addEventListener("touchstart", this.readTouchStartEvent);
            canv.addEventListener("touchend", this.readTouchEndEvent);
            canv.addEventListener("touchmove", this.readTouchMoveEvent);
        }
        //<<<<<<<<<< SETUP CANVAS <<<<<<<<<<

        //>>>>>>>>>> SETUP BUFFERS >>>>>>>>>>
        const context = canv.getContext("2d"),
            fg = createUtilityCanvas(canv.width, canv.height),
            fgfx = fg.getContext("2d"),
            bg = createUtilityCanvas(canv.width, canv.height),
            bgfx = bg.getContext("2d"),
            tg = createUtilityCanvas(canv.width, canv.height),
            tgfx = tg.getContext("2d");

        context.imageSmoothingEnabled
            = fgfx.imageSmoothingEnabled
            = bgfx.imageSmoothingEnabled
            = tgfx.imageSmoothingEnabled
            = true;
        context.textBaseline
            = fgfx.textBaseline
            = bgfx.textBaseline
            = tgfx.textBaseline
            = "top";

        tgfx.textAlign = "right";
        fgfx.textAlign = "left";
        //<<<<<<<<<< SETUP BUFFERS <<<<<<<<<<

        //>>>>>>>>>> INITIALIZE STATE >>>>>>>>>>
        this.addEventListener("blur", () => {
            if (tabPressed) {
                tabPressed = false;
                this.focus();
            }
        });

        if (isString(options.language)) {
            options.language = options.language.toLocaleLowerCase();
            if (grammars.has(options.language)) {
                options.language = grammars.get(options.language);
            }
            else {
                options.language = null;
            }
        }

        Object.seal(this);
        this.readOnly = options.readOnly;
        this.multiLine = options.multiLine;
        this.wordWrap = options.wordWrap;
        this.showScrollBars = options.scrollBars;
        this.showLineNumbers = options.lineNumbers;
        this.padding = options.padding;
        this.fontSize = options.fontSize;
        this.language = options.language;
        this.scaleFactor = options.scaleFactor;
        this.value = currentValue;
        //<<<<<<<<<< INITIALIZE STATE <<<<<<<<<<

        render = () => {
            requestAnimationFrame(doRender);
        };
        doRender();

        // This is done last so that controls that have errored 
        // out during their setup don't get added to the control
        // manager.
        Primrose.add(element, this);
    }

    private debugEvt<EventT>(name: string, callback?: (evt?: EventT) => void, debugLocal: boolean = false) {
        return (evt: EventT) => {
            if (debugLocal) {
                console.log(`Primrose #${this.elementID}`, name, evt);
            }

            if (isDefined(callback)) {
                callback(evt);
            }
        };
    }


    private startSelecting() {
        this.dragging = true;
        this.moveCursor(this.frontCursor);
    }

    private pointerDown() {
        this.focus();
        this.pressed = true;
    }

    private pointerMove() {
        if (this.dragging) {
            this.moveCursor(this.backCursor);
        }
        else if (this.pressed) {
            this.dragScroll();
        }
    }

    private mouseLikePointerDown<EventT>(setPointer: (evt: EventT) => void) {
        return (evt: EventT) => {
            setPointer(evt);
            this.pointerDown();
            this.startSelecting();
        };
    }

    private mouseLikePointerUp() {
        this.pressed = false;
        this.dragging = false;
        this.scrolling = false;
    }

    private mouseLikePointerMove<EventT>(setPointer: (evt: EventT) => void) {
        return (evt: EventT) => {
            setPointer(evt);
            this.pointerMove();
        };
    }

    private touchLikePointerDown<EventT>(setPointer: (evt: EventT) => void) {
        return (evt: EventT) => {
            setPointer(evt);
            this.tx = this.pointer.x;
            this.ty = this.pointer.y;
            this.pointerDown();
            this.longPress.start();
        };
    }

    private touchLikePointerUp() {
        if (this.longPress.cancel() && !this.dragging) {
            this.startSelecting();
        }
        this.mouseLikePointerUp();
        this.lastScrollDX = null;
        this.lastScrollDY = null;
    }

    private touchLikePointerMove<EventT>(setPointer: (evt: EventT) => void) {
        return (evt: EventT) => {
            setPointer(evt);
            if (this.longPress.isRunning) {
                const dx = this.pointer.x - this.tx,
                    dy = this.pointer.y - this.ty,
                    lenSq = dx * dx + dy * dy;
                if (lenSq > 25) {
                    this.longPress.cancel();
                }
            }

            if (!this.longPress.isRunning) {
                this.pointerMove();
            }
        };
    }


    private refreshBuffers() {
        this.resized = true;
        setContextSize(this.fgfx, this.canv.width, this.canv.height);
        setContextSize(this.bgfx, this.canv.width, this.canv.height);
        setContextSize(this.tgfx, this.canv.width, this.canv.height);
        this.refreshAllTokens();
    }

    private moveCursor(cursor: Cursor) {
        this.pointer.toCell(this.character, this.scroll, this.gridBounds);
        const gx = this.pointer.x - this.scroll.x,
            gy = this.pointer.y - this.scroll.y,
            onBottom = gy >= this.gridBounds.height,
            onLeft = gx < 0,
            onRight = this.pointer.x >= this.gridBounds.width;

        if (!this.scrolling && !onBottom && !onLeft && !onRight) {
            cursor.setXY(this.rows, this.pointer.x, this.pointer.y);
            this.backCursor.copy(cursor);
        }
        else if (this.scrolling || onRight && !onBottom) {
            this.scrolling = true;
            const scrollHeight = this.rows.length - this.gridBounds.height;
            if (gy >= 0 && scrollHeight >= 0) {
                const sy = gy * scrollHeight / this.gridBounds.height;
                this.scrollTo(this.scroll.x, sy);
            }
        }
        else if (onBottom && !onLeft) {
            let maxWidth = 0;
            for (let dy = 0; dy < this.rows.length; ++dy) {
                maxWidth = Math.max(maxWidth, this.rows[dy].stringLength);
            }
            const scrollWidth = maxWidth - this.gridBounds.width;
            if (gx >= 0 && scrollWidth >= 0) {
                const sx = gx * scrollWidth / this.gridBounds.width;
                this.scrollTo(sx, this.scroll.y);
            }
        }
        else if (onLeft && !onBottom) {
            // clicked in number-line gutter
        }
        else {
            // clicked in the lower-left corner
        }

        this.render();
    }

    private dragScroll() {
        if (this.lastScrollDX !== null
            && this.lastScrollDY !== null) {
            let dx = (this.lastScrollDX - this.pointer.x) / this.character.width,
                dy = (this.lastScrollDY - this.pointer.y) / this.character.height;
            this.scrollBy(dx, dy);
        }
        this.lastScrollDX = this.pointer.x;
        this.lastScrollDY = this.pointer.y;
    };


    /// <summary>
    /// Removes focus from the control.
    /// </summary>
    blur() {
        if (this.focused) {
            this.focused = false;
            this.dispatchEvent(this.blurEvt);
            this.render();
        }
    }

    /// <summary>
    /// Sets the control to be the focused control. If all controls in the app have been properly registered with the Event Manager, then any other, currently focused control will first get `blur`red.
    /// </summary>
    focus() {
        if (!this.focused) {
            this.focused = true;
            this.dispatchEvent(this.focusEvt);
            this.render();
        }
    }

    /// <summary>
    /// </summary>
    resize() {
        if (!this.isInDocument) {
            console.warn("Can't automatically resize a canvas that is not in the DOM tree");
        }
        else if (resizeContext(this.context, this.scaleFactor)) {
            this.refreshBuffers();
        }
    }

    /// <summary>
    /// Sets the scale-independent width and height of the editor control.
    /// </summary>
    setSize(w: number, h: number) {
        if (setContextSize(this.context, w, h, this.scaleFactor)) {
            this.refreshBuffers();
        }
    }

    /// <summary>
    /// Move the scroll window to a new location. Values get clamped to the text contents of the editor.
    /// </summary>
    scrollTo(x: number, y: number) {
        if (!this.wordWrap) {
            this.scroll.x = x;
        }
        this.scroll.y = y;
        return this.clampScroll();
    }

    /// <summary>
    /// Move the scroll window by a given amount to a new location. The final location of the scroll window gets clamped to the text contents of the editor.
    /// </summary>
    scrollBy(dx: number, dy: number) {
        return this.scrollTo(this.scroll.x + dx, this.scroll.y + dy);
    }



    /// <summary>
    /// The DOM element that was used to construct the `Primrose` control out of the document tree.If the Control was not constructed from the document tree, this value will be`null`.
    /// </summary>
    get element() { return this._element; }

    /// <summary>
    /// Returns `false` if `element` is null. Returns `true` otherwise.
    /// </summary>
    get isInDocument() {
        return isHTMLCanvas(this.canv)
            && document.body.contains(this.canv);
    }

    /// <summary>
    /// The canvas to which the editor is rendering text. If the `options.element` value was set to a canvas, that canvas will be returned. Otherwise, the canvas will be the canvas that Primrose created for the control. If `OffscreenCanvas` is not available, the canvas will be an `HTMLCanvasElement`.
    /// </summary>
    get canvas() {
        return this.canv;
    }

    /// <summary>
    /// Returns `true` when the control has a pointer hovering over it.
    /// </summary>
    get hovered() {
        return this._hovered;
    }

    /// <summary>
    /// Returns `true` when the control has been selected.Writing to this value will change the focus state of the control.
    /// If the control is already focused and`focused` is set to`true`, or the control is not focused and`focus` is set to`false`, nothing happens.
    /// If the control is focused and`focused` is set to`false`, the control is blurred, just as if `blur()` was called.
    /// If the control is not focused and`focused` is set to`true`, the control is blurred, just as if `focus()` was called.
    /// </summary>
    get focused() {
        return this._focused;
    }

    set focused(f) {
        if (f !== this.focused) {
            if (f) {
                this.focus();
            }
            else {
                this.blur();
            }
        }
    }

    /// <summary>
    /// Indicates whether or not the text in the editor control can be modified.
    /// </summary>
    readOnly: {
        get: () => readOnly,
        set: (r) => {
                    r = !!r;
    if(r !== readOnly) {
    readOnly = r;
    refreshControlType();
}
                };
        },

multiLine: {
    get: () => multiLine,
        set: (m) => {
            m = !!m;
            if (m !== multiLine) {
                if (!m && wordWrap) {
                    this.wordWrap = false;
                }
                multiLine = m;
                refreshControlType();
                refreshGutter();
            }
        };
},

/// <summary>
/// Indicates whether or not the text in the editor control will be broken across lines when it reaches the right edge of the editor control.
/// </summary>
wordWrap: {
    get: () => wordWrap,
        set: (w) => {
            w = !!w;
            if (w !== wordWrap
                && (multiLine
                    || !w)) {
                wordWrap = w;
                refreshGutter();
                render();
            }
        };
},

/// <summary>
/// The text value contained in the control. NOTE: if the text value was set with Windows-style newline characters (`\r\n`), the newline characters will be normalized to Unix-style newline characters (`\n`).
/// </summary>
value: {
    get: () => value,
        set: (txt) => setValue(txt, true);
},

/// <summary>
/// A synonymn for `value`
/// </summary>
text: {
    get: () => value,
        set: (txt) => setValue(txt, true);
},

/// <summary>
/// The range of text that is currently selected by the cursor. If no text is selected, reading `selectedText` returns the empty string (`""`) and writing to it inserts text at the current cursor location. 
/// If text is selected, reading `selectedText` returns the text between the front and back cursors, writing to it overwrites the selected text, inserting the provided value.
/// </summary>
selectedText: {
    get: () => {
        const minCursor = Cursor.min(frontCursor, backCursor),
            maxCursor = Cursor.max(frontCursor, backCursor);
        return value.substring(minCursor.i, maxCursor.i);
    },
        set: (txt) => {
            setSelectedText(txt);
        };
},

/// <summary>
/// The string index at which the front cursor is located. NOTE: the "front cursor" is the main cursor, but does not necessarily represent the beginning of the selction range. The selection range runs from the minimum of front and back cursors, to the maximum.
/// </summary>
selectionStart: {
    get: () => frontCursor.i,
        set: (i) => {
            i = i | 0;
            if (i !== frontCursor.i) {
                frontCursor.setI(rows, i);
                render();
            }
        };
},

/// <summary>
/// The string index at which the back cursor is located. NOTE: the "back cursor" is the selection range cursor, but does not necessarily represent the end of the selction range. The selection range runs from the minimum of front and back cursors, to the maximum.
/// </summary>
selectionEnd: {
    get: () => backCursor.i,
        set: (i) => {
            i = i | 0;
            if (i !== backCursor.i) {
                backCursor.setI(rows, i);
                render();
            }
        };
},

/// <summary>
/// If the back cursor is behind the front cursor, this value returns `"backward"`. Otherwise, `"forward"` is returned.
/// </summary>
selectionDirection: {
    get: () => frontCursor.i <= backCursor.i
        ? "forward"
        : "backward";
},

/// <summary>
/// The number of spaces to insert when the <kbd>Tab</kbd> key is pressed. Changing this value does not convert existing tabs, it only changes future tabs that get inserted.
/// </summary>
tabWidth: {
    get: () => tabWidth,
        set: (tw) => {
            tabWidth = tw || 2;
            tabString = "";
            for (let i = 0; i < tabWidth; ++i) {
                tabString += " ";
            }
        };
},

/// <summary>
/// A JavaScript object that defines the color and style values for rendering different UI and text elements.
/// </summary>
theme: {
    get: () => theme,
        set: (t) => {
            if (t !== theme) {
                theme = t;
                render();
            }
        };
},

/// <summary>
/// Set or get the language pack used to tokenize the control text for syntax highlighting.
/// </summary>
language: {
    get: () => language,
        set: (l) => {
            if (l !== language) {
                language = l;
                refreshAllTokens();
            }
        };
},

/// <summary>
/// The `Number` of pixels to inset the control rendering from the edge of the canvas. This is useful for texturing objects where the texture edge cannot be precisely controlled. This value is scale-independent.
/// </summary>
padding: {
    get: () => padding,
        set: (p) => {
            p = p | 0;
            if (p !== padding) {
                pad = p;
                render();
            }
        };
},

/// <summary>
/// Indicates whether or not line numbers should be rendered on the left side of the control.
/// </summary>
showLineNumbers: {
    get: () => showLineNumbers,
        set: (s) => {
            s = s || false;
            if (s !== showLineNumbers) {
                showLineNumbers = s;
                refreshGutter();
            }
        };
},

/// <summary>
/// Indicates whether or not scroll bars should be rendered at the right and bottom in the control. If wordWrap is enabled, the bottom, horizontal scrollbar will not be rendered.
/// </summary>
showScrollBars: {
    get: () => showScrollBars,
        set: (s) => {
            s = s || false;
            if (s !== showScrollBars) {
                showScrollBars = s;
                refreshGutter();
            }
        };
},

/// <summary>
/// The `Number` of pixels tall to draw characters. This value is scale-independent.
/// </summary>
fontSize: {
    get: () => fontSize,
        set: (s) => {
            s = Math.max(1, s || 0);
            if (s !== fontSize) {
                fontSize = s;
                context.font = `${fontSize}px ${getMonospaceFamily()}`;
                character.height = fontSize;
                // measure 100 letter M's, then divide by 100, to get the width of an M
                // to two decimal places on systems that return integer values from
                // measureText.
                character.width = context.measureText(
                    "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM")
                    .width /
                    100;
                refreshAllTokens();
            }
        };
},

/// <summary>
/// The value by which pixel values are scaled before being used by the editor control.
/// With THREE.js, it's best to set this value to 1 and change the width, height, and fontSize manually.
/// </summary>
get scaleFactor() {
    return this._scaleFactor;
}
set scaleFactor(s){
    s = Math.max(0.25, Math.min(4, s || 0));
    if (s !== this.scaleFactor) {
        const lastWidth = this.width,
            lastHeight = this.height;
        this._scaleFactor = s;
        this.setSize(lastWidth, lastHeight);
    }
}

/// <summary>
/// The scale-independent width of the editor control.
/// </summary>
get width() {
    return this.canv.width / this.scaleFactor;
}
set width(w){
    this.setSize(w, this.height);
}

/// <summary>
/// The scale-independent height of the editor control.
/// </summary>
get height() {
    return this.canv.height / this.scaleFactor;
}
set height(h){
    this.setSize(this.width, h);
}

    /// <summary>
    /// Checks for the existence of a control, by the key that the user supplied when calling `Primrose.add()`
    /// </summary>
    static has(key: any) {
    return elements.has(key);
}

    /// <summary>
    /// Gets the control associated with the given key.
    /// </summary>
    static get(key: any) {
    return elements.has(key)
        ? elements.get(key)
        : null;
}


    /// <summary>
    /// Registers a new Primrose editor control with the Event Manager, to wire-up key, clipboard, and mouse wheel events, and to manage the currently focused element.
    /// The Event Manager maintains the references in a WeakMap, so when the JS Garbage Collector collects the objects, they will be gone.
    /// Multiple objects may be used to register a single control with the Event Manager without causing issue.This is useful for associating the control with closed objects from other systems, such as Three.js Mesh objects being targeted for pointer picking.
    /// If you are working with Three.js, it's recommended to use the Mesh on which you are texturing the canvas as the key when adding the editor to the Event Manager.
    /// </summary>
    static add(key: any, control: Primrose) {
    if (key !== null) {
        elements.set(key, control);
    }

    if (controls.indexOf(control) === -1) {
        controls.push(control);
        publicControls = controls.slice();

        control.addEventListener("blur", () => {
            focusedControl = null;
        });

        control.addEventListener("focus", () => {
            // make sure the previous control knows it has 
            // gotten unselected.
            if (focusedControl !== null
                && (!focusedControl.isInDocument
                    || !control.isInDocument)) {
                focusedControl.blur();
            }
            focusedControl = control;
        });

        control.addEventListener("over", () => {
            hoveredControl = control;
        });

        control.addEventListener("out", () => {
            hoveredControl = null;
        });
    }
}


    /// <summary>
    /// The current `Primrose` control that has the mouse hovered over it. In 2D contexts, you probably don't need to check this value, but in WebGL contexts, this is useful for helping Primrose manage events.
    /// If no control is hovered, this returns `null`.
    /// </summary>
    static get hoveredControl() {
    return hoveredControl;
}

    /// <summary>
    /// The current `Primrose` control that has pointer-focus. It will receive all keyboard and clipboard events. In 2D contexts, you probably don't need to check this value, but in WebGL contexts, this is useful for helping Primrose manage events.
    /// If no control is focused, this returns `null`.
    /// </summary>
    static get focusedControl() {
    return focusedControl;
}

    /// <summary>
    /// An array of all of the `Primrose` editor controls that Primrose currently knows about.
    /// This array is not mutable and is not the array used by the Event Manager. It is a read-only clone that is created whenever the Event Manager registers or removes a new control
    /// </summary.
    static get editors() {
    return publicControls;
}

    /// <summary>
    /// A `Promise` that resolves when the document is ready and the Event Manager has finished its initial setup.
    /// </summary>
    static get ready() {
    return ready;
}
}

Object.freeze(Primrose);

requestAnimationFrame(function update() {
    requestAnimationFrame(update);
    for (let i = controls.length - 1; i >= 0; --i) {
        const control = controls[i];
        if (control.isInDocument) {
            if (elements.has(control.element)) {
                control.resize();
            }
            else {
                controls.splice(i, 1);
                publicControls = Object.freeze(controls.slice());
            }
        }
    }
});

const withCurrentControl = (name: string) => {
    const evtName = name.toLocaleLowerCase(),
        funcName = `read${name}Event`;

    window.addEventListener(evtName, (evt: Event) => {
        if (focusedControl !== null) {
            focusedControl[funcName](evt);
        }
    }, { passive: false });
};

withCurrentControl("KeyDown");
withCurrentControl("KeyPress");
withCurrentControl("KeyUp");
withCurrentControl("Copy");
withCurrentControl("Cut");
withCurrentControl("Paste");

window.addEventListener("wheel", (evt) => {
    const control = focusedControl || hoveredControl;
    if (control !== null) {
        control.readWheelEvent(evt);
    }
}, { passive: false });