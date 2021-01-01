/**
 * Represents a single media track(either audio or video).
 * One <tt>JitsiLocalTrack</tt> corresponds to one WebRTC MediaStreamTrack.
 */
export default class JitsiLocalTrack extends JitsiTrack {
    /**
     * Constructs new JitsiLocalTrack instance.
     *
     * @constructor
     * @param {Object} trackInfo
     * @param {number} trackInfo.rtcId the ID assigned by the RTC module
     * @param trackInfo.stream WebRTC MediaStream, parent of the track
     * @param trackInfo.track underlying WebRTC MediaStreamTrack for new
     * JitsiRemoteTrack
     * @param trackInfo.mediaType the MediaType of the JitsiRemoteTrack
     * @param trackInfo.videoType the VideoType of the JitsiRemoteTrack
     * @param trackInfo.effects the effects array contains the effect instance to use
     * @param trackInfo.resolution the video resolution if it's a video track
     * @param trackInfo.deviceId the ID of the local device for this track
     * @param trackInfo.facingMode the camera facing mode used in getUserMedia
     * call
     * @param {sourceId} trackInfo.sourceId - The id of the desktop sharing
     * source. NOTE: defined for desktop sharing tracks only.
     */
    constructor({ deviceId, facingMode, mediaType, resolution, rtcId, sourceId, sourceType, stream, track, videoType, effects }: {
        rtcId: number;
        stream: any;
        track: any;
        mediaType: any;
        videoType: any;
        effects: any;
        resolution: any;
        deviceId: any;
        facingMode: any;
        sourceId: any;
        sourceType: any;
    });
    /**
     * The ID assigned by the RTC module on instance creation.
     *
     * @type {number}
     */
    rtcId: number;
    sourceId: any;
    sourceType: any;
    resolution: any;
    maxEnabledResolution: any;
    deviceId: any;
    /**
     * Returns if associated MediaStreamTrack is in the 'ended' state
     *
     * @returns {boolean}
     */
    isEnded(): boolean;
    storedMSID: string;
    /**
     * Sets the effect and switches between the modified stream and original one.
     *
     * @param {Object} effect - Represents the effect instance to be used.
     * @returns {Promise}
     */
    setEffect(effect: any): Promise<any>;
    /**
     * Asynchronously mutes this track.
     *
     * @returns {Promise}
     */
    mute(): Promise<any>;
    /**
     * Asynchronously unmutes this track.
     *
     * @returns {Promise}
     */
    unmute(): Promise<any>;
    /**
     * Returns <tt>true</tt> - if the stream is muted and <tt>false</tt>
     * otherwise.
     *
     * @returns {boolean} <tt>true</tt> - if the stream is muted and
     * <tt>false</tt> otherwise.
     */
    isMuted(): boolean;
    /**
     * Returns device id associated with track.
     *
     * @returns {string}
     */
    getDeviceId(): string;
    /**
     * Returns the participant id which owns the track.
     *
     * @returns {string} the id of the participants. It corresponds to the
     * Colibri endpoint id/MUC nickname in case of Jitsi-meet.
     */
    getParticipantId(): string;
    /**
     * Returns facing mode for video track from camera. For other cases (e.g.
     * audio track or 'desktop' video track) returns undefined.
     *
     * @returns {CameraFacingMode|undefined}
     */
    getCameraFacingMode(): {
        ENVIRONMENT: string;
        USER: string;
    } | undefined;
    /**
     * Stops the associated MediaStream.
     */
    stopStream(): void;
    /**
     * Checks whether the attached MediaStream is receiving data from source or
     * not. If the stream property is null(because of mute or another reason)
     * this method will return false.
     * NOTE: This method doesn't indicate problem with the streams directly.
     * For example in case of video mute the method will return false or if the
     * user has disposed the track.
     *
     * @returns {boolean} true if the stream is receiving data and false
     * this otherwise.
     */
    isReceivingData(): boolean;
}
import JitsiTrack from "./JitsiTrack";
