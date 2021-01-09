/**
 * Opens a window that will be closed when the window that opened it is closed.
 * @param href - the location to load in the window
 * @param x - the screen position horizontal component
 * @param y - the screen position vertical component
 * @param width - the screen size horizontal component
 * @param height - the screen size vertical component
 */
export declare function openWindow(href: string, x: number, y: number, width: number, height: number): void;
/**
 * Opens a new window with a query string parameter that can be used to differentiate different test instances.
 **/
export declare function openSideTest(): void;
