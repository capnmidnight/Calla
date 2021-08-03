import { isDefined } from "../typeChecks";
export function progressCombine(...onProgs) {
    onProgs = onProgs.filter(isDefined);
    return (soFar, total, message) => {
        for (const onProg of onProgs) {
            onProg(soFar, total, message);
        }
    };
}
//# sourceMappingURL=progressCombine.js.map