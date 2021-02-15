import { allSurfersGroup, allBoatRowersGroup, allSwimmersGroup, allMerpeopleGroup } from "./people";
export function isSurfer(e) {
    return allSurfersGroup.contains(e)
        || allBoatRowersGroup.contains(e)
        || allSwimmersGroup.contains(e)
        || allMerpeopleGroup.contains(e);
}
//# sourceMappingURL=isSurfer.js.map