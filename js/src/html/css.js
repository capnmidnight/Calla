import { HtmlAttr, style } from "./attrs.js";
import { isBoolean, isString } from "../typeChecks.js";
/**
 * Add additional fields to a style attribute.
 * @param {HtmlAttr} a
 * @param {...any} rest
 * @returns {HtmlAttr}
 */
export function styles(a, ...rest) {
    for (let b of rest) {
        if (b instanceof HtmlAttr) {
            b = b.value;
        }
        for (let key in b) {
            const value = b[key];
            if (isString(key)) {
                if (value || isBoolean(value)) {
                    a.value[key] = value;
                }
                else {
                    delete a.value[key];
                }
            }
        }
    }
    return a;
}

/**
 * Creates a style attribute with a backgroundColor property.
 * @param {string} c
 * @returns {HtmlAttr}
 */
export function bgColor(c) { return style({ backgroundColor: c }); }

/**
 * Creates a style attribute with a border property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function border(v) { return style({ border: v }); }

/**
 * Creates a style attribute with a borderBottom property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderBottom(v) { return style({ borderBottom: v }); }

/**
 * Creates a style attribute with a borderBottomColor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderBottomColor(v) { return style({ borderBottomColor: v }); }


/**
 * Creates a style attribute with a borderBottomSize property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderBottomSize(v) { return style({ borderBottomSize: v }); }

/**
 * Creates a style attribute with a borderBottomStyle property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderBottomStyle(v) { return style({ borderBottomStyle: v }); }

/**
 * Creates a style attribute with a borderLeft property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderLeft(v) { return style({ borderLeft: v }); }

/**
 * Creates a style attribute with a borderLeftColor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderLeftColor(v) { return style({ borderLeftColor: v }); }


/**
 * Creates a style attribute with a borderLeftSize property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderLeftSize(v) { return style({ borderLeftSize: v }); }

/**
 * Creates a style attribute with a borderLeftStyle property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderLeftStyle(v) { return style({ borderLeftStyle: v }); }

/**
 * Creates a style attribute with a borderRight property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderRight(v) { return style({ borderRight: v }); }

/**
 * Creates a style attribute with a borderRightColor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderRightColor(v) { return style({ borderRightColor: v }); }


/**
 * Creates a style attribute with a borderRightSize property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderRightSize(v) { return style({ borderRightSize: v }); }

/**
 * Creates a style attribute with a borderRightStyle property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderRightStyle(v) { return style({ borderRightStyle: v }); }

/**
 * Creates a style attribute with a borderSize property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderSize(v) { return style({ borderSize: v }); }

/**
 * Creates a style attribute with a borderStyle property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderStyle(v) { return style({ borderStyle: v }); }

/**
 * Creates a style attribute with a borderTop property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderTop(v) { return style({ borderTop: v }); }

/**
 * Creates a style attribute with a borderTopColor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderTopColor(v) { return style({ borderTopColor: v }); }


/**
 * Creates a style attribute with a borderTopSize property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderTopSize(v) { return style({ borderTopSize: v }); }

/**
 * Creates a style attribute with a borderTopStyle property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderTopStyle(v) { return style({ borderTopStyle: v }); }

/**
 * Creates a style attribute with a columnGap property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function columnGap(v) { return style({ columnGap: v }); }

/**
 * Creates a style attribute with a height property.
 * @param {string} h
 * @returns {HtmlAttr}
 */
export function cssHeight(h) { return style({ height: h }); }

/**
 * Creates a style attribute with a width property.
 * @param {string} w
 * @returns {HtmlAttr}
 */
export function cssWidth(w) { return style({ width: w }); }

/**
 * Creates a style attribute with a display property.
 * @param {string} v
 * @returns {HtmlAttr}
 */
export function display(v) { return style({ display: v }); }

/**
 * Creates a style attribute with a color property.
 * @param {string} c
 * @returns {HtmlAttr}
 */
export function fgColor(c) { return style({ color: c }); }

/**
 * Creates a style attribute with a fontFamily property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function fontFamily(v) { return style({ fontFamily: v }); }

/**
 * Creates a style attribute with a fontSize property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function fontSize(v) { return style({ fontSize: v }); }

/**
 * Constructs a CSS grid area definition.
 * @param {number} x - the starting horizontal cell for the element.
 * @param {number} y - the starting vertical cell for the element.
 * @param {number} [w=null] - the number of cells wide the element should cover.
 * @param {number} [h=null] - the number of cells tall the element should cover.
 * @returns {HtmlAttr}
 */
export function gridArea(x, y, w = null, h = null, addStyles = null) {
    if (w === null) {
        w = 1;
    }
    if (h === null) {
        h = 1;
    }
    return styles(
        gridColumn(x, w),
        gridRow(y, h),
        addStyles);
}

/**
 * Constructs a CSS grid column definition
 * @param {number} x - the starting horizontal cell for the element.
 * @param {number} [w=null] - the number of cells wide the element should cover.
 * @returns {HtmlAttr}
 */
export function gridColumn(x, w = null) {
    if (w === null) {
        w = 1;
    }
    return style({
        gridColumnStart: x,
        gridColumnEnd: x + w
    });
}

/**
 * Constructs a CSS grid row definition
 * @param {number} y - the starting vertical cell for the element.
 * @param {number} [h=null] - the number of cells tall the element should cover.
 * @returns {HtmlAttr}
 */
export function gridRow(y, h = null) {
    if (h === null) {
        h = 1;
    }
    return style({
        gridRowStart: y,
        gridRowEnd: y + h
    });
}

/**
 * Create the gridTemplateColumns and gridTemplateRows styles.
 * @param {string[]} cols
 * @param {string[]} rows
 * @param {any} addStyles
 * @returns {HtmlAttr}
 */
export function gridTemplate(cols, rows, addStyles) {
    return styles(
        gridTemplateColumns(...cols),
        gridTemplateRows(...rows),
        addStyles);
}

/**
 * Create the gridTemplateColumns style attribute, with display set to grid.
 * @param {...string} cols
 * @returns {HtmlAttr}
 */
export function gridTemplateColumns(...cols) {
    return style({
        display: "grid",
        gridTemplateColumns: cols.join(" ")
    });
}

/**
 * Create the gridTemplateRows style attribute, with display set to grid.
 * @param {...string} rows
 * @returns {HtmlAttr}
 */
export function gridTemplateRows(...rows) {
    return style({
        display: "grid",
        gridTemplateRows: rows.join(" ")
    });
}

/**
 * Creates a style attribute with a margin property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function margin(v) { return style({ margin: v }); }

/**
 * Creates a style attribute with a arginBottom property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function marginBottom(v) { return style({ arginBottom: v }); }

/**
 * Creates a style attribute with a marginLeft property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function marginLeft(v) { return style({ marginLeft: v }); }

/**
 * Creates a style attribute with a marginRight property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function marginRight(v) { return style({ marginRight: v }); }

/**
 * Creates a style attribute with a marginTop property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function marginTop(v) { return style({ marginTop: v }); }

/**
 * Creates a style attribute with a overflow property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function overflow(v) { return style({ overflow: v }); }

/**
 * Creates a style attribute with a overflowX property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function overflowX(v) { return style({ overflowX: v }); }

/**
 * Creates a style attribute with a overflowY property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function overflowY(v) { return style({ overflowY: v }); }

/**
 * Creates a style attribute with a padding property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function padding(v) { return style({ padding: v }); }

/**
 * Creates a style attribute with a paddingBottom property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function paddingBottom(v) { return style({ paddingBottom: v }); }

/**
 * Creates a style attribute with a paddingLeft property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function paddingLeft(v) { return style({ paddingLeft: v }); }

/**
 * Creates a style attribute with a paddingRight property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function paddingRight(v) { return style({ paddingRight: v }); }

/**
 * Creates a style attribute with a paddingTop property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function paddingTop(v) { return style({ paddingTop: v }); }

/**
 * Creates a style attribute with a pointerEvents property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function pointerEvents(v) { return style({ pointerEvents: v }); }

/**
 * Creates a style attribute with a textAlign property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function textAlign(v) { return style({ textAlign: v }); }

/**
 * Creates a style attribute with a textDecoration property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function textDecoration(v) { return style({ textDecoration: v }); }

/**
 * Creates a style attribute with a textTransform property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function textTransform(v) { return style({ textTransform: v }); }

/**
 * Creates a style attribute with a touchAction property.
 * @param {string} v
 * @returns {HtmlAttr}
 */
export function touchAction(v) { return style({ touchAction: v }); }

/**
 * Creates a style attribute with a whiteSpace property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function whiteSpace(v) { return style({ whiteSpace: v }); }

/**
 * Creates a style attribute with a zIndex property.
 * @param {number} v
 * @returns {HtmlAttr}
 */
export function zIndex(z) { return style({ zIndex: z }); }

// A selection of fonts for preferred monospace rendering.
export const monospaceFonts = "'Droid Sans Mono', 'Consolas', 'Lucida Console', 'Courier New', 'Courier', monospace";
export const monospaceFamily = fontFamily(monospaceFonts);
// A selection of fonts that should match whatever the user's operating system normally uses.
export const systemFonts = "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif";
export const systemFamily = fontFamily(systemFonts);
