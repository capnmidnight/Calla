export function readBufferText(buffer) {
    const decoder = new TextDecoder("utf-8");
    const text = decoder.decode(buffer);
    return text;
}
//# sourceMappingURL=readBufferText.js.map