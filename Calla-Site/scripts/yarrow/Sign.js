import { Image2DMesh } from "../graphics3d/Image2DMesh";

export class Sign extends Image2DMesh {
    constructor(sign) {
        super("sign-" + sign.fileName);
        if (sign.isCallout) {
            this.addEventListener("click", () => console.log(img.name));
        }
    }
}
