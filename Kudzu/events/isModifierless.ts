export function isModifierless(evt: KeyboardEvent) {
    return !(evt.shiftKey || evt.altKey || evt.ctrlKey || evt.metaKey);
}
