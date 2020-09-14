import { Object3D } from "three/src/core/Object3D";
import { once } from "../calla/events/once";
import { pauseButton, playButton, speakerHighVolume, speakerLowVolume } from "../emoji/emojis";
import { EmojiIconMesh } from "../graphics3d/EmojiIconMesh";

const playButtonMesh = new EmojiIconMesh("playbackButtonPlay", playButton.value + speakerLowVolume.value);
const pauseButtonMesh = new EmojiIconMesh("playbackButtonPause", pauseButton.value + speakerHighVolume.value);

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
