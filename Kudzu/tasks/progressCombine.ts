import { isDefined } from "../typeChecks";
import { progressCallback } from "./progressCallback";


export function progressCombine(...onProgs: progressCallback[]): progressCallback {
    onProgs = onProgs.filter(isDefined);
    return (soFar: number, total: number, message: string) => {
        for (const onProg of onProgs) {
            onProg(soFar, total, message);
        }
    };
}
