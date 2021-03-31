import { isDefined } from "../typeChecks";

export class Size {
    constructor(public width = 0, public height = 0) {
        Object.seal(this);
    }

    set(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    copy(s: Size) {
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
