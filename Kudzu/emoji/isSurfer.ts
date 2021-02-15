import { Emoji } from "./Emoji";
import { allSurfersGroup, allBoatRowersGroup, allSwimmersGroup, allMerpeopleGroup } from "./people";


export function isSurfer(e: Emoji | string) {
    return allSurfersGroup.contains(e)
        || allBoatRowersGroup.contains(e)
        || allSwimmersGroup.contains(e)
        || allMerpeopleGroup.contains(e);
}
