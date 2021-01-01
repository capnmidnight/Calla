import Bowser from "bowser";

export const browser = Bowser.getParser(navigator.userAgent).getResult();
export const isDesktop = browser.platform.type === "desktop";
export const isChrome = browser.engine.name === "Blink";
export const isFirefox = "InstallTrigger" in globalThis;
export const isIOS = /iPad|iPhone|iPod/.test(navigator.platform)
    || /Macintosh(.*?) FxiOS(.*?)\//.test(navigator.platform)
    || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 2;
export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
export const isMobileVR = /Mobile VR/.test(navigator.userAgent);
export const isOculus = /oculus/.test(navigator.userAgent);
export const isOculusGo = isOculus && /pacific/.test(navigator.userAgent);
export const isOculusQuest = isOculus && /quest/.test(navigator.userAgent);
export const hasWebXR = "xr" in navigator;
export const hasWebVR = "getVRDisplays" in navigator;