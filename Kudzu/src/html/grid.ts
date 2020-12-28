import { isNullOrUndefined } from "../typeChecks";
import { display, gridArea, gridColumn, gridRow, gridTemplateColumns, gridTemplateRows, styles } from "./css";
/**
 * Constructs a CSS grid area definition.
 * @param x - the starting horizontal cell for the element.
 * @param y - the starting vertical cell for the element.
 * @param [w] - the number of cells wide the element should cover.
 * @param [h] - the number of cells tall the element should cover.
 */
export function gridPos(x: number, y: number, w?: number, h?: number) {
    if (isNullOrUndefined(w)) {
        w = 1;
    }
    if (isNullOrUndefined(h)) {
        h = 1;
    }
    return gridArea(`${y}/${x}/${y + h}/${x + w}`);
}
/**
 * Constructs a CSS grid column definition
 * @param x - the starting horizontal cell for the element.
 * @param [w] - the number of cells wide the element should cover.
 */
export function col(x: number, w?: number) {
    if (isNullOrUndefined(w)) {
        w = 1;
    }
    return gridColumn(`${x}/${x + w}`);
}
/**
 * Constructs a CSS grid row definition
 * @param y - the starting vertical cell for the element.
 * @param [h] - the number of cells tall the element should cover.
 */
export function row(y: number, h?: number) {
    if (isNullOrUndefined(h)) {
        h = 1;
    }
    return gridRow(`${y}/${y + h}`);
}

/**
 * Create the gridTemplateColumns and gridTemplateRows styles.
 */
export function gridDef(cols: string[], rows: string[]) {
    return styles(
        gridColsDef(...cols),
        gridRowsDef(...rows));
}

const displayGrid = display("grid");

/**
 * Create the gridTemplateColumns style attribute, with display set to grid.
 */
export function gridColsDef(...cols: string[]) {
    return styles(
        displayGrid,
        gridTemplateColumns(cols.join(" ")));
}

/**
 * Create the gridTemplateRows style attribute, with display set to grid.
 */
export function gridRowsDef(...rows: string[]) {
    return styles(
        displayGrid,
        gridTemplateRows(rows.join(" ")));
}
