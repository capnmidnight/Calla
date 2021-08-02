import { audioCtx } from "kudzu/audio";
import { RenderingMode } from "../../../omnitone/rendering-mode";
import { Direction } from "../../../resonance-audio/Direction";
import { ResonanceAudio } from "../../../resonance-audio/resonance-audio";
import { Material } from "../../../resonance-audio/utils";
import type { Pose } from "../../positions/Pose";
import { BaseEmitter } from "../../sources/spatializers/BaseEmitter";
import { ResonanceAudioNode } from "../../sources/spatializers/ResonanceAudioNode";
import { AudioDestination } from "../AudioDestination";
import { BaseListener } from "./BaseListener";

/**
 * An audio positioner that uses Google's Resonance Audio library
 **/
export class ResonanceAudioListener extends BaseListener {
    private scene: ResonanceAudio;

    /**
     * Creates a new audio positioner that uses Google's Resonance Audio library
     */
    constructor() {
        super();

        const scene = new ResonanceAudio(audioCtx, {
            ambisonicOrder: 1,
            renderingMode: RenderingMode.Bypass
        });

        scene.setRoomProperties({
            width: 10,
            height: 5,
            depth: 10,
        }, {
            [Direction.Left]: Material.Transparent,
            [Direction.Right]: Material.Transparent,
            [Direction.Front]: Material.Transparent,
            [Direction.Back]: Material.Transparent,
            [Direction.Down]: Material.Grass,
            [Direction.Up]: Material.Transparent,
        });

        this.input = scene.listener.input;
        this.output = scene.output;

        this.scene = scene;
        
        Object.seal(this);
    }


    private disposed = false;
    dispose(): void {
        if (!this.disposed) {
            if (this.scene) {
                this.scene.dispose();
            }

            super.dispose();
            this.disposed = true;
        }
    }

    /**
     * Performs the spatialization operation for the audio source's latest location.
     */
    update(loc: Pose, _t: number): void {
        const { p, f, u } = loc;
        this.scene.setListenerPosition(p);
        this.scene.setListenerOrientation(f, u);
    }

    /**
     * Creates a spatialzer for an audio source.
     */
    createSpatializer(spatialize: boolean, isRemoteStream: boolean, destination: AudioDestination): BaseEmitter {
        if (spatialize) {
            const dest = isRemoteStream
                ? destination.remoteUserInput
                : destination.spatializedInput;
            return new ResonanceAudioNode(dest, this.scene);
        }
        else {
            return super.createSpatializer(spatialize, isRemoteStream, destination);
        }
    }
}
