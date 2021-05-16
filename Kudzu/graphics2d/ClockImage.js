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
    update() {
        const time = new Date();
        this.value = time.toLocaleTimeString();
        return true;
    }
}
//# sourceMappingURL=ClockImage.js.map