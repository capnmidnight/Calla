export interface MediaPermissionSet {
    audio: boolean;
    video: boolean;
}

export interface MediaDeviceSet {
    audioInput: MediaDeviceInfo[];
    videoInput: MediaDeviceInfo[];
    audioOutput: MediaDeviceInfo[];
}