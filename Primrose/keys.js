import { isApple } from "kudzu/html/flags";
// These values are defined here:
//   https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
//   Values read on May 24, 2020
export const keyGroups = new Map([
    ["special", [
            "Unidentified"
        ]],
    ["modifier", [
            "Alt",
            "AltGraph",
            "CapsLock",
            "Control",
            "Fn",
            "FnLock",
            "Hyper",
            "Meta",
            "NumLock",
            "ScrollLock",
            "Shift",
            "Super",
            "Symbol",
            "SymbolLock"
        ]],
    ["whitespace", [
            "Enter",
            "Tab"
        ]],
    ["navigation", [
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "End",
            "Home",
            "PageDown",
            "PageUp"
        ]],
    ["editing", [
            "Backspace",
            "Clear",
            "Copy",
            "CrSel",
            "Cut",
            "Delete",
            "EraseEof",
            "ExSel",
            "Insert",
            "Paste",
            "Redo",
            "Undo"
        ]],
    ["ui", [
            "Accept",
            "Again",
            "Attn",
            "Cancel",
            "ContextMenu",
            "Escape",
            "Execute",
            "Find",
            "Finish",
            "Help",
            "Pause",
            "Play",
            "Props",
            "Select",
            "ZoomIn",
            "ZoomOut"
        ]],
    ["device", [
            "BrightnessDown",
            "BrightnessUp",
            "Eject",
            "LogOff",
            "Power",
            "PowerOff",
            "PrintScreen",
            "Hibernate",
            "Standby",
            "WakeUp"
        ]],
    ["ime", [
            "AllCandidates",
            "Alphanumeric",
            "CodeInput",
            "Compose",
            "Convert",
            "Dead",
            "FinalMode",
            "GroupFirst",
            "GroupNext",
            "GroupPrevious",
            "ModeChange",
            "NextCandidate",
            "NonConvert",
            "PreviousCandidate",
            "Process",
            "SingleCandidate"
        ]],
    ["korean", [
            "HangulMode",
            "HanjaMode",
            "JunjaMode"
        ]],
    ["japanese", [
            "Eisu",
            "Hankaku",
            "Hiragana",
            "HiraganaKatakana",
            "KanaMode",
            "KanjiMode",
            "Katakana",
            "Romaji",
            "Zenkaku",
            "ZenkakuHanaku"
        ]],
    ["function", [
            "F1",
            "F2",
            "F3",
            "F4",
            "F5",
            "F6",
            "F7",
            "F8",
            "F9",
            "F10",
            "F11",
            "F12",
            "F13",
            "F14",
            "F15",
            "F16",
            "F17",
            "F18",
            "F19",
            "F20",
            "Soft1",
            "Soft2",
            "Soft3",
            "Soft4"
        ]],
    ["phone", [
            "AppSwitch",
            "Call",
            "Camera",
            "CameraFocus",
            "EndCall",
            "GoBack",
            "GoHome",
            "HeadsetHook",
            "LastNumberRedial",
            "Notification",
            "MannerMode",
            "VoiceDial"
        ]],
    ["multimedia", [
            "ChannelDown",
            "ChannelUp",
            "MediaFastForward",
            "MediaPause",
            "MediaPlay",
            "MediaPlayPause",
            "MediaRecord",
            "MediaRewind",
            "MediaStop",
            "MediaTrackNext",
            "MediaTrackPrevious"
        ]],
    ["audio", [
            "AudioBalanceLeft",
            "AudioBalanceRight",
            "AudioBassDown",
            "AudioBassBoostDown",
            "AudioBassBoostToggle",
            "AudioBassBoostUp",
            "AudioBassUp",
            "AudioFaderFront",
            "AudioFaderRear",
            "AudioSurroundModeNext",
            "AudioTrebleDown",
            "AudioTrebleUp",
            "AudioVolumeDown",
            "AudioVolumeMute",
            "AudioVolumeUp",
            "MicrophoneToggle",
            "MicrophoneVolumeDown",
            "MicrophoneVolumeMute",
            "MicrophoneVolumeUp"
        ]],
    ["tv", [
            "TV",
            "TV3DMode",
            "TVAntennaCable",
            "TVAudioDescription",
            "TVAudioDescriptionMixDown",
            "TVAudioDescriptionMixUp",
            "TVContentsMenu",
            "TVDataService",
            "TVInput",
            "TVInputComponent1",
            "TVInputComponent2",
            "TVInputComposite1",
            "TVInputComposite2",
            "TVInputHDMI1",
            "TVInputHDMI2",
            "TVInputHDMI3",
            "TVInputHDMI4",
            "TVInputVGA1",
            "TVMediaContext",
            "TVNetwork",
            "TVNumberEntry",
            "TVPower",
            "TVRadioService",
            "TVSatellite",
            "TVSatelliteBS",
            "TVSatelliteCS",
            "TVSatelliteToggle",
            "TVTerrestrialAnalog",
            "TVTerrestrialDigital",
            "TVTimer"
        ]],
    ["mediaController", [
            "AVRInput",
            "AVRPower",
            "ColorF0Red",
            "ColorF1Green",
            "ColorF2Yellow",
            "ColorF3Blue",
            "ColorF4Grey",
            "ColorF5Brown",
            "ClosedCaptionToggle",
            "Dimmer",
            "DisplaySwap",
            "DVR",
            "Exit",
            "FavoriteClear0",
            "FavoriteClear1",
            "FavoriteClear2",
            "FavoriteClear3",
            "FavoriteRecall0",
            "FavoriteRecall1",
            "FavoriteRecall2",
            "FavoriteRecall3",
            "FavoriteStore0",
            "FavoriteStore1",
            "FavoriteStore2",
            "FavoriteStore3",
            "Guide",
            "GuideNextDay",
            "GuidePreviousDay",
            "Info",
            "InstantReplay",
            "Link",
            "ListProgram",
            "LiveContent",
            "Lock",
            "MediaApps",
            "MediaAudioTrack",
            "MediaLast",
            "MediaSkipBackward",
            "MediaSkipForward",
            "MediaStepBackward",
            "MediaStepForward",
            "MediaTopMenu",
            "NavigateIn",
            "NavigateNext",
            "NavigateOut",
            "NavigatePrevious",
            "NextFavoriteChannel",
            "NextUserProfile",
            "OnDemand",
            "Pairing",
            "PinPDown",
            "PinPMove",
            "PinPToggle",
            "PinPUp",
            "PlaySpeedDown",
            "PlaySpeedReset",
            "PlaySpeedUp",
            "RandomToggle",
            "RcLowBattery",
            "RecordSpeedNext",
            "RfBypass",
            "ScanChannelsToggle",
            "ScreenModeNext",
            "Settings",
            "SplitScreenToggle",
            "STBInput",
            "STBPower",
            "Subtitle",
            "Teletext",
            "VideoModeNext",
            "Wink",
            "ZoomToggle"
        ]],
    ["speechRecognition", [
            "SpeechCorrectionList",
            "SpeechInputToggle"
        ]],
    ["document", [
            "Close",
            "New",
            "Open",
            "Print",
            "Save",
            "SpellCheck",
            "MailForward",
            "MailReply",
            "MailSend"
        ]],
    ["applicationSelector", [
            "LaunchCalculator",
            "LaunchCalendar",
            "LaunchContacts",
            "LaunchMail",
            "LaunchMediaPlayer",
            "LaunchMusicPlayer",
            "LaunchMyComputer",
            "LaunchPhone",
            "LaunchScreenSaver",
            "LaunchSpreadsheet",
            "LaunchWebBrowser",
            "LaunchWebCam",
            "LaunchWordProcessor",
            "LaunchApplication1",
            "LaunchApplication2",
            "LaunchApplication3",
            "LaunchApplication4",
            "LaunchApplication5",
            "LaunchApplication6",
            "LaunchApplication7",
            "LaunchApplication8",
            "LaunchApplication9",
        ]],
    ["browserControl", [
            "BrowserBack",
            "BrowserFavorites",
            "BrowserForward",
            "BrowserHome",
            "BrowserRefresh",
            "BrowserSearch",
            "BrowserStop"
        ]],
    ["numericKeypad", [
            "Clear"
        ]]
]);
// reverse lookup for keyGroups
export const keyTypes = new Map();
for (let [key, groups] of keyGroups) {
    for (let value of groups) {
        keyTypes.set(value, key);
    }
}
Object.freeze(keyTypes);
let isFnDown = false;
if (isApple) {
    window.addEventListener("keydown", (evt) => {
        if (evt.key === "Fn") {
            isFnDown = true;
        }
    });
    window.addEventListener("keyup", (evt) => {
        if (evt.key === "Fn") {
            isFnDown = false;
        }
    });
}
// Fixes for out-of-spec values that some older browser versions might have returned.
export function normalizeKeyValue(evt) {
    // modifier
    if (evt.key === "OS"
        && (evt.code === "OSLeft"
            || evt.code === "OSRight")) {
        return "Meta";
    }
    else if (evt.key === "Scroll") {
        return "ScrollLock";
    }
    else if (evt.key === "Win") {
        return "Meta";
    }
    // whitespace
    else if (evt.key === "Spacebar") {
        return " ";
    }
    else if (evt.key === "\n") {
        return "Enter";
    }
    // navigation
    else if (evt.key === "Down") {
        return "ArrowDown";
    }
    else if (evt.key === "Left") {
        return "ArrowLeft";
    }
    else if (evt.key === "Right") {
        return "ArrowRight";
    }
    else if (evt.key === "Up") {
        return "ArrowUp";
    }
    // editing
    else if (evt.key === "Del") {
        return "Delete";
    }
    else if (evt.key === "Delete"
        && isApple
        && isFnDown) {
        return "Backspace";
    }
    else if (evt.key === "Crsel") {
        return "CrSel";
    }
    else if (evt.key === "Exsel") {
        return "ExSel";
    }
    // ui
    else if (evt.key === "Esc") {
        return "Escape";
    }
    else if (evt.key === "Apps") {
        return "ContextMenu";
    }
    // device - None
    // ime
    else if (evt.key === "Multi") {
        return "Compose";
    }
    else if (evt.key === "Nonconvert") {
        return "NonConvert";
    }
    // korean - None
    // japanese
    else if (evt.key === "RomanCharacters") {
        return "Eisu";
    }
    else if (evt.key === "HalfWidth") {
        return "Hankaku";
    }
    else if (evt.key === "FullWidth") {
        return "Zenkaku";
    }
    // dead - None
    // function - None
    // phone
    else if (evt.key === "Exit"
        || evt.key === "MozHomeScreen") {
        return "GoHome";
    }
    // multimedia
    else if (evt.key === "MediaNextTrack") {
        return "MediaTrackNext";
    }
    else if (evt.key === "MediaPreviousTrack") {
        return "MediaTrackPrevious";
    }
    else if (evt.key === "FastFwd") {
        return "MedaiFastFwd";
    }
    // audio
    else if (evt.key === "VolumeDown") {
        return "AudioVolumeDown";
    }
    else if (evt.key === "VolumeMute") {
        return "AudioVolumeMute";
    }
    else if (evt.key === "VolumeUp") {
        return "AudioVolumeUp";
    }
    // TV
    else if (evt.key === "Live") {
        return "TV";
    }
    // media
    else if (evt.key === "Zoom") {
        return "ZoomToggle";
    }
    // speech recognition - None
    // document - None
    // application selector
    else if (evt.key === "SelectMedia"
        || evt.key === "MediaSelect") {
        return "LaunchMediaPlayer";
    }
    // browser - None
    // numeric keypad
    else if (evt.key === "Add") {
        return "+";
    }
    else if (evt.key === "Divide") {
        return "/";
    }
    else if (evt.key === "Decimal") {
        // this is incorrect for some locales, but
        // this is a deprecated value that is fixed in
        // modern browsers, so it shouldn't come up
        // very often.
        return ".";
    }
    else if (evt.key === "Key11") {
        return "11";
    }
    else if (evt.key === "Key12") {
        return "12";
    }
    else if (evt.key === "Multiply") {
        return "*";
    }
    else if (evt.key === "Subtract") {
        return "-";
    }
    else if (evt.key === "Separator") {
        // this is incorrect for some locales, but 
        // this is a deprecated value that is fixed in
        // modern browsers, so it shouldn't come up
        // very often.
        return ",";
    }
    return evt.key;
}
//# sourceMappingURL=keys.js.map