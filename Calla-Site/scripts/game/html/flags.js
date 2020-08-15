export const isFirefox = typeof InstallTrigger !== "undefined";
export const isIOS = ["iPad", "iPhone", "iPod"].indexOf(navigator.platform) >= 0;