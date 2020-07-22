import { display, gridArea, gridColumn, gridRow, gridTemplateColumns, gridTemplateRows, styles } from "./css.js";
/**
 * Constructs a CSS grid area definition.
 * @param {number} x - the starting horizontal cell for the element.
 * @param {number} y - the starting vertical cell for the element.
 * @param {number} [w=null] - the number of cells wide the element should cover.
 * @param {number} [h=null] - the number of cells tall the element should cover.
 * @returns {CssProp}
 */
export function gridPos(x, y, w = null, h = null) {
    if (w === null) {
        w = 1;
    }
    if (h === null) {
        h = 1;
    }
    return gridArea(`${y}/${x}/${y + h}/${x + w}`);
}
/**
 * Constructs a CSS grid column definition
 * @param {number} x - the starting horizontal cell for the element.
 * @param {number} [w=null] - the number of cells wide the element should cover.
 * @returns {CssProp}
 */
export function col(x, w = null) {
    if (w === null) {
        w = 1;
    }
    return gridColumn(`${x}/${x + w}`);
}
/**
 * Constructs a CSS grid row definition
 * @param {number} y - the starting vertical cell for the element.
 * @param {number} [h=null] - the number of cells tall the element should cover.
 * @returns {CssProp}
 */
export function row(y, h = null) {
    if (h === null) {
        h = 1;
    }
    return gridRow(`${y}/${y + h}`);
}
/**
 * Create the gridTemplateColumns and gridTemplateRows styles.
 * @param {string[]} cols
 * @param {string[]} rows
 * @returns {CssPropSet}
 */
export function gridDef(cols, rows) {
    return styles(
        gridColsDef(...cols),
        gridRowsDef(...rows));
}

const displayGrid = display("grid");

/**
 * Create the gridTemplateColumns style attribute, with display set to grid.
 * @param {...string} cols
 * @returns {CssPropSet}
 */
export function gridColsDef(...cols) {
    return styles(
        displayGrid,
        gridTemplateColumns(cols.join(" ")));
}
/**
 * Create the gridTemplateRows style attribute, with display set to grid.
 * @param {...string} rows
 * @returns {CssPropSet}
 */
export function gridRowsDef(...rows) {
    return styles(
        displayGrid,
        gridTemplateRows(rows.join(" ")));
}
