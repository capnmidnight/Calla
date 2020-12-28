export enum MouseButton{
    Mouse0 = 0,
    Mouse1 = 1,
    Mouse2 = 2,
    Mouse3 = 3,
    Mouse4 = 4
}

export enum MouseButtons{
    None = 0,
    Mouse0 = 1 << MouseButton.Mouse0,
    Mouse1 = 1 << MouseButton.Mouse1,
    Mouse2 = 1 << MouseButton.Mouse2,
    Mouse3 = 1 << MouseButton.Mouse3,
    Mouse4 = 1 << MouseButton.Mouse4
}