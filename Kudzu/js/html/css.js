import { isBoolean } from "../typeChecks";
/**
 * A CSS property that will be applied to an element's style attribute.
 **/
export class CssProp {
    /**
     * Creates a new CSS property that will be applied to an element's style attribute.
     * @param key - the property name.
     * @param value - the value to set for the property.
     */
    constructor(key, value) {
        this.key = key;
        this.value = value;
        Object.freeze(this);
    }
    /**
     * Set the attribute value on an HTMLElement
     * @param elem - the element on which to set the attribute.
     */
    apply(elem) {
        elem.style[this.key] = this.value;
    }
}
export class CssPropSet {
    constructor(...rest) {
        this.set = new Map();
        const set = (key, value) => {
            if (value || isBoolean(value)) {
                this.set.set(key, value);
            }
            else if (this.set.has(key)) {
                this.set.delete(key);
            }
        };
        for (const prop of rest) {
            if (prop instanceof CssProp) {
                const { key, value } = prop;
                set(key, value);
            }
            else if (prop instanceof CssPropSet) {
                for (const subProp of prop.set.entries()) {
                    const [key, value] = subProp;
                    set(key, value);
                }
            }
        }
    }
    /**
     * Set the attribute value on an HTMLElement
     * @param elem - the element on which to set the attribute.
     */
    apply(elem) {
        for (const prop of this.set.entries()) {
            const [key, value] = prop;
            elem.style[key] = value;
        }
    }
}
/**
 * Combine style properties.
 **/
export function styles(...rest) {
    return new CssPropSet(...rest);
}
export function alignContent(v) { return new CssProp("alignContent", v); }
export function alignItems(v) { return new CssProp("alignItems", v); }
export function alignSelf(v) { return new CssProp("alignSelf", v); }
export function alignmentBaseline(v) { return new CssProp("alignmentBaseline", v); }
export function all(v) { return new CssProp("all", v); }
export function animation(v) { return new CssProp("animation", v); }
export function animationDelay(v) { return new CssProp("animationDelay", v); }
export function animationDirection(v) { return new CssProp("animationDirection", v); }
export function animationDuration(v) { return new CssProp("animationDuration", v); }
export function animationFillMode(v) { return new CssProp("animationFillMode", v); }
export function animationIterationCount(v) { return new CssProp("animationIterationCount", v); }
export function animationName(v) { return new CssProp("animationName", v); }
export function animationPlayState(v) { return new CssProp("animationPlayState", v); }
export function animationTimingFunction(v) { return new CssProp("animationTimingFunction", v); }
export function appearance(v) { return new CssProp("appearance", v); }
export function backdropFilter(v) { return new CssProp("backdropFilter", v); }
export function backfaceVisibility(v) { return new CssProp("backfaceVisibility", v); }
export function background(v) { return new CssProp("background", v); }
export function backgroundAttachment(v) { return new CssProp("backgroundAttachment", v); }
export function backgroundBlendMode(v) { return new CssProp("backgroundBlendMode", v); }
export function backgroundClip(v) { return new CssProp("backgroundClip", v); }
export function backgroundColor(v) { return new CssProp("backgroundColor", v); }
export function backgroundImage(v) { return new CssProp("backgroundImage", v); }
export function backgroundOrigin(v) { return new CssProp("backgroundOrigin", v); }
export function backgroundPosition(v) { return new CssProp("backgroundPosition", v); }
export function backgroundPositionX(v) { return new CssProp("backgroundPositionX", v); }
export function backgroundPositionY(v) { return new CssProp("backgroundPositionY", v); }
export function backgroundRepeat(v) { return new CssProp("backgroundRepeat", v); }
export function backgroundRepeatX(v) { return new CssProp("backgroundRepeatX", v); }
export function backgroundRepeatY(v) { return new CssProp("backgroundRepeatY", v); }
export function backgroundSize(v) { return new CssProp("backgroundSize", v); }
export function baselineShift(v) { return new CssProp("baselineShift", v); }
export function blockSize(v) { return new CssProp("blockSize", v); }
export function border(v) { return new CssProp("border", v); }
export function borderBlockEnd(v) { return new CssProp("borderBlockEnd", v); }
export function borderBlockEndColor(v) { return new CssProp("borderBlockEndColor", v); }
export function borderBlockEndStyle(v) { return new CssProp("borderBlockEndStyle", v); }
export function borderBlockEndWidth(v) { return new CssProp("borderBlockEndWidth", v); }
export function borderBlockStart(v) { return new CssProp("borderBlockStart", v); }
export function borderBlockStartColor(v) { return new CssProp("borderBlockStartColor", v); }
export function borderBlockStartStyle(v) { return new CssProp("borderBlockStartStyle", v); }
export function borderBlockStartWidth(v) { return new CssProp("borderBlockStartWidth", v); }
export function borderBottom(v) { return new CssProp("borderBottom", v); }
export function borderBottomColor(v) { return new CssProp("borderBottomColor", v); }
export function borderBottomLeftRadius(v) { return new CssProp("borderBottomLeftRadius", v); }
export function borderBottomRightRadius(v) { return new CssProp("borderBottomRightRadius", v); }
export function borderBottomStyle(v) { return new CssProp("borderBottomStyle", v); }
export function borderBottomWidth(v) { return new CssProp("borderBottomWidth", v); }
export function borderCollapse(v) { return new CssProp("borderCollapse", v); }
export function borderColor(v) { return new CssProp("borderColor", v); }
export function borderImage(v) { return new CssProp("borderImage", v); }
export function borderImageOutset(v) { return new CssProp("borderImageOutset", v); }
export function borderImageRepeat(v) { return new CssProp("borderImageRepeat", v); }
export function borderImageSlice(v) { return new CssProp("borderImageSlice", v); }
export function borderImageSource(v) { return new CssProp("borderImageSource", v); }
export function borderImageWidth(v) { return new CssProp("borderImageWidth", v); }
export function borderInlineEnd(v) { return new CssProp("borderInlineEnd", v); }
export function borderInlineEndColor(v) { return new CssProp("borderInlineEndColor", v); }
export function borderInlineEndStyle(v) { return new CssProp("borderInlineEndStyle", v); }
export function borderInlineEndWidth(v) { return new CssProp("borderInlineEndWidth", v); }
export function borderInlineStart(v) { return new CssProp("borderInlineStart", v); }
export function borderInlineStartColor(v) { return new CssProp("borderInlineStartColor", v); }
export function borderInlineStartStyle(v) { return new CssProp("borderInlineStartStyle", v); }
export function borderInlineStartWidth(v) { return new CssProp("borderInlineStartWidth", v); }
export function borderLeft(v) { return new CssProp("borderLeft", v); }
export function borderLeftColor(v) { return new CssProp("borderLeftColor", v); }
export function borderLeftStyle(v) { return new CssProp("borderLeftStyle", v); }
export function borderLeftWidth(v) { return new CssProp("borderLeftWidth", v); }
export function borderRadius(v) { return new CssProp("borderRadius", v); }
export function borderRight(v) { return new CssProp("borderRight", v); }
export function borderRightColor(v) { return new CssProp("borderRightColor", v); }
export function borderRightStyle(v) { return new CssProp("borderRightStyle", v); }
export function borderRightWidth(v) { return new CssProp("borderRightWidth", v); }
export function borderSpacing(v) { return new CssProp("borderSpacing", v); }
export function borderStyle(v) { return new CssProp("borderStyle", v); }
export function borderTop(v) { return new CssProp("borderTop", v); }
export function borderTopColor(v) { return new CssProp("borderTopColor", v); }
export function borderTopLeftRadius(v) { return new CssProp("borderTopLeftRadius", v); }
export function borderTopRightRadius(v) { return new CssProp("borderTopRightRadius", v); }
export function borderTopStyle(v) { return new CssProp("borderTopStyle", v); }
export function borderTopWidth(v) { return new CssProp("borderTopWidth", v); }
export function borderWidth(v) { return new CssProp("borderWidth", v); }
export function bottom(v) { return new CssProp("bottom", v); }
export function boxShadow(v) { return new CssProp("boxShadow", v); }
export function boxSizing(v) { return new CssProp("boxSizing", v); }
export function breakAfter(v) { return new CssProp("breakAfter", v); }
export function breakBefore(v) { return new CssProp("breakBefore", v); }
export function breakInside(v) { return new CssProp("breakInside", v); }
export function bufferedRendering(v) { return new CssProp("bufferedRendering", v); }
export function captionSide(v) { return new CssProp("captionSide", v); }
export function caretColor(v) { return new CssProp("caretColor", v); }
export function clear(v) { return new CssProp("clear", v); }
export function clip(v) { return new CssProp("clip", v); }
export function clipPath(v) { return new CssProp("clipPath", v); }
export function clipRule(v) { return new CssProp("clipRule", v); }
export function color(v) { return new CssProp("color", v); }
export function colorInterpolation(v) { return new CssProp("colorInterpolation", v); }
export function colorInterpolationFilters(v) { return new CssProp("colorInterpolationFilters", v); }
export function colorRendering(v) { return new CssProp("colorRendering", v); }
export function colorScheme(v) { return new CssProp("colorScheme", v); }
export function columnCount(v) { return new CssProp("columnCount", v); }
export function columnFill(v) { return new CssProp("columnFill", v); }
export function columnGap(v) { return new CssProp("columnGap", v); }
export function columnRule(v) { return new CssProp("columnRule", v); }
export function columnRuleColor(v) { return new CssProp("columnRuleColor", v); }
export function columnRuleStyle(v) { return new CssProp("columnRuleStyle", v); }
export function columnRuleWidth(v) { return new CssProp("columnRuleWidth", v); }
export function columnSpan(v) { return new CssProp("columnSpan", v); }
export function columnWidth(v) { return new CssProp("columnWidth", v); }
export function columns(v) { return new CssProp("columns", v); }
export function contain(v) { return new CssProp("contain", v); }
export function containIntrinsicSize(v) { return new CssProp("containIntrinsicSize", v); }
export function content(v) { return new CssProp("content", v); }
export function counterIncrement(v) { return new CssProp("counterIncrement", v); }
export function counterReset(v) { return new CssProp("counterReset", v); }
export function cursor(v) { return new CssProp("cursor", v); }
export function cx(v) { return new CssProp("cx", v); }
export function cy(v) { return new CssProp("cy", v); }
export function d(v) { return new CssProp("d", v); }
export function direction(v) { return new CssProp("direction", v); }
export function display(v) { return new CssProp("display", v); }
export function dominantBaseline(v) { return new CssProp("dominantBaseline", v); }
export function emptyCells(v) { return new CssProp("emptyCells", v); }
export function fill(v) { return new CssProp("fill", v); }
export function fillOpacity(v) { return new CssProp("fillOpacity", v); }
export function fillRule(v) { return new CssProp("fillRule", v); }
export function filter(v) { return new CssProp("filter", v); }
export function flex(v) { return new CssProp("flex", v); }
export function flexBasis(v) { return new CssProp("flexBasis", v); }
export function flexDirection(v) { return new CssProp("flexDirection", v); }
export function flexFlow(v) { return new CssProp("flexFlow", v); }
export function flexGrow(v) { return new CssProp("flexGrow", v); }
export function flexShrink(v) { return new CssProp("flexShrink", v); }
export function flexWrap(v) { return new CssProp("flexWrap", v); }
export function float(v) { return new CssProp("float", v); }
export function floodColor(v) { return new CssProp("floodColor", v); }
export function floodOpacity(v) { return new CssProp("floodOpacity", v); }
export function font(v) { return new CssProp("font", v); }
export function fontDisplay(v) { return new CssProp("fontDisplay", v); }
export function fontFamily(v) { return new CssProp("fontFamily", v); }
export function fontFeatureSettings(v) { return new CssProp("fontFeatureSettings", v); }
export function fontKerning(v) { return new CssProp("fontKerning", v); }
export function fontOpticalSizing(v) { return new CssProp("fontOpticalSizing", v); }
export function fontSize(v) { return new CssProp("fontSize", v); }
export function fontStretch(v) { return new CssProp("fontStretch", v); }
export function fontStyle(v) { return new CssProp("fontStyle", v); }
export function fontVariant(v) { return new CssProp("fontVariant", v); }
export function fontVariantCaps(v) { return new CssProp("fontVariantCaps", v); }
export function fontVariantEastAsian(v) { return new CssProp("fontVariantEastAsian", v); }
export function fontVariantLigatures(v) { return new CssProp("fontVariantLigatures", v); }
export function fontVariantNumeric(v) { return new CssProp("fontVariantNumeric", v); }
export function fontVariationSettings(v) { return new CssProp("fontVariationSettings", v); }
export function fontWeight(v) { return new CssProp("fontWeight", v); }
export function forcedColorAdjust(v) { return new CssProp("forcedColorAdjust", v); }
export function gap(v) { return new CssProp("gap", v); }
export function grid(v) { return new CssProp("grid", v); }
export function gridArea(v) { return new CssProp("gridArea", v); }
export function gridAutoColumns(v) { return new CssProp("gridAutoColumns", v); }
export function gridAutoFlow(v) { return new CssProp("gridAutoFlow", v); }
export function gridAutoRows(v) { return new CssProp("gridAutoRows", v); }
export function gridColumn(v) { return new CssProp("gridColumn", v); }
export function gridColumnEnd(v) { return new CssProp("gridColumnEnd", v); }
export function gridColumnGap(v) { return new CssProp("gridColumnGap", v); }
export function gridColumnStart(v) { return new CssProp("gridColumnStart", v); }
export function gridGap(v) { return new CssProp("gridGap", v); }
export function gridRow(v) { return new CssProp("gridRow", v); }
export function gridRowEnd(v) { return new CssProp("gridRowEnd", v); }
export function gridRowGap(v) { return new CssProp("gridRowGap", v); }
export function gridRowStart(v) { return new CssProp("gridRowStart", v); }
export function gridTemplate(v) { return new CssProp("gridTemplate", v); }
export function gridTemplateAreas(v) { return new CssProp("gridTemplateAreas", v); }
export function gridTemplateColumns(v) { return new CssProp("gridTemplateColumns", v); }
export function gridTemplateRows(v) { return new CssProp("gridTemplateRows", v); }
export function height(v) { return new CssProp("height", v); }
export function hyphens(v) { return new CssProp("hyphens", v); }
export function imageOrientation(v) { return new CssProp("imageOrientation", v); }
export function imageRendering(v) { return new CssProp("imageRendering", v); }
export function inlineSize(v) { return new CssProp("inlineSize", v); }
export function isolation(v) { return new CssProp("isolation", v); }
export function justifyContent(v) { return new CssProp("justifyContent", v); }
export function justifyItems(v) { return new CssProp("justifyItems", v); }
export function justifySelf(v) { return new CssProp("justifySelf", v); }
export function left(v) { return new CssProp("left", v); }
export function letterSpacing(v) { return new CssProp("letterSpacing", v); }
export function lightingColor(v) { return new CssProp("lightingColor", v); }
export function lineBreak(v) { return new CssProp("lineBreak", v); }
export function lineHeight(v) { return new CssProp("lineHeight", v); }
export function listStyle(v) { return new CssProp("listStyle", v); }
export function listStyleImage(v) { return new CssProp("listStyleImage", v); }
export function listStylePosition(v) { return new CssProp("listStylePosition", v); }
export function listStyleType(v) { return new CssProp("listStyleType", v); }
export function margin(v) { return new CssProp("margin", v); }
export function marginBlockEnd(v) { return new CssProp("marginBlockEnd", v); }
export function marginBlockStart(v) { return new CssProp("marginBlockStart", v); }
export function marginBottom(v) { return new CssProp("marginBottom", v); }
export function marginInlineEnd(v) { return new CssProp("marginInlineEnd", v); }
export function marginInlineStart(v) { return new CssProp("marginInlineStart", v); }
export function marginLeft(v) { return new CssProp("marginLeft", v); }
export function marginRight(v) { return new CssProp("marginRight", v); }
export function marginTop(v) { return new CssProp("marginTop", v); }
export function marker(v) { return new CssProp("marker", v); }
export function markerEnd(v) { return new CssProp("markerEnd", v); }
export function markerMid(v) { return new CssProp("markerMid", v); }
export function markerStart(v) { return new CssProp("markerStart", v); }
export function mask(v) { return new CssProp("mask", v); }
export function maskType(v) { return new CssProp("maskType", v); }
export function maxBlockSize(v) { return new CssProp("maxBlockSize", v); }
export function maxHeight(v) { return new CssProp("maxHeight", v); }
export function maxInlineSize(v) { return new CssProp("maxInlineSize", v); }
export function maxWidth(v) { return new CssProp("maxWidth", v); }
export function maxZoom(v) { return new CssProp("maxZoom", v); }
export function minBlockSize(v) { return new CssProp("minBlockSize", v); }
export function minHeight(v) { return new CssProp("minHeight", v); }
export function minInlineSize(v) { return new CssProp("minInlineSize", v); }
export function minWidth(v) { return new CssProp("minWidth", v); }
export function minZoom(v) { return new CssProp("minZoom", v); }
export function mixBlendMode(v) { return new CssProp("mixBlendMode", v); }
export function objectFit(v) { return new CssProp("objectFit", v); }
export function objectPosition(v) { return new CssProp("objectPosition", v); }
export function offset(v) { return new CssProp("offset", v); }
export function offsetDistance(v) { return new CssProp("offsetDistance", v); }
export function offsetPath(v) { return new CssProp("offsetPath", v); }
export function offsetRotate(v) { return new CssProp("offsetRotate", v); }
export function opacity(v) { return new CssProp("opacity", v); }
export function order(v) { return new CssProp("order", v); }
export function orientation(v) { return new CssProp("orientation", v); }
export function orphans(v) { return new CssProp("orphans", v); }
export function outline(v) { return new CssProp("outline", v); }
export function outlineColor(v) { return new CssProp("outlineColor", v); }
export function outlineOffset(v) { return new CssProp("outlineOffset", v); }
export function outlineStyle(v) { return new CssProp("outlineStyle", v); }
export function outlineWidth(v) { return new CssProp("outlineWidth", v); }
export function overflow(v) { return new CssProp("overflow", v); }
export function overflowAnchor(v) { return new CssProp("overflowAnchor", v); }
export function overflowWrap(v) { return new CssProp("overflowWrap", v); }
export function overflowX(v) { return new CssProp("overflowX", v); }
export function overflowY(v) { return new CssProp("overflowY", v); }
export function overscrollBehavior(v) { return new CssProp("overscrollBehavior", v); }
export function overscrollBehaviorBlock(v) { return new CssProp("overscrollBehaviorBlock", v); }
export function overscrollBehaviorInline(v) { return new CssProp("overscrollBehaviorInline", v); }
export function overscrollBehaviorX(v) { return new CssProp("overscrollBehaviorX", v); }
export function overscrollBehaviorY(v) { return new CssProp("overscrollBehaviorY", v); }
export function padding(v) { return new CssProp("padding", v); }
export function paddingBlockEnd(v) { return new CssProp("paddingBlockEnd", v); }
export function paddingBlockStart(v) { return new CssProp("paddingBlockStart", v); }
export function paddingBottom(v) { return new CssProp("paddingBottom", v); }
export function paddingInlineEnd(v) { return new CssProp("paddingInlineEnd", v); }
export function paddingInlineStart(v) { return new CssProp("paddingInlineStart", v); }
export function paddingLeft(v) { return new CssProp("paddingLeft", v); }
export function paddingRight(v) { return new CssProp("paddingRight", v); }
export function paddingTop(v) { return new CssProp("paddingTop", v); }
export function pageBreakAfter(v) { return new CssProp("pageBreakAfter", v); }
export function pageBreakBefore(v) { return new CssProp("pageBreakBefore", v); }
export function pageBreakInside(v) { return new CssProp("pageBreakInside", v); }
export function paintOrder(v) { return new CssProp("paintOrder", v); }
export function perspective(v) { return new CssProp("perspective", v); }
export function perspectiveOrigin(v) { return new CssProp("perspectiveOrigin", v); }
export function placeContent(v) { return new CssProp("placeContent", v); }
export function placeItems(v) { return new CssProp("placeItems", v); }
export function placeSelf(v) { return new CssProp("placeSelf", v); }
export function pointerEvents(v) { return new CssProp("pointerEvents", v); }
export function position(v) { return new CssProp("position", v); }
export function quotes(v) { return new CssProp("quotes", v); }
export function r(v) { return new CssProp("r", v); }
export function resize(v) { return new CssProp("resize", v); }
export function right(v) { return new CssProp("right", v); }
export function rowGap(v) { return new CssProp("rowGap", v); }
export function rubyPosition(v) { return new CssProp("rubyPosition", v); }
export function rx(v) { return new CssProp("rx", v); }
export function ry(v) { return new CssProp("ry", v); }
export function scrollBehavior(v) { return new CssProp("scrollBehavior", v); }
export function scrollMargin(v) { return new CssProp("scrollMargin", v); }
export function scrollMarginBlock(v) { return new CssProp("scrollMarginBlock", v); }
export function scrollMarginBlockEnd(v) { return new CssProp("scrollMarginBlockEnd", v); }
export function scrollMarginBlockStart(v) { return new CssProp("scrollMarginBlockStart", v); }
export function scrollMarginBottom(v) { return new CssProp("scrollMarginBottom", v); }
export function scrollMarginInline(v) { return new CssProp("scrollMarginInline", v); }
export function scrollMarginInlineEnd(v) { return new CssProp("scrollMarginInlineEnd", v); }
export function scrollMarginInlineStart(v) { return new CssProp("scrollMarginInlineStart", v); }
export function scrollMarginLeft(v) { return new CssProp("scrollMarginLeft", v); }
export function scrollMarginRight(v) { return new CssProp("scrollMarginRight", v); }
export function scrollMarginTop(v) { return new CssProp("scrollMarginTop", v); }
export function scrollPadding(v) { return new CssProp("scrollPadding", v); }
export function scrollPaddingBlock(v) { return new CssProp("scrollPaddingBlock", v); }
export function scrollPaddingBlockEnd(v) { return new CssProp("scrollPaddingBlockEnd", v); }
export function scrollPaddingBlockStart(v) { return new CssProp("scrollPaddingBlockStart", v); }
export function scrollPaddingBottom(v) { return new CssProp("scrollPaddingBottom", v); }
export function scrollPaddingInline(v) { return new CssProp("scrollPaddingInline", v); }
export function scrollPaddingInlineEnd(v) { return new CssProp("scrollPaddingInlineEnd", v); }
export function scrollPaddingInlineStart(v) { return new CssProp("scrollPaddingInlineStart", v); }
export function scrollPaddingLeft(v) { return new CssProp("scrollPaddingLeft", v); }
export function scrollPaddingRight(v) { return new CssProp("scrollPaddingRight", v); }
export function scrollPaddingTop(v) { return new CssProp("scrollPaddingTop", v); }
export function scrollSnapAlign(v) { return new CssProp("scrollSnapAlign", v); }
export function scrollSnapStop(v) { return new CssProp("scrollSnapStop", v); }
export function scrollSnapType(v) { return new CssProp("scrollSnapType", v); }
export function shapeImageThreshold(v) { return new CssProp("shapeImageThreshold", v); }
export function shapeMargin(v) { return new CssProp("shapeMargin", v); }
export function shapeOutside(v) { return new CssProp("shapeOutside", v); }
export function shapeRendering(v) { return new CssProp("shapeRendering", v); }
export function size(v) { return new CssProp("size", v); }
export function speak(v) { return new CssProp("speak", v); }
export function src(v) { return new CssProp("src", v); }
export function stopColor(v) { return new CssProp("stopColor", v); }
export function stopOpacity(v) { return new CssProp("stopOpacity", v); }
export function stroke(v) { return new CssProp("stroke", v); }
export function strokeDasharray(v) { return new CssProp("strokeDasharray", v); }
export function strokeDashoffset(v) { return new CssProp("strokeDashoffset", v); }
export function strokeLinecap(v) { return new CssProp("strokeLinecap", v); }
export function strokeLinejoin(v) { return new CssProp("strokeLinejoin", v); }
export function strokeMiterlimit(v) { return new CssProp("strokeMiterlimit", v); }
export function strokeOpacity(v) { return new CssProp("strokeOpacity", v); }
export function strokeWidth(v) { return new CssProp("strokeWidth", v); }
export function tabSize(v) { return new CssProp("tabSize", v); }
export function tableLayout(v) { return new CssProp("tableLayout", v); }
export function textAlign(v) { return new CssProp("textAlign", v); }
export function textAlignLast(v) { return new CssProp("textAlignLast", v); }
export function textAnchor(v) { return new CssProp("textAnchor", v); }
export function textCombineUpright(v) { return new CssProp("textCombineUpright", v); }
export function textDecoration(v) { return new CssProp("textDecoration", v); }
export function textDecorationColor(v) { return new CssProp("textDecorationColor", v); }
export function textDecorationLine(v) { return new CssProp("textDecorationLine", v); }
export function textDecorationSkipInk(v) { return new CssProp("textDecorationSkipInk", v); }
export function textDecorationStyle(v) { return new CssProp("textDecorationStyle", v); }
export function textIndent(v) { return new CssProp("textIndent", v); }
export function textOrientation(v) { return new CssProp("textOrientation", v); }
export function textOverflow(v) { return new CssProp("textOverflow", v); }
export function textRendering(v) { return new CssProp("textRendering", v); }
export function textShadow(v) { return new CssProp("textShadow", v); }
export function textSizeAdjust(v) { return new CssProp("textSizeAdjust", v); }
export function textTransform(v) { return new CssProp("textTransform", v); }
export function textUnderlinePosition(v) { return new CssProp("textUnderlinePosition", v); }
export function top(v) { return new CssProp("top", v); }
export function touchAction(v) { return new CssProp("touchAction", v); }
export function transform(v) { return new CssProp("transform", v); }
export function transformBox(v) { return new CssProp("transformBox", v); }
export function transformOrigin(v) { return new CssProp("transformOrigin", v); }
export function transformStyle(v) { return new CssProp("transformStyle", v); }
export function transition(v) { return new CssProp("transition", v); }
export function transitionDelay(v) { return new CssProp("transitionDelay", v); }
export function transitionDuration(v) { return new CssProp("transitionDuration", v); }
export function transitionProperty(v) { return new CssProp("transitionProperty", v); }
export function transitionTimingFunction(v) { return new CssProp("transitionTimingFunction", v); }
export function unicodeBidi(v) { return new CssProp("unicodeBidi", v); }
export function unicodeRange(v) { return new CssProp("unicodeRange", v); }
export function userSelect(v) { return new CssProp("userSelect", v); }
export function userZoom(v) { return new CssProp("userZoom", v); }
export function vectorEffect(v) { return new CssProp("vectorEffect", v); }
export function verticalAlign(v) { return new CssProp("verticalAlign", v); }
export function visibility(v) { return new CssProp("visibility", v); }
export function whiteSpace(v) { return new CssProp("whiteSpace", v); }
export function widows(v) { return new CssProp("widows", v); }
export function width(v) { return new CssProp("width", v); }
export function willChange(v) { return new CssProp("willChange", v); }
export function wordBreak(v) { return new CssProp("wordBreak", v); }
export function wordSpacing(v) { return new CssProp("wordSpacing", v); }
export function wordWrap(v) { return new CssProp("wordWrap", v); }
export function writingMode(v) { return new CssProp("writingMode", v); }
export function x(v) { return new CssProp("x", v); }
export function y(v) { return new CssProp("y", v); }
export function zIndex(v) { return new CssProp("zIndex", v); }
export function zoom(v) { return new CssProp("zoom", v); }
/**
 * A selection of fonts for preferred monospace rendering.
 **/
export const monospaceFonts = "'Droid Sans Mono', 'Consolas', 'Lucida Console', 'Courier New', 'Courier', monospace";
/**
 * A selection of fonts for preferred monospace rendering.
 **/
export const monospaceFamily = fontFamily(monospaceFonts);
/**
 * A selection of fonts that should match whatever the user's operating system normally uses.
 **/
export const systemFonts = "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif";
/**
 * A selection of fonts that should match whatever the user's operating system normally uses.
 **/
export const systemFamily = fontFamily(systemFonts);
//# sourceMappingURL=css.js.map