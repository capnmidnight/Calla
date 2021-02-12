export function isChrome() {
    return "chrome" in globalThis && !navigator.userAgent.match("CriOS");
}

export function isFirefox() {
    return "InstallTrigger" in globalThis;
}

export function isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function isOpera() {
    return /Opera/.test(navigator.userAgent);
}

export function isAndroid() {
    return /Android/.test(navigator.userAgent);
}
export function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.platform) || /Macintosh(.*?) FxiOS(.*?)\//.test(navigator.platform) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 2;
}
export function isBlackberry() {
    return /BlackBerry/.test(navigator.userAgent);
}
export function isUCBrowser() {
    return /(UC Browser |UCWEB)/.test(navigator.userAgent);
}

export function isMobile() {
    return isAndroid()
        || isIOS()
        || isBlackberry()
        || isUCBrowser();
}
export function isDesktop() {
    return !isMobile();
}

export function isOculus() {
    return /oculus/.test(navigator.userAgent);
}
export function isOculusGo() {
    return isOculus()
        && /pacific/.test(navigator.userAgent);
}
export function isOculusQuest() {
    return isOculus()
        && /quest/.test(navigator.userAgent);
}
export function isMobileVR() {
    return /Mobile VR/.test(navigator.userAgent)
        || isOculusGo()
        || isOculusQuest();
}
export function hasWebXR() {
    return "xr" in navigator;
}
export function hasWebVR() {
    return "getVRDisplays" in navigator;
}