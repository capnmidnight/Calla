export function readBufferObject<T>(buffer: ArrayBuffer) {
    const decoder = new TextDecoder("utf-8");
    const text = decoder.decode(buffer);
    const obj = JSON.parse(text);
    return obj as T;
}
