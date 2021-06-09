import { isDefined } from "../typeChecks";
export class Size {
    width;
    height;
    constructor(width = 0, height = 0) {
        this.width = width;
        this.height = height;
        Object.seal(this);
    }
    set(width, height) {
        this.width = width;
        this.height = height;
    }
    copy(s) {
        if (isDefined(s)) {
            this.width = s.width;
            this.height = s.height;
        }
    }
    clone() {
        return new Size(this.width, this.height);
    }
    toString() {
        return `<w:${this.width}, h:${this.height}>`;
    }
}
//# sourceMappingURL=Size.js.map