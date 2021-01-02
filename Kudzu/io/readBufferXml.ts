import { readBufferText } from "./readBufferText";

export function readBufferXml(buffer: ArrayBuffer): HTMLElement {
    const text = readBufferText(buffer);
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    return xml.documentElement;
}