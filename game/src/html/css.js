import { isBoolean } from "../../../js/src/index.js";

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

export class CssPropSet {
    /**
     * @param {...(CssProp|CssPropSet)} rest
     */
    constructor(...rest) {
        this.set = new Map();
        const set = (key, value) => {
            if (value || isBoolean(value)) {
                this.set.set(key, value);
            }
            else if (this.set.has(key)) {
                this.set.delete(key);
            }
        }
        for (let prop of rest) {
            if (prop instanceof CssProp) {
                const { key, value } = prop;
                set(key, value);
            }
            else if (prop instanceof CssPropSet) {
                for (let subProp of prop.set.entries()) {
                    const [key, value] = subProp;
                    set(key, value);
                }
            }
        }
    }

    /**
     * Set the attribute value on an HTMLElement
     * @param {HTMLElement} elem - the element on which to set the attribute.
     */
    apply(elem) {
        for (let prop of this.set.entries()) {
            const [key, value] = prop;
            elem.style[key] = value;
        }
    }
}

/**
 * Combine style properties.
 * @param {...CssProp} rest
 * @returns {CssPropSet}
 */
export function styles(...rest) {
    return new CssPropSet(...rest);
}

/**
 * Creates a style attribute with a alignContent property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function alignContent(v) { return new CssProp("alignContent", v); }

/**
 * Creates a style attribute with a alignItems property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function alignItems(v) { return new CssProp("alignItems", v); }

/**
 * Creates a style attribute with a alignSelf property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function alignSelf(v) { return new CssProp("alignSelf", v); }

/**
 * Creates a style attribute with a alignmentBaseline property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function alignmentBaseline(v) { return new CssProp("alignmentBaseline", v); }

/**
 * Creates a style attribute with a all property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function all(v) { return new CssProp("all", v); }

/**
 * Creates a style attribute with a animation property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function animation(v) { return new CssProp("animation", v); }

/**
 * Creates a style attribute with a animationDelay property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function animationDelay(v) { return new CssProp("animationDelay", v); }

/**
 * Creates a style attribute with a animationDirection property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function animationDirection(v) { return new CssProp("animationDirection", v); }

/**
 * Creates a style attribute with a animationDuration property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function animationDuration(v) { return new CssProp("animationDuration", v); }

/**
 * Creates a style attribute with a animationFillMode property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function animationFillMode(v) { return new CssProp("animationFillMode", v); }

/**
 * Creates a style attribute with a animationIterationCount property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function animationIterationCount(v) { return new CssProp("animationIterationCount", v); }

/**
 * Creates a style attribute with a animationName property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function animationName(v) { return new CssProp("animationName", v); }

/**
 * Creates a style attribute with a animationPlayState property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function animationPlayState(v) { return new CssProp("animationPlayState", v); }

/**
 * Creates a style attribute with a animationTimingFunction property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function animationTimingFunction(v) { return new CssProp("animationTimingFunction", v); }

/**
 * Creates a style attribute with a appearance property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function appearance(v) { return new CssProp("appearance", v); }

/**
 * Creates a style attribute with a backdropFilter property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function backdropFilter(v) { return new CssProp("backdropFilter", v); }

/**
 * Creates a style attribute with a backfaceVisibility property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function backfaceVisibility(v) { return new CssProp("backfaceVisibility", v); }

/**
 * Creates a style attribute with a background property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function background(v) { return new CssProp("background", v); }

/**
 * Creates a style attribute with a backgroundAttachment property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function backgroundAttachment(v) { return new CssProp("backgroundAttachment", v); }

/**
 * Creates a style attribute with a backgroundBlendMode property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function backgroundBlendMode(v) { return new CssProp("backgroundBlendMode", v); }

/**
 * Creates a style attribute with a backgroundClip property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function backgroundClip(v) { return new CssProp("backgroundClip", v); }

/**
 * Creates a style attribute with a backgroundColor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function backgroundColor(v) { return new CssProp("backgroundColor", v); }

/**
 * Creates a style attribute with a backgroundImage property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function backgroundImage(v) { return new CssProp("backgroundImage", v); }

/**
 * Creates a style attribute with a backgroundOrigin property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function backgroundOrigin(v) { return new CssProp("backgroundOrigin", v); }

/**
 * Creates a style attribute with a backgroundPosition property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function backgroundPosition(v) { return new CssProp("backgroundPosition", v); }

/**
 * Creates a style attribute with a backgroundPositionX property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function backgroundPositionX(v) { return new CssProp("backgroundPositionX", v); }

/**
 * Creates a style attribute with a backgroundPositionY property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function backgroundPositionY(v) { return new CssProp("backgroundPositionY", v); }

/**
 * Creates a style attribute with a backgroundRepeat property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function backgroundRepeat(v) { return new CssProp("backgroundRepeat", v); }

/**
 * Creates a style attribute with a backgroundRepeatX property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function backgroundRepeatX(v) { return new CssProp("backgroundRepeatX", v); }

/**
 * Creates a style attribute with a backgroundRepeatY property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function backgroundRepeatY(v) { return new CssProp("backgroundRepeatY", v); }

/**
 * Creates a style attribute with a backgroundSize property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function backgroundSize(v) { return new CssProp("backgroundSize", v); }

/**
 * Creates a style attribute with a baselineShift property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function baselineShift(v) { return new CssProp("baselineShift", v); }

/**
 * Creates a style attribute with a blockSize property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function blockSize(v) { return new CssProp("blockSize", v); }

/**
 * Creates a style attribute with a border property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function border(v) { return new CssProp("border", v); }

/**
 * Creates a style attribute with a borderBlockEnd property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderBlockEnd(v) { return new CssProp("borderBlockEnd", v); }

/**
 * Creates a style attribute with a borderBlockEndColor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderBlockEndColor(v) { return new CssProp("borderBlockEndColor", v); }

/**
 * Creates a style attribute with a borderBlockEndStyle property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderBlockEndStyle(v) { return new CssProp("borderBlockEndStyle", v); }

/**
 * Creates a style attribute with a borderBlockEndWidth property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderBlockEndWidth(v) { return new CssProp("borderBlockEndWidth", v); }

/**
 * Creates a style attribute with a borderBlockStart property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderBlockStart(v) { return new CssProp("borderBlockStart", v); }

/**
 * Creates a style attribute with a borderBlockStartColor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderBlockStartColor(v) { return new CssProp("borderBlockStartColor", v); }

/**
 * Creates a style attribute with a borderBlockStartStyle property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderBlockStartStyle(v) { return new CssProp("borderBlockStartStyle", v); }

/**
 * Creates a style attribute with a borderBlockStartWidth property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderBlockStartWidth(v) { return new CssProp("borderBlockStartWidth", v); }

/**
 * Creates a style attribute with a borderBottom property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderBottom(v) { return new CssProp("borderBottom", v); }

/**
 * Creates a style attribute with a borderBottomColor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderBottomColor(v) { return new CssProp("borderBottomColor", v); }

/**
 * Creates a style attribute with a borderBottomLeftRadius property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderBottomLeftRadius(v) { return new CssProp("borderBottomLeftRadius", v); }

/**
 * Creates a style attribute with a borderBottomRightRadius property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderBottomRightRadius(v) { return new CssProp("borderBottomRightRadius", v); }

/**
 * Creates a style attribute with a borderBottomStyle property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderBottomStyle(v) { return new CssProp("borderBottomStyle", v); }

/**
 * Creates a style attribute with a borderBottomWidth property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderBottomWidth(v) { return new CssProp("borderBottomWidth", v); }

/**
 * Creates a style attribute with a borderCollapse property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderCollapse(v) { return new CssProp("borderCollapse", v); }

/**
 * Creates a style attribute with a borderColor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderColor(v) { return new CssProp("borderColor", v); }

/**
 * Creates a style attribute with a borderImage property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderImage(v) { return new CssProp("borderImage", v); }

/**
 * Creates a style attribute with a borderImageOutset property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderImageOutset(v) { return new CssProp("borderImageOutset", v); }

/**
 * Creates a style attribute with a borderImageRepeat property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderImageRepeat(v) { return new CssProp("borderImageRepeat", v); }

/**
 * Creates a style attribute with a borderImageSlice property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderImageSlice(v) { return new CssProp("borderImageSlice", v); }

/**
 * Creates a style attribute with a borderImageSource property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderImageSource(v) { return new CssProp("borderImageSource", v); }

/**
 * Creates a style attribute with a borderImageWidth property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderImageWidth(v) { return new CssProp("borderImageWidth", v); }

/**
 * Creates a style attribute with a borderInlineEnd property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderInlineEnd(v) { return new CssProp("borderInlineEnd", v); }

/**
 * Creates a style attribute with a borderInlineEndColor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderInlineEndColor(v) { return new CssProp("borderInlineEndColor", v); }

/**
 * Creates a style attribute with a borderInlineEndStyle property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderInlineEndStyle(v) { return new CssProp("borderInlineEndStyle", v); }

/**
 * Creates a style attribute with a borderInlineEndWidth property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderInlineEndWidth(v) { return new CssProp("borderInlineEndWidth", v); }

/**
 * Creates a style attribute with a borderInlineStart property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderInlineStart(v) { return new CssProp("borderInlineStart", v); }

/**
 * Creates a style attribute with a borderInlineStartColor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderInlineStartColor(v) { return new CssProp("borderInlineStartColor", v); }

/**
 * Creates a style attribute with a borderInlineStartStyle property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderInlineStartStyle(v) { return new CssProp("borderInlineStartStyle", v); }

/**
 * Creates a style attribute with a borderInlineStartWidth property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderInlineStartWidth(v) { return new CssProp("borderInlineStartWidth", v); }

/**
 * Creates a style attribute with a borderLeft property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderLeft(v) { return new CssProp("borderLeft", v); }

/**
 * Creates a style attribute with a borderLeftColor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderLeftColor(v) { return new CssProp("borderLeftColor", v); }

/**
 * Creates a style attribute with a borderLeftStyle property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderLeftStyle(v) { return new CssProp("borderLeftStyle", v); }

/**
 * Creates a style attribute with a borderLeftWidth property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderLeftWidth(v) { return new CssProp("borderLeftWidth", v); }

/**
 * Creates a style attribute with a borderRadius property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderRadius(v) { return new CssProp("borderRadius", v); }

/**
 * Creates a style attribute with a borderRight property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderRight(v) { return new CssProp("borderRight", v); }

/**
 * Creates a style attribute with a borderRightColor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderRightColor(v) { return new CssProp("borderRightColor", v); }

/**
 * Creates a style attribute with a borderRightStyle property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderRightStyle(v) { return new CssProp("borderRightStyle", v); }

/**
 * Creates a style attribute with a borderRightWidth property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderRightWidth(v) { return new CssProp("borderRightWidth", v); }

/**
 * Creates a style attribute with a borderSpacing property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderSpacing(v) { return new CssProp("borderSpacing", v); }

/**
 * Creates a style attribute with a borderStyle property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderStyle(v) { return new CssProp("borderStyle", v); }

/**
 * Creates a style attribute with a borderTop property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderTop(v) { return new CssProp("borderTop", v); }

/**
 * Creates a style attribute with a borderTopColor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderTopColor(v) { return new CssProp("borderTopColor", v); }

/**
 * Creates a style attribute with a borderTopLeftRadius property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderTopLeftRadius(v) { return new CssProp("borderTopLeftRadius", v); }

/**
 * Creates a style attribute with a borderTopRightRadius property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderTopRightRadius(v) { return new CssProp("borderTopRightRadius", v); }

/**
 * Creates a style attribute with a borderTopStyle property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderTopStyle(v) { return new CssProp("borderTopStyle", v); }

/**
 * Creates a style attribute with a borderTopWidth property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderTopWidth(v) { return new CssProp("borderTopWidth", v); }

/**
 * Creates a style attribute with a borderWidth property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function borderWidth(v) { return new CssProp("borderWidth", v); }

/**
 * Creates a style attribute with a bottom property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function bottom(v) { return new CssProp("bottom", v); }

/**
 * Creates a style attribute with a boxShadow property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function boxShadow(v) { return new CssProp("boxShadow", v); }

/**
 * Creates a style attribute with a boxSizing property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function boxSizing(v) { return new CssProp("boxSizing", v); }

/**
 * Creates a style attribute with a breakAfter property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function breakAfter(v) { return new CssProp("breakAfter", v); }

/**
 * Creates a style attribute with a breakBefore property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function breakBefore(v) { return new CssProp("breakBefore", v); }

/**
 * Creates a style attribute with a breakInside property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function breakInside(v) { return new CssProp("breakInside", v); }

/**
 * Creates a style attribute with a bufferedRendering property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function bufferedRendering(v) { return new CssProp("bufferedRendering", v); }

/**
 * Creates a style attribute with a captionSide property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function captionSide(v) { return new CssProp("captionSide", v); }

/**
 * Creates a style attribute with a caretColor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function caretColor(v) { return new CssProp("caretColor", v); }

/**
 * Creates a style attribute with a clear property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function clear(v) { return new CssProp("clear", v); }

/**
 * Creates a style attribute with a clip property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function clip(v) { return new CssProp("clip", v); }

/**
 * Creates a style attribute with a clipPath property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function clipPath(v) { return new CssProp("clipPath", v); }

/**
 * Creates a style attribute with a clipRule property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function clipRule(v) { return new CssProp("clipRule", v); }

/**
 * Creates a style attribute with a color property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function color(v) { return new CssProp("color", v); }

/**
 * Creates a style attribute with a colorInterpolation property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function colorInterpolation(v) { return new CssProp("colorInterpolation", v); }

/**
 * Creates a style attribute with a colorInterpolationFilters property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function colorInterpolationFilters(v) { return new CssProp("colorInterpolationFilters", v); }

/**
 * Creates a style attribute with a colorRendering property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function colorRendering(v) { return new CssProp("colorRendering", v); }

/**
 * Creates a style attribute with a colorScheme property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function colorScheme(v) { return new CssProp("colorScheme", v); }

/**
 * Creates a style attribute with a columnCount property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function columnCount(v) { return new CssProp("columnCount", v); }

/**
 * Creates a style attribute with a columnFill property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function columnFill(v) { return new CssProp("columnFill", v); }

/**
 * Creates a style attribute with a columnGap property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function columnGap(v) { return new CssProp("columnGap", v); }

/**
 * Creates a style attribute with a columnRule property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function columnRule(v) { return new CssProp("columnRule", v); }

/**
 * Creates a style attribute with a columnRuleColor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function columnRuleColor(v) { return new CssProp("columnRuleColor", v); }

/**
 * Creates a style attribute with a columnRuleStyle property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function columnRuleStyle(v) { return new CssProp("columnRuleStyle", v); }

/**
 * Creates a style attribute with a columnRuleWidth property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function columnRuleWidth(v) { return new CssProp("columnRuleWidth", v); }

/**
 * Creates a style attribute with a columnSpan property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function columnSpan(v) { return new CssProp("columnSpan", v); }

/**
 * Creates a style attribute with a columnWidth property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function columnWidth(v) { return new CssProp("columnWidth", v); }

/**
 * Creates a style attribute with a columns property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function columns(v) { return new CssProp("columns", v); }

/**
 * Creates a style attribute with a contain property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function contain(v) { return new CssProp("contain", v); }

/**
 * Creates a style attribute with a containIntrinsicSize property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function containIntrinsicSize(v) { return new CssProp("containIntrinsicSize", v); }

/**
 * Creates a style attribute with a content property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function content(v) { return new CssProp("content", v); }

/**
 * Creates a style attribute with a counterIncrement property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function counterIncrement(v) { return new CssProp("counterIncrement", v); }

/**
 * Creates a style attribute with a counterReset property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function counterReset(v) { return new CssProp("counterReset", v); }

/**
 * Creates a style attribute with a cursor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function cursor(v) { return new CssProp("cursor", v); }

/**
 * Creates a style attribute with a cx property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function cx(v) { return new CssProp("cx", v); }

/**
 * Creates a style attribute with a cy property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function cy(v) { return new CssProp("cy", v); }

/**
 * Creates a style attribute with a d property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function d(v) { return new CssProp("d", v); }

/**
 * Creates a style attribute with a direction property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function direction(v) { return new CssProp("direction", v); }

/**
 * Creates a style attribute with a display property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function display(v) { return new CssProp("display", v); }

/**
 * Creates a style attribute with a dominantBaseline property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function dominantBaseline(v) { return new CssProp("dominantBaseline", v); }

/**
 * Creates a style attribute with a emptyCells property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function emptyCells(v) { return new CssProp("emptyCells", v); }

/**
 * Creates a style attribute with a fill property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function fill(v) { return new CssProp("fill", v); }

/**
 * Creates a style attribute with a fillOpacity property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function fillOpacity(v) { return new CssProp("fillOpacity", v); }

/**
 * Creates a style attribute with a fillRule property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function fillRule(v) { return new CssProp("fillRule", v); }

/**
 * Creates a style attribute with a filter property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function filter(v) { return new CssProp("filter", v); }

/**
 * Creates a style attribute with a flex property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function flex(v) { return new CssProp("flex", v); }

/**
 * Creates a style attribute with a flexBasis property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function flexBasis(v) { return new CssProp("flexBasis", v); }

/**
 * Creates a style attribute with a flexDirection property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function flexDirection(v) { return new CssProp("flexDirection", v); }

/**
 * Creates a style attribute with a flexFlow property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function flexFlow(v) { return new CssProp("flexFlow", v); }

/**
 * Creates a style attribute with a flexGrow property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function flexGrow(v) { return new CssProp("flexGrow", v); }

/**
 * Creates a style attribute with a flexShrink property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function flexShrink(v) { return new CssProp("flexShrink", v); }

/**
 * Creates a style attribute with a flexWrap property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function flexWrap(v) { return new CssProp("flexWrap", v); }

/**
 * Creates a style attribute with a float property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function float(v) { return new CssProp("float", v); }

/**
 * Creates a style attribute with a floodColor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function floodColor(v) { return new CssProp("floodColor", v); }

/**
 * Creates a style attribute with a floodOpacity property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function floodOpacity(v) { return new CssProp("floodOpacity", v); }

/**
 * Creates a style attribute with a font property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function font(v) { return new CssProp("font", v); }

/**
 * Creates a style attribute with a fontDisplay property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function fontDisplay(v) { return new CssProp("fontDisplay", v); }

/**
 * Creates a style attribute with a fontFamily property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function fontFamily(v) { return new CssProp("fontFamily", v); }

/**
 * Creates a style attribute with a fontFeatureSettings property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function fontFeatureSettings(v) { return new CssProp("fontFeatureSettings", v); }

/**
 * Creates a style attribute with a fontKerning property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function fontKerning(v) { return new CssProp("fontKerning", v); }

/**
 * Creates a style attribute with a fontOpticalSizing property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function fontOpticalSizing(v) { return new CssProp("fontOpticalSizing", v); }

/**
 * Creates a style attribute with a fontSize property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function fontSize(v) { return new CssProp("fontSize", v); }

/**
 * Creates a style attribute with a fontStretch property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function fontStretch(v) { return new CssProp("fontStretch", v); }

/**
 * Creates a style attribute with a fontStyle property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function fontStyle(v) { return new CssProp("fontStyle", v); }

/**
 * Creates a style attribute with a fontVariant property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function fontVariant(v) { return new CssProp("fontVariant", v); }

/**
 * Creates a style attribute with a fontVariantCaps property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function fontVariantCaps(v) { return new CssProp("fontVariantCaps", v); }

/**
 * Creates a style attribute with a fontVariantEastAsian property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function fontVariantEastAsian(v) { return new CssProp("fontVariantEastAsian", v); }

/**
 * Creates a style attribute with a fontVariantLigatures property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function fontVariantLigatures(v) { return new CssProp("fontVariantLigatures", v); }

/**
 * Creates a style attribute with a fontVariantNumeric property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function fontVariantNumeric(v) { return new CssProp("fontVariantNumeric", v); }

/**
 * Creates a style attribute with a fontVariationSettings property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function fontVariationSettings(v) { return new CssProp("fontVariationSettings", v); }

/**
 * Creates a style attribute with a fontWeight property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function fontWeight(v) { return new CssProp("fontWeight", v); }

/**
 * Creates a style attribute with a forcedColorAdjust property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function forcedColorAdjust(v) { return new CssProp("forcedColorAdjust", v); }

/**
 * Creates a style attribute with a gap property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function gap(v) { return new CssProp("gap", v); }

/**
 * Creates a style attribute with a grid property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function grid(v) { return new CssProp("grid", v); }

/**
 * Creates a style attribute with a gridArea property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function gridArea(v) { return new CssProp("gridArea", v); }

/**
 * Creates a style attribute with a gridAutoColumns property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function gridAutoColumns(v) { return new CssProp("gridAutoColumns", v); }

/**
 * Creates a style attribute with a gridAutoFlow property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function gridAutoFlow(v) { return new CssProp("gridAutoFlow", v); }

/**
 * Creates a style attribute with a gridAutoRows property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function gridAutoRows(v) { return new CssProp("gridAutoRows", v); }

/**
 * Creates a style attribute with a gridColumn property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function gridColumn(v) { return new CssProp("gridColumn", v); }

/**
 * Creates a style attribute with a gridColumnEnd property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function gridColumnEnd(v) { return new CssProp("gridColumnEnd", v); }

/**
 * Creates a style attribute with a gridColumnGap property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function gridColumnGap(v) { return new CssProp("gridColumnGap", v); }

/**
 * Creates a style attribute with a gridColumnStart property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function gridColumnStart(v) { return new CssProp("gridColumnStart", v); }

/**
 * Creates a style attribute with a gridGap property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function gridGap(v) { return new CssProp("gridGap", v); }

/**
 * Creates a style attribute with a gridRow property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function gridRow(v) { return new CssProp("gridRow", v); }

/**
 * Creates a style attribute with a gridRowEnd property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function gridRowEnd(v) { return new CssProp("gridRowEnd", v); }

/**
 * Creates a style attribute with a gridRowGap property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function gridRowGap(v) { return new CssProp("gridRowGap", v); }

/**
 * Creates a style attribute with a gridRowStart property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function gridRowStart(v) { return new CssProp("gridRowStart", v); }

/**
 * Creates a style attribute with a gridTemplate property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function gridTemplate(v) { return new CssProp("gridTemplate", v); }

/**
 * Creates a style attribute with a gridTemplateAreas property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function gridTemplateAreas(v) { return new CssProp("gridTemplateAreas", v); }

/**
 * Creates a style attribute with a gridTemplateColumns property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function gridTemplateColumns(v) { return new CssProp("gridTemplateColumns", v); }

/**
 * Creates a style attribute with a gridTemplateRows property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function gridTemplateRows(v) { return new CssProp("gridTemplateRows", v); }

/**
 * Creates a style attribute with a height property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function cssHeight(v) { return new CssProp("height", v); }

/**
 * Creates a style attribute with a hyphens property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function hyphens(v) { return new CssProp("hyphens", v); }

/**
 * Creates a style attribute with a imageOrientation property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function imageOrientation(v) { return new CssProp("imageOrientation", v); }

/**
 * Creates a style attribute with a imageRendering property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function imageRendering(v) { return new CssProp("imageRendering", v); }

/**
 * Creates a style attribute with a inlineSize property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function inlineSize(v) { return new CssProp("inlineSize", v); }

/**
 * Creates a style attribute with a isolation property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function isolation(v) { return new CssProp("isolation", v); }

/**
 * Creates a style attribute with a justifyContent property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function justifyContent(v) { return new CssProp("justifyContent", v); }

/**
 * Creates a style attribute with a justifyItems property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function justifyItems(v) { return new CssProp("justifyItems", v); }

/**
 * Creates a style attribute with a justifySelf property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function justifySelf(v) { return new CssProp("justifySelf", v); }

/**
 * Creates a style attribute with a left property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function left(v) { return new CssProp("left", v); }

/**
 * Creates a style attribute with a letterSpacing property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function letterSpacing(v) { return new CssProp("letterSpacing", v); }

/**
 * Creates a style attribute with a lightingColor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function lightingColor(v) { return new CssProp("lightingColor", v); }

/**
 * Creates a style attribute with a lineBreak property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function lineBreak(v) { return new CssProp("lineBreak", v); }

/**
 * Creates a style attribute with a lineHeight property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function lineHeight(v) { return new CssProp("lineHeight", v); }

/**
 * Creates a style attribute with a listStyle property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function listStyle(v) { return new CssProp("listStyle", v); }

/**
 * Creates a style attribute with a listStyleImage property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function listStyleImage(v) { return new CssProp("listStyleImage", v); }

/**
 * Creates a style attribute with a listStylePosition property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function listStylePosition(v) { return new CssProp("listStylePosition", v); }

/**
 * Creates a style attribute with a listStyleType property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function listStyleType(v) { return new CssProp("listStyleType", v); }

/**
 * Creates a style attribute with a margin property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function margin(v) { return new CssProp("margin", v); }

/**
 * Creates a style attribute with a marginBlockEnd property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function marginBlockEnd(v) { return new CssProp("marginBlockEnd", v); }

/**
 * Creates a style attribute with a marginBlockStart property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function marginBlockStart(v) { return new CssProp("marginBlockStart", v); }

/**
 * Creates a style attribute with a marginBottom property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function marginBottom(v) { return new CssProp("marginBottom", v); }

/**
 * Creates a style attribute with a marginInlineEnd property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function marginInlineEnd(v) { return new CssProp("marginInlineEnd", v); }

/**
 * Creates a style attribute with a marginInlineStart property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function marginInlineStart(v) { return new CssProp("marginInlineStart", v); }

/**
 * Creates a style attribute with a marginLeft property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function marginLeft(v) { return new CssProp("marginLeft", v); }

/**
 * Creates a style attribute with a marginRight property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function marginRight(v) { return new CssProp("marginRight", v); }

/**
 * Creates a style attribute with a marginTop property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function marginTop(v) { return new CssProp("marginTop", v); }

/**
 * Creates a style attribute with a marker property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function marker(v) { return new CssProp("marker", v); }

/**
 * Creates a style attribute with a markerEnd property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function markerEnd(v) { return new CssProp("markerEnd", v); }

/**
 * Creates a style attribute with a markerMid property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function markerMid(v) { return new CssProp("markerMid", v); }

/**
 * Creates a style attribute with a markerStart property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function markerStart(v) { return new CssProp("markerStart", v); }

/**
 * Creates a style attribute with a mask property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function mask(v) { return new CssProp("mask", v); }

/**
 * Creates a style attribute with a maskType property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function maskType(v) { return new CssProp("maskType", v); }

/**
 * Creates a style attribute with a maxBlockSize property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function maxBlockSize(v) { return new CssProp("maxBlockSize", v); }

/**
 * Creates a style attribute with a maxHeight property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function maxHeight(v) { return new CssProp("maxHeight", v); }

/**
 * Creates a style attribute with a maxInlineSize property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function maxInlineSize(v) { return new CssProp("maxInlineSize", v); }

/**
 * Creates a style attribute with a maxWidth property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function maxWidth(v) { return new CssProp("maxWidth", v); }

/**
 * Creates a style attribute with a maxZoom property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function maxZoom(v) { return new CssProp("maxZoom", v); }

/**
 * Creates a style attribute with a minBlockSize property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function minBlockSize(v) { return new CssProp("minBlockSize", v); }

/**
 * Creates a style attribute with a minHeight property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function minHeight(v) { return new CssProp("minHeight", v); }

/**
 * Creates a style attribute with a minInlineSize property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function minInlineSize(v) { return new CssProp("minInlineSize", v); }

/**
 * Creates a style attribute with a minWidth property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function minWidth(v) { return new CssProp("minWidth", v); }

/**
 * Creates a style attribute with a minZoom property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function minZoom(v) { return new CssProp("minZoom", v); }

/**
 * Creates a style attribute with a mixBlendMode property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function mixBlendMode(v) { return new CssProp("mixBlendMode", v); }

/**
 * Creates a style attribute with a objectFit property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function objectFit(v) { return new CssProp("objectFit", v); }

/**
 * Creates a style attribute with a objectPosition property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function objectPosition(v) { return new CssProp("objectPosition", v); }

/**
 * Creates a style attribute with a offset property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function offset(v) { return new CssProp("offset", v); }

/**
 * Creates a style attribute with a offsetDistance property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function offsetDistance(v) { return new CssProp("offsetDistance", v); }

/**
 * Creates a style attribute with a offsetPath property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function offsetPath(v) { return new CssProp("offsetPath", v); }

/**
 * Creates a style attribute with a offsetRotate property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function offsetRotate(v) { return new CssProp("offsetRotate", v); }

/**
 * Creates a style attribute with a opacity property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function opacity(v) { return new CssProp("opacity", v); }

/**
 * Creates a style attribute with a order property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function order(v) { return new CssProp("order", v); }

/**
 * Creates a style attribute with a orientation property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function orientation(v) { return new CssProp("orientation", v); }

/**
 * Creates a style attribute with a orphans property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function orphans(v) { return new CssProp("orphans", v); }

/**
 * Creates a style attribute with a outline property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function outline(v) { return new CssProp("outline", v); }

/**
 * Creates a style attribute with a outlineColor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function outlineColor(v) { return new CssProp("outlineColor", v); }

/**
 * Creates a style attribute with a outlineOffset property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function outlineOffset(v) { return new CssProp("outlineOffset", v); }

/**
 * Creates a style attribute with a outlineStyle property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function outlineStyle(v) { return new CssProp("outlineStyle", v); }

/**
 * Creates a style attribute with a outlineWidth property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function outlineWidth(v) { return new CssProp("outlineWidth", v); }

/**
 * Creates a style attribute with a overflow property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function overflow(v) { return new CssProp("overflow", v); }

/**
 * Creates a style attribute with a overflowAnchor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function overflowAnchor(v) { return new CssProp("overflowAnchor", v); }

/**
 * Creates a style attribute with a overflowWrap property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function overflowWrap(v) { return new CssProp("overflowWrap", v); }

/**
 * Creates a style attribute with a overflowX property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function overflowX(v) { return new CssProp("overflowX", v); }

/**
 * Creates a style attribute with a overflowY property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function overflowY(v) { return new CssProp("overflowY", v); }

/**
 * Creates a style attribute with a overscrollBehavior property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function overscrollBehavior(v) { return new CssProp("overscrollBehavior", v); }

/**
 * Creates a style attribute with a overscrollBehaviorBlock property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function overscrollBehaviorBlock(v) { return new CssProp("overscrollBehaviorBlock", v); }

/**
 * Creates a style attribute with a overscrollBehaviorInline property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function overscrollBehaviorInline(v) { return new CssProp("overscrollBehaviorInline", v); }

/**
 * Creates a style attribute with a overscrollBehaviorX property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function overscrollBehaviorX(v) { return new CssProp("overscrollBehaviorX", v); }

/**
 * Creates a style attribute with a overscrollBehaviorY property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function overscrollBehaviorY(v) { return new CssProp("overscrollBehaviorY", v); }

/**
 * Creates a style attribute with a padding property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function padding(v) { return new CssProp("padding", v); }

/**
 * Creates a style attribute with a paddingBlockEnd property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function paddingBlockEnd(v) { return new CssProp("paddingBlockEnd", v); }

/**
 * Creates a style attribute with a paddingBlockStart property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function paddingBlockStart(v) { return new CssProp("paddingBlockStart", v); }

/**
 * Creates a style attribute with a paddingBottom property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function paddingBottom(v) { return new CssProp("paddingBottom", v); }

/**
 * Creates a style attribute with a paddingInlineEnd property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function paddingInlineEnd(v) { return new CssProp("paddingInlineEnd", v); }

/**
 * Creates a style attribute with a paddingInlineStart property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function paddingInlineStart(v) { return new CssProp("paddingInlineStart", v); }

/**
 * Creates a style attribute with a paddingLeft property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function paddingLeft(v) { return new CssProp("paddingLeft", v); }

/**
 * Creates a style attribute with a paddingRight property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function paddingRight(v) { return new CssProp("paddingRight", v); }

/**
 * Creates a style attribute with a paddingTop property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function paddingTop(v) { return new CssProp("paddingTop", v); }

/**
 * Creates a style attribute with a pageBreakAfter property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function pageBreakAfter(v) { return new CssProp("pageBreakAfter", v); }

/**
 * Creates a style attribute with a pageBreakBefore property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function pageBreakBefore(v) { return new CssProp("pageBreakBefore", v); }

/**
 * Creates a style attribute with a pageBreakInside property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function pageBreakInside(v) { return new CssProp("pageBreakInside", v); }

/**
 * Creates a style attribute with a paintOrder property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function paintOrder(v) { return new CssProp("paintOrder", v); }

/**
 * Creates a style attribute with a perspective property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function perspective(v) { return new CssProp("perspective", v); }

/**
 * Creates a style attribute with a perspectiveOrigin property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function perspectiveOrigin(v) { return new CssProp("perspectiveOrigin", v); }

/**
 * Creates a style attribute with a placeContent property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function placeContent(v) { return new CssProp("placeContent", v); }

/**
 * Creates a style attribute with a placeItems property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function placeItems(v) { return new CssProp("placeItems", v); }

/**
 * Creates a style attribute with a placeSelf property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function placeSelf(v) { return new CssProp("placeSelf", v); }

/**
 * Creates a style attribute with a pointerEvents property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function pointerEvents(v) { return new CssProp("pointerEvents", v); }

/**
 * Creates a style attribute with a position property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function position(v) { return new CssProp("position", v); }

/**
 * Creates a style attribute with a quotes property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function quotes(v) { return new CssProp("quotes", v); }

/**
 * Creates a style attribute with a r property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function r(v) { return new CssProp("r", v); }

/**
 * Creates a style attribute with a resize property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function resize(v) { return new CssProp("resize", v); }

/**
 * Creates a style attribute with a right property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function right(v) { return new CssProp("right", v); }

/**
 * Creates a style attribute with a rowGap property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function rowGap(v) { return new CssProp("rowGap", v); }

/**
 * Creates a style attribute with a rubyPosition property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function rubyPosition(v) { return new CssProp("rubyPosition", v); }

/**
 * Creates a style attribute with a rx property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function rx(v) { return new CssProp("rx", v); }

/**
 * Creates a style attribute with a ry property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function ry(v) { return new CssProp("ry", v); }

/**
 * Creates a style attribute with a scrollBehavior property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollBehavior(v) { return new CssProp("scrollBehavior", v); }

/**
 * Creates a style attribute with a scrollMargin property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollMargin(v) { return new CssProp("scrollMargin", v); }

/**
 * Creates a style attribute with a scrollMarginBlock property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollMarginBlock(v) { return new CssProp("scrollMarginBlock", v); }

/**
 * Creates a style attribute with a scrollMarginBlockEnd property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollMarginBlockEnd(v) { return new CssProp("scrollMarginBlockEnd", v); }

/**
 * Creates a style attribute with a scrollMarginBlockStart property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollMarginBlockStart(v) { return new CssProp("scrollMarginBlockStart", v); }

/**
 * Creates a style attribute with a scrollMarginBottom property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollMarginBottom(v) { return new CssProp("scrollMarginBottom", v); }

/**
 * Creates a style attribute with a scrollMarginInline property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollMarginInline(v) { return new CssProp("scrollMarginInline", v); }

/**
 * Creates a style attribute with a scrollMarginInlineEnd property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollMarginInlineEnd(v) { return new CssProp("scrollMarginInlineEnd", v); }

/**
 * Creates a style attribute with a scrollMarginInlineStart property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollMarginInlineStart(v) { return new CssProp("scrollMarginInlineStart", v); }

/**
 * Creates a style attribute with a scrollMarginLeft property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollMarginLeft(v) { return new CssProp("scrollMarginLeft", v); }

/**
 * Creates a style attribute with a scrollMarginRight property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollMarginRight(v) { return new CssProp("scrollMarginRight", v); }

/**
 * Creates a style attribute with a scrollMarginTop property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollMarginTop(v) { return new CssProp("scrollMarginTop", v); }

/**
 * Creates a style attribute with a scrollPadding property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollPadding(v) { return new CssProp("scrollPadding", v); }

/**
 * Creates a style attribute with a scrollPaddingBlock property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollPaddingBlock(v) { return new CssProp("scrollPaddingBlock", v); }

/**
 * Creates a style attribute with a scrollPaddingBlockEnd property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollPaddingBlockEnd(v) { return new CssProp("scrollPaddingBlockEnd", v); }

/**
 * Creates a style attribute with a scrollPaddingBlockStart property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollPaddingBlockStart(v) { return new CssProp("scrollPaddingBlockStart", v); }

/**
 * Creates a style attribute with a scrollPaddingBottom property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollPaddingBottom(v) { return new CssProp("scrollPaddingBottom", v); }

/**
 * Creates a style attribute with a scrollPaddingInline property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollPaddingInline(v) { return new CssProp("scrollPaddingInline", v); }

/**
 * Creates a style attribute with a scrollPaddingInlineEnd property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollPaddingInlineEnd(v) { return new CssProp("scrollPaddingInlineEnd", v); }

/**
 * Creates a style attribute with a scrollPaddingInlineStart property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollPaddingInlineStart(v) { return new CssProp("scrollPaddingInlineStart", v); }

/**
 * Creates a style attribute with a scrollPaddingLeft property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollPaddingLeft(v) { return new CssProp("scrollPaddingLeft", v); }

/**
 * Creates a style attribute with a scrollPaddingRight property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollPaddingRight(v) { return new CssProp("scrollPaddingRight", v); }

/**
 * Creates a style attribute with a scrollPaddingTop property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollPaddingTop(v) { return new CssProp("scrollPaddingTop", v); }

/**
 * Creates a style attribute with a scrollSnapAlign property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollSnapAlign(v) { return new CssProp("scrollSnapAlign", v); }

/**
 * Creates a style attribute with a scrollSnapStop property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollSnapStop(v) { return new CssProp("scrollSnapStop", v); }

/**
 * Creates a style attribute with a scrollSnapType property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function scrollSnapType(v) { return new CssProp("scrollSnapType", v); }

/**
 * Creates a style attribute with a shapeImageThreshold property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function shapeImageThreshold(v) { return new CssProp("shapeImageThreshold", v); }

/**
 * Creates a style attribute with a shapeMargin property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function shapeMargin(v) { return new CssProp("shapeMargin", v); }

/**
 * Creates a style attribute with a shapeOutside property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function shapeOutside(v) { return new CssProp("shapeOutside", v); }

/**
 * Creates a style attribute with a shapeRendering property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function shapeRendering(v) { return new CssProp("shapeRendering", v); }

/**
 * Creates a style attribute with a size property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function size(v) { return new CssProp("size", v); }

/**
 * Creates a style attribute with a speak property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function speak(v) { return new CssProp("speak", v); }

/**
 * Creates a style attribute with a src property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function src(v) { return new CssProp("src", v); }

/**
 * Creates a style attribute with a stopColor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function stopColor(v) { return new CssProp("stopColor", v); }

/**
 * Creates a style attribute with a stopOpacity property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function stopOpacity(v) { return new CssProp("stopOpacity", v); }

/**
 * Creates a style attribute with a stroke property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function stroke(v) { return new CssProp("stroke", v); }

/**
 * Creates a style attribute with a strokeDasharray property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function strokeDasharray(v) { return new CssProp("strokeDasharray", v); }

/**
 * Creates a style attribute with a strokeDashoffset property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function strokeDashoffset(v) { return new CssProp("strokeDashoffset", v); }

/**
 * Creates a style attribute with a strokeLinecap property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function strokeLinecap(v) { return new CssProp("strokeLinecap", v); }

/**
 * Creates a style attribute with a strokeLinejoin property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function strokeLinejoin(v) { return new CssProp("strokeLinejoin", v); }

/**
 * Creates a style attribute with a strokeMiterlimit property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function strokeMiterlimit(v) { return new CssProp("strokeMiterlimit", v); }

/**
 * Creates a style attribute with a strokeOpacity property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function strokeOpacity(v) { return new CssProp("strokeOpacity", v); }

/**
 * Creates a style attribute with a strokeWidth property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function strokeWidth(v) { return new CssProp("strokeWidth", v); }

/**
 * Creates a style attribute with a tabSize property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function tabSize(v) { return new CssProp("tabSize", v); }

/**
 * Creates a style attribute with a tableLayout property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function tableLayout(v) { return new CssProp("tableLayout", v); }

/**
 * Creates a style attribute with a textAlign property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function textAlign(v) { return new CssProp("textAlign", v); }

/**
 * Creates a style attribute with a textAlignLast property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function textAlignLast(v) { return new CssProp("textAlignLast", v); }

/**
 * Creates a style attribute with a textAnchor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function textAnchor(v) { return new CssProp("textAnchor", v); }

/**
 * Creates a style attribute with a textCombineUpright property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function textCombineUpright(v) { return new CssProp("textCombineUpright", v); }

/**
 * Creates a style attribute with a textDecoration property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function textDecoration(v) { return new CssProp("textDecoration", v); }

/**
 * Creates a style attribute with a textDecorationColor property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function textDecorationColor(v) { return new CssProp("textDecorationColor", v); }

/**
 * Creates a style attribute with a textDecorationLine property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function textDecorationLine(v) { return new CssProp("textDecorationLine", v); }

/**
 * Creates a style attribute with a textDecorationSkipInk property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function textDecorationSkipInk(v) { return new CssProp("textDecorationSkipInk", v); }

/**
 * Creates a style attribute with a textDecorationStyle property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function textDecorationStyle(v) { return new CssProp("textDecorationStyle", v); }

/**
 * Creates a style attribute with a textIndent property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function textIndent(v) { return new CssProp("textIndent", v); }

/**
 * Creates a style attribute with a textOrientation property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function textOrientation(v) { return new CssProp("textOrientation", v); }

/**
 * Creates a style attribute with a textOverflow property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function textOverflow(v) { return new CssProp("textOverflow", v); }

/**
 * Creates a style attribute with a textRendering property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function textRendering(v) { return new CssProp("textRendering", v); }

/**
 * Creates a style attribute with a textShadow property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function textShadow(v) { return new CssProp("textShadow", v); }

/**
 * Creates a style attribute with a textSizeAdjust property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function textSizeAdjust(v) { return new CssProp("textSizeAdjust", v); }

/**
 * Creates a style attribute with a textTransform property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function textTransform(v) { return new CssProp("textTransform", v); }

/**
 * Creates a style attribute with a textUnderlinePosition property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function textUnderlinePosition(v) { return new CssProp("textUnderlinePosition", v); }

/**
 * Creates a style attribute with a top property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function top(v) { return new CssProp("top", v); }

/**
 * Creates a style attribute with a touchAction property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function touchAction(v) { return new CssProp("touchAction", v); }

/**
 * Creates a style attribute with a transform property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function transform(v) { return new CssProp("transform", v); }

/**
 * Creates a style attribute with a transformBox property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function transformBox(v) { return new CssProp("transformBox", v); }

/**
 * Creates a style attribute with a transformOrigin property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function transformOrigin(v) { return new CssProp("transformOrigin", v); }

/**
 * Creates a style attribute with a transformStyle property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function transformStyle(v) { return new CssProp("transformStyle", v); }

/**
 * Creates a style attribute with a transition property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function transition(v) { return new CssProp("transition", v); }

/**
 * Creates a style attribute with a transitionDelay property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function transitionDelay(v) { return new CssProp("transitionDelay", v); }

/**
 * Creates a style attribute with a transitionDuration property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function transitionDuration(v) { return new CssProp("transitionDuration", v); }

/**
 * Creates a style attribute with a transitionProperty property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function transitionProperty(v) { return new CssProp("transitionProperty", v); }

/**
 * Creates a style attribute with a transitionTimingFunction property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function transitionTimingFunction(v) { return new CssProp("transitionTimingFunction", v); }

/**
 * Creates a style attribute with a unicodeBidi property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function unicodeBidi(v) { return new CssProp("unicodeBidi", v); }

/**
 * Creates a style attribute with a unicodeRange property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function unicodeRange(v) { return new CssProp("unicodeRange", v); }

/**
 * Creates a style attribute with a userSelect property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function userSelect(v) { return new CssProp("userSelect", v); }

/**
 * Creates a style attribute with a userZoom property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function userZoom(v) { return new CssProp("userZoom", v); }

/**
 * Creates a style attribute with a vectorEffect property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function vectorEffect(v) { return new CssProp("vectorEffect", v); }

/**
 * Creates a style attribute with a verticalAlign property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function verticalAlign(v) { return new CssProp("verticalAlign", v); }

/**
 * Creates a style attribute with a visibility property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function visibility(v) { return new CssProp("visibility", v); }

/**
 * Creates a style attribute with a whiteSpace property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function whiteSpace(v) { return new CssProp("whiteSpace", v); }

/**
 * Creates a style attribute with a widows property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function widows(v) { return new CssProp("widows", v); }

/**
 * Creates a style attribute with a width property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function cssWidth(v) { return new CssProp("width", v); }

/**
 * Creates a style attribute with a willChange property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function willChange(v) { return new CssProp("willChange", v); }

/**
 * Creates a style attribute with a wordBreak property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function wordBreak(v) { return new CssProp("wordBreak", v); }

/**
 * Creates a style attribute with a wordSpacing property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function wordSpacing(v) { return new CssProp("wordSpacing", v); }

/**
 * Creates a style attribute with a wordWrap property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function wordWrap(v) { return new CssProp("wordWrap", v); }

/**
 * Creates a style attribute with a writingMode property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function writingMode(v) { return new CssProp("writingMode", v); }

/**
 * Creates a style attribute with a x property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function x(v) { return new CssProp("x", v); }

/**
 * Creates a style attribute with a y property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function y(v) { return new CssProp("y", v); }

/**
 * Creates a style attribute with a zIndex property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function zIndex(v) { return new CssProp("zIndex", v); }

/**
 * Creates a style attribute with a zoom property.
 * @param {string} v
 * @returns {HtmlAttr}
 **/
export function zoom(v) { return new CssProp("zoom", v); }


// A selection of fonts for preferred monospace rendering.
export const monospaceFonts = "'Droid Sans Mono', 'Consolas', 'Lucida Console', 'Courier New', 'Courier', monospace";
export const monospaceFamily = fontFamily(monospaceFonts);
// A selection of fonts that should match whatever the user's operating system normally uses.
export const systemFonts = "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif";
export const systemFamily = fontFamily(systemFonts);