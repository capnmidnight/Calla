import { isBoolean } from "../typeChecks.js";
import { HtmlAttr, style } from "./attrs.js";

/**
 * A CSS property that will be applied to an element's style attribute.
 **/
export class CssProp {
    /**
     * Creates a new CSS property that will be applied to an element's style attribute.
     * @param {string} key - the property name.
     * @param {string} value - the value to set for the property.
     */
    constructor(key, value) {
        this.key = key;
        this.value = value;
        Object.freeze(this);
    }

    /**
     * Set the attribute value on an HTMLElement
     * @param {HTMLElement} elem - the element on which to set the attribute.
     */
    apply(elem) {
        elem.style[this.key] = this.value;
    }
}

/**
 * Combine style properties.
  * @param {...CssProp} rest
 * @returns {HtmlAttr}
 */
export function styles(...rest) {
    const obj = {};
    const set = (key, value) => {
        if (value || isBoolean(value)) {
            obj[key] = value;
        }
        else if (obj[key] || isBoolean(obj[key])) {
            delete obj[key];
        }
    };

    for (let prop of rest) {
        if (prop instanceof CssProp) {
            set(prop.key, prop.value);
        }
        else if (prop instanceof HtmlAttr) {
            for (let key in prop.value) {
                set(key, prop.value[key]);
            }
        }
    }
    return style(obj);
}

/**
 * Creates a style attribute with a backgroundColor property.
 * @param {string} c
 * @returns {CssProp}
 */
export function bgColor(c) { return new CssProp("backgroundColor", c); }

/**
 * Creates a style attribute with a border property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function border(v) { return new CssProp("border", v); }

/**
 * Creates a style attribute with a borderBottom property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function borderBottom(v) { return new CssProp("borderBottom", v); }

/**
 * Creates a style attribute with a borderBottomColor property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function borderBottomColor(v) { return new CssProp("borderBottomColor", v); }


/**
 * Creates a style attribute with a borderBottomSize property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function borderBottomSize(v) { return new CssProp("borderBottomSize", v); }

/**
 * Creates a style attribute with a borderBottomStyle property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function borderBottomStyle(v) { return new CssProp("borderBottomStyle", v); }

/**
 * Creates a style attribute with a borderLeft property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function borderLeft(v) { return new CssProp("borderLeft", v); }

/**
 * Creates a style attribute with a borderLeftColor property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function borderLeftColor(v) { return new CssProp("borderLeftColor", v); }


/**
 * Creates a style attribute with a borderLeftSize property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function borderLeftSize(v) { return new CssProp("borderLeftSize", v); }

/**
 * Creates a style attribute with a borderLeftStyle property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function borderLeftStyle(v) { return new CssProp("borderLeftStyle", v); }

/**
 * Creates a style attribute with a borderRight property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function borderRight(v) { return new CssProp("borderRight", v); }

/**
 * Creates a style attribute with a borderRightColor property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function borderRightColor(v) { return new CssProp("borderRightColor", v); }


/**
 * Creates a style attribute with a borderRightSize property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function borderRightSize(v) { return new CssProp("borderRightSize", v); }

/**
 * Creates a style attribute with a borderRightStyle property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function borderRightStyle(v) { return new CssProp("borderRightStyle", v); }

/**
 * Creates a style attribute with a borderSize property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function borderSize(v) { return new CssProp("borderSize", v); }

/**
 * Creates a style attribute with a borderStyle property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function borderStyle(v) { return new CssProp("borderStyle", v); }

/**
 * Creates a style attribute with a borderTop property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function borderTop(v) { return new CssProp("borderTop", v); }

/**
 * Creates a style attribute with a borderTopColor property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function borderTopColor(v) { return new CssProp("borderTopColor", v); }


/**
 * Creates a style attribute with a borderTopSize property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function borderTopSize(v) { return new CssProp("borderTopSize", v); }

/**
 * Creates a style attribute with a borderTopStyle property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function borderTopStyle(v) { return new CssProp("borderTopStyle", v); }

/**
 * Creates a style attribute with a columnGap property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function columnGap(v) { return new CssProp("columnGap", v); }

/**
 * Creates a style attribute with a height property.
 * @param {string} h
 * @returns {CssProp}
 */
export function cssHeight(h) { return new CssProp("height", h); }

/**
 * Creates a style attribute with a width property.
 * @param {string} w
 * @returns {CssProp}
 */
export function cssWidth(w) { return new CssProp("width", w); }

/**
 * Creates a style attribute with a display property.
 * @param {string} v
 * @returns {CssProp}
 */
export function display(v) { return new CssProp("display", v); }

/**
 * Creates a style attribute with a color property.
 * @param {string} c
 * @returns {CssProp}
 */
export function fgColor(c) { return new CssProp("color", c); }

/**
 * Creates a style attribute with a fontFamily property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function fontFamily(v) { return new CssProp("fontFamily", v); }

/**
 * Creates a style attribute with a fontSize property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function fontSize(v) { return new CssProp("fontSize", v); }

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
        col(x, w),
        row(y, h),
        addStyles);
}

/**
 * Constructs a CSS grid column definition
 * @param {number} x - the starting horizontal cell for the element.
 * @param {number} [w=null] - the number of cells wide the element should cover.
 * @returns {HtmlAttr}
 */
export function col(x, w = null) {
    if (w === null) {
        w = 1;
    }
    return styles(
        gridColumnStart(x),
        gridColumnEnd(x + w));
}

/**
 * Creates a style attribute with a gridColumnEnd property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function gridColumnEnd(v) { return new CssProp("gridColumnEnd", v); }

/**
 * Creates a style attribute with a gridColumnStart property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function gridColumnStart(v) { return new CssProp("gridColumnStart", v); }

/**
 * Constructs a CSS grid row definition
 * @param {number} y - the starting vertical cell for the element.
 * @param {number} [h=null] - the number of cells tall the element should cover.
 * @returns {HtmlAttr}
 */
export function row(y, h = null) {
    if (h === null) {
        h = 1;
    }
    return styles(
        gridRowStart(y),
        gridRowEnd(y + h));
}

/**
 * Creates a style attribute with a gridRowEnd property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function gridRowEnd(v) { return new CssProp("gridRowEnd", v); }

/**
 * Creates a style attribute with a gridRowStart property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function gridRowStart(v) { return new CssProp("gridRowStart", v); }

/**
 * Create the gridTemplateColumns and gridTemplateRows styles.
 * @param {string[]} cols
 * @param {string[]} rows
 * @param {any} addStyles
 * @returns {HtmlAttr}
 */
export function gridTemplate(cols, rows, addStyles) {
    return styles(
        gridColsDef(...cols),
        gridRowsDef(...rows),
        addStyles);
}

/**
 * Create the gridTemplateColumns style attribute, with display set to grid.
 * @param {...string} cols
 * @returns {HtmlAttr}
 */
export function gridColsDef(...cols) {
    return styles(
        display("grid"),
        gridTemplateColumns(cols.join(" ")));
}

/**
 * Creates a style attribute with a gridTemplateColumns property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function gridTemplateColumns(v) { return new CssProp("gridTemplateColumns", v); }

/**
 * Create the gridTemplateRows style attribute, with display set to grid.
 * @param {...string} rows
 * @returns {HtmlAttr}
 */
export function gridRowsDef(...rows) {
    return styles(
        display("grid"),
        gridTemplateRows(rows.join(" ")));
}

/**
 * Creates a style attribute with a gridTemplateRows property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function gridTemplateRows(v) { return new CssProp("gridTemplateRows", v); }

/**
 * Creates a style attribute with a margin property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function margin(v) { return new CssProp("margin", v); }

/**
 * Creates a style attribute with a arginBottom property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function marginBottom(v) { return new CssProp("arginBottom", v); }

/**
 * Creates a style attribute with a marginLeft property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function marginLeft(v) { return new CssProp("marginLeft", v); }

/**
 * Creates a style attribute with a marginRight property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function marginRight(v) { return new CssProp("marginRight", v); }

/**
 * Creates a style attribute with a marginTop property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function marginTop(v) { return new CssProp("marginTop", v); }

/**
 * Creates a style attribute with a overflow property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function overflow(v) { return new CssProp("overflow", v); }

/**
 * Creates a style attribute with a overflowX property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function overflowX(v) { return new CssProp("overflowX", v); }

/**
 * Creates a style attribute with a overflowY property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function overflowY(v) { return new CssProp("overflowY", v); }

/**
 * Creates a style attribute with a padding property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function padding(v) { return new CssProp("padding", v); }

/**
 * Creates a style attribute with a paddingBottom property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function paddingBottom(v) { return new CssProp("paddingBottom", v); }

/**
 * Creates a style attribute with a paddingLeft property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function paddingLeft(v) { return new CssProp("paddingLeft", v); }

/**
 * Creates a style attribute with a paddingRight property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function paddingRight(v) { return new CssProp("paddingRight", v); }

/**
 * Creates a style attribute with a paddingTop property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function paddingTop(v) { return new CssProp("paddingTop", v); }

/**
 * Creates a style attribute with a pointerEvents property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function pointerEvents(v) { return new CssProp("pointerEvents", v); }

/**
 * Creates a style attribute with a textAlign property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function textAlign(v) { return new CssProp("textAlign", v); }

/**
 * Creates a style attribute with a textDecoration property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function textDecoration(v) { return new CssProp("textDecoration", v); }

/**
 * Creates a style attribute with a textTransform property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function textTransform(v) { return new CssProp("textTransform", v); }

/**
 * Creates a style attribute with a touchAction property.
 * @param {string} v
 * @returns {CssProp}
 */
export function touchAction(v) { return new CssProp("touchAction", v); }

/**
 * Creates a style attribute with a whiteSpace property.
 * @param {string} v
 * @returns {CssProp}
 **/
export function whiteSpace(v) { return new CssProp("whiteSpace", v); }

/**
 * Creates a style attribute with a zIndex property.
 * @param {number} v
 * @returns {CssProp}
 */
export function zIndex(z) { return new CssProp("zIndex", z); }

// A selection of fonts for preferred monospace rendering.
export const monospaceFonts = "'Droid Sans Mono', 'Consolas', 'Lucida Console', 'Courier New', 'Courier', monospace";
export const monospaceFamily = fontFamily(monospaceFonts);
// A selection of fonts that should match whatever the user's operating system normally uses.
export const systemFonts = "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif";
export const systemFamily = fontFamily(systemFonts);
