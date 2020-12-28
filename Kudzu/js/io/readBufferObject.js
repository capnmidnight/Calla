export function readBufferObject(buffer) {
    const decoder = new TextDecoder("utf-8");
    const text = decoder.decode(buffer);
    const obj = JSON.parse(text);
    return obj;
}
//# sourceMappingURL=readBufferObject.js.map