import { FrontSide } from "three/src/constants";
import { Object3D } from "three/src/core/Object3D";
import { once } from "../calla/events/once";
import { pauseButton, playButton } from "../emoji/emojis";
import { TextMesh } from "../graphics3d/TextMesh";

const buttonStyle = {
    textBgColor: "transparent",
    textColor: "#000000",
    fontFamily: "Roboto",
    fontSize: 100
};

const buttonMatOpts = {
    lit: false,
    side: FrontSide
};

/** @type {TextMesh} */
const playButtonMesh = Object.assign(
    new TextMesh("playbackButtonPlay", buttonMatOpts),
    buttonStyle, {
    value: playButton.value
});

/** @type {TextMesh} */
const pauseButtonMesh = Object.assign(
    new TextMesh("playbackButtonPause", buttonMatOpts),
    buttonStyle, {
    value: pauseButton.value
});

const playEvt = { type: "play" };
const stopEvt = { type: "stop" };

export class PlaybackButton extends Object3D {
    /**
     * @param {AudioTrack} audioTrack
     * @param {import("../calla/audio/AudioSource").AudioSource} clip
     * @param {import("../calla/audio/AudioManager").AudioManager} audioSys
     */
    constructor(audioTrack, clip, audioSys) {
        super();
        this.name = "play-" + audioTrack.fileName;

        let isPlaying = false;

        const onStop = () => {
            if (isPlaying) {
                this.playButton.visible = true;
                this.pauseButton.visible = false;
                audioSys.stopClip(audioTrack.path);
                this.dispatchEvent(stopEvt);
                isPlaying = false;
            }
        };

        this.playButton = playButtonMesh.clone();
        this.playButton.addEventListener("click", async () => {
            this.playButton.visible = false;
            this.pauseButton.visible = true;
            this.dispatchEvent(playEvt);
            await audioSys.playClip(audioTrack.path, audioTrack.volume)
            isPlaying = true;
            await once(clip.spatializer.audio, "ended");
            onStop();
        });

        this.pauseButton = pauseButtonMesh.clone();
        this.pauseButton.visible = false;
        this.pauseButton.addEventListener("click", onStop);

        this.add(this.playButton, this.pauseButton);

        this.scale.setScalar(0.5);
    }
}
