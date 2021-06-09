import { deg2rad } from "../math/deg2rad";
import { CanvasImage } from "./CanvasImage";
export class ArtificialHorizon extends CanvasImage {
    _pitch = 0;
    _heading = 0;
    constructor() {
        super(128, 128);
        this.redraw();
    }
    get pitch() {
        return this._pitch;
    }
    set pitch(v) {
        if (v !== this.pitch) {
            this._pitch = v;
            this.redraw();
        }
    }
    get heading() {
        return this._heading;
    }
    set heading(v) {
        if (v !== this.heading) {
            this._heading = v;
            this.redraw();
        }
    }
    setPitchAndHeading(pitch, heading) {
        if (pitch !== this.pitch
            || heading !== this.heading) {
            this._pitch = pitch;
            this._heading = heading;
            this.redraw();
        }
    }
    onRedraw() {
        const a = deg2rad(this.pitch);
        const b = deg2rad(this.heading - 180);
        const p = 5;
        const w = this.canvas.width - 2 * p;
        const h = this.canvas.height - 2 * p;
        const hw = 0.5 * w;
        const hh = 0.5 * h;
        const y = Math.sin(a);
        const g = this.g;
        g.save();
        {
            g.clearRect(0, 0, this.canvas.width, this.canvas.height);
            g.translate(p, p);
            g.scale(hw, hh);
            g.translate(1, 1);
            g.fillStyle = "#808080";
            g.beginPath();
            g.arc(0, 0, 1, 0, 2 * Math.PI);
            g.fill();
            g.fillStyle = "#d0d0d0";
            g.beginPath();
            g.arc(0, 0, 1, 0, Math.PI, true);
            g.fill();
            g.save();
            {
                g.scale(1, Math.abs(y));
                if (y < 0) {
                    g.fillStyle = "#808080";
                }
                g.beginPath();
                g.arc(0, 0, 1, 0, Math.PI, y < 0);
                g.fill();
            }
            g.restore();
            g.save();
            {
                g.shadowColor = "#404040";
                g.shadowBlur = 4;
                g.shadowOffsetX = 3;
                g.shadowOffsetY = 3;
                g.rotate(b);
                g.fillStyle = "#ff0000";
                g.beginPath();
                g.moveTo(-0.1, 0);
                g.lineTo(0, 0.667);
                g.lineTo(0.1, 0);
                g.closePath();
                g.fill();
                g.fillStyle = "#ffffff";
                g.beginPath();
                g.moveTo(-0.1, 0);
                g.lineTo(0, -0.667);
                g.lineTo(0.1, 0);
                g.closePath();
                g.fill();
            }
            g.restore();
            g.beginPath();
            g.strokeStyle = "#000000";
            g.lineWidth = 0.1;
            g.arc(0, 0, 1, 0, 2 * Math.PI);
            g.stroke();
        }
        g.restore();
        return true;
    }
}
//# sourceMappingURL=ArtificialHorizon.js.map