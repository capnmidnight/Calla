import { getMonospaceFonts } from "../html/css";
import { TextImage } from "./TextImage";

export class ClockImage extends TextImage {
    constructor() {
        super({
            bgFillColor: "#000000",
            bgStrokeColor: "#ffffff",
            bgStrokeSize: 0.1,
            textFillColor: "#ffffff",
            fontFamily: getMonospaceFonts(),
            fontSize: 20,
            minHeight: 1,
            maxHeight: 1,
            padding: 0.3,
            wrapWords: false,
            freezeDimensions: true
        });

        const updater = this.update.bind(this);
        setInterval(updater, 500);
        updater();
    }

    public fps: number = null;
    private lastLen: number = 0;

    protected update(): void {
        const time = new Date();
        let value = time.toLocaleTimeString();
        if (this.fps !== null) {
            value += " " + Math.round(this.fps).toFixed(0) + "hz";
        }

        if (value.length !== this.lastLen) {
            this.lastLen = value.length;
            this.unfreeze();
        }

        this.value = value;
    }
}

