export function readBufferText(buffer: ArrayBuffer): string {
    const decoder = new TextDecoder("utf-8");
    const text = decoder.decode(buffer);
    return text;
}
