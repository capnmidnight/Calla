/**
 * This is not an event handler that you can add to an element. It's a global event that
 * waits for the user to perform some sort of interaction with the website.
  */
export declare function onUserGesture(callback: () => any, test?: () => Promise<boolean>): void;
