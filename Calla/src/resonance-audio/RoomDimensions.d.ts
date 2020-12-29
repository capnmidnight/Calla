import { Dimension } from "./Dimension";
export interface RoomDimensions {
    [Dimension.Width]: number;
    [Dimension.Height]: number;
    [Dimension.Depth]: number;
}
