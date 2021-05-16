import { makeFont } from "./fonts";
import { CanvasImage } from "./CanvasImage";
function isBatteryNavigator(nav) {
    return "getBattery" in nav;
}
const chargeLabels = [
    "drain",
    "N/A",
    "charge"
];
export class BatteryImage extends CanvasImage {
    constructor() {
        super(256, 128);
        this.battery = null;
        this.lastChargeDirection = null;
        this.lastLevel = null;
        this.chargeDirection = 0;
        this.level = 0.5;
        if (isBatteryNavigator(navigator)) {
            this.readBattery(navigator);
        }
        else {
            this.redraw();
        }
    }
    onRedraw() {
        if (this.battery) {
            this.chargeDirection = this.battery.charging ? 1 : -1;
            this.level = this.battery.level;
        }
        else {
            this.level += 0.1;
            if (this.level > 1) {
                this.level = 0;
            }
        }
        const directionChanged = this.chargeDirection !== this.lastChargeDirection;
        const levelChanged = this.level !== this.lastLevel;
        if (!directionChanged && !levelChanged) {
            return false;
        }
        this.lastChargeDirection = this.chargeDirection;
        this.lastLevel = this.level;
        const levelColor = this.level < 0.25
            ? "red"
            : this.level < 0.5
                ? "yellow"
                : "#16c60c";
        const padding = 10;
        const bodyWidth = this.canvas.width - padding;
        const width = bodyWidth - 4 * padding;
        const height = this.canvas.height - 4 * padding;
        const midX = bodyWidth / 2;
        const midY = this.canvas.height / 2;
        const left = padding * 1.2;
        const right = bodyWidth - left;
        const label = chargeLabels[this.chargeDirection + 1];
        this.g.clearRect(0, 0, bodyWidth, this.canvas.height);
        this.fillRect("white", 0, 0, bodyWidth, this.canvas.height, 0);
        this.fillRect("white", bodyWidth, midY - 2 * padding, padding, 4 * padding, 0);
        this.fillRect("black", 0, 0, bodyWidth, this.canvas.height, padding);
        this.fillRect(levelColor, 2 * padding, 2 * padding, width * this.level, height, 0);
        this.g.fillStyle = "white";
        this.g.strokeStyle = "black";
        this.g.lineWidth = 4;
        this.g.textBaseline = "middle";
        this.g.font = makeFont({
            fontSize: height,
            fontFamily: "Lato"
        });
        this.drawText("-", left, midY, "left");
        this.drawText("+", right, midY, "right");
        this.g.font = makeFont({
            fontSize: height / 2.5,
            fontFamily: "Lato"
        });
        this.drawText(label, midX, midY, "center");
        return true;
    }
    async readBattery(navigator) {
        const redraw = this.redraw.bind(this);
        redraw();
        this.battery = await navigator.getBattery();
        this.battery.addEventListener("chargingchange", redraw);
        this.battery.addEventListener("levelchange", redraw);
        setInterval(redraw, 1000);
        redraw();
    }
}
//# sourceMappingURL=BatteryImage.js.map