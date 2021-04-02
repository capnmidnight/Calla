const combiningMarks = /(<%= allExceptCombiningMarks %>)(<%= combiningMarks %>+)/g, surrogatePair = /(<%= highSurrogates %>)(<%= lowSurrogates %>)/g;
// unicode-aware string reverse
export function stringReverse(str) {
    str = str.replace(combiningMarks, function (_match, capture1, capture2) {
        return stringReverse(capture2) + capture1;
    })
        .replace(surrogatePair, "$2$1");
    let res = "";
    for (let i = str.length - 1; i >= 0; --i) {
        res += str[i];
    }
    return res;
}
//# sourceMappingURL=stringReverse.js.map