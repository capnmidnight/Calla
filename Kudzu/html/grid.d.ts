/**
 * Constructs a CSS grid area definition.
 * @param x - the starting horizontal cell for the element.
 * @param y - the starting vertical cell for the element.
 * @param [w] - the number of cells wide the element should cover.
 * @param [h] - the number of cells tall the element should cover.
 */
export declare function gridPos(x: number, y: number, w?: number, h?: number): import("./attrs").Attr;
/**
 * Constructs a CSS grid column definition
 * @param x - the starting horizontal cell for the element.
 * @param [w] - the number of cells wide the element should cover.
 */
export declare function col(x: number, w?: number): import("./attrs").Attr;
/**
 * Constructs a CSS grid row definition
 * @param y - the starting vertical cell for the element.
 * @param [h] - the number of cells tall the element should cover.
 */
export declare function row(y: number, h?: number): import("./attrs").Attr;
/**
 * Create the gridTemplateColumns and gridTemplateRows styles.
 */
export declare function gridDef(cols: string[], rows: string[]): import("./attrs").CssPropSet;
/**
 * Create the gridTemplateColumns style attribute, with display set to grid.
 */
export declare function gridColsDef(...cols: string[]): import("./attrs").CssPropSet;
/**
 * Create the gridTemplateRows style attribute, with display set to grid.
 */
export declare function gridRowsDef(...rows: string[]): import("./attrs").CssPropSet;
