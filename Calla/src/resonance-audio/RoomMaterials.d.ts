import { Material } from "./utils";
import { DirectionContainer } from "./DirectionContainer";
/**
 * Properties describing the wall materials (from
 * {@linkcode Utils.ROOM_MATERIAL_COEFFICIENTS ROOM_MATERIAL_COEFFICIENTS})
 * of a room.
 **/
export interface RoomMaterials extends DirectionContainer<Material> {
}
