import { ManagedWebGLResource } from "./ManagedWebGLResource";
export class Buffer extends ManagedWebGLResource {
    constructor(gl, type, usage, data, dataType, dataSize) {
        super(gl, gl.createBuffer());
        this.disposed = false;
        if (type === "array") {
            this.type = gl.ARRAY_BUFFER;
        }
        else if (type === "element-array") {
            this.type = gl.ELEMENT_ARRAY_BUFFER;
        }
        else if (type === "copy-read") {
            this.type = gl.COPY_READ_BUFFER;
        }
        else if (type === "copy-write") {
            this.type = gl.COPY_WRITE_BUFFER;
        }
        else if (type === "transform-feedback") {
            this.type = gl.TRANSFORM_FEEDBACK_BUFFER;
        }
        else if (type === "uniform") {
            this.type = gl.UNIFORM_BUFFER;
        }
        else if (type === "pixel-pack") {
            this.type = gl.PIXEL_PACK_BUFFER;
        }
        else if (type === "pixel-unpack") {
            this.type = gl.PIXEL_UNPACK_BUFFER;
        }
        else {
            throw new Error(`Unknown buffer type: ${type}`);
        }
        // validate and translate usage
        if (usage === "static-draw") {
            this.usage = gl.STATIC_DRAW;
        }
        else if (usage === "dynamic-draw") {
            this.usage = gl.DYNAMIC_DRAW;
        }
        else if (usage === "stream-draw") {
            this.usage = gl.STREAM_DRAW;
        }
        else if (usage === "static-read") {
            this.usage = gl.STATIC_READ;
        }
        else if (usage === "dynamic-read") {
            this.usage = gl.DYNAMIC_READ;
        }
        else if (usage === "stream-read") {
            this.usage = gl.STREAM_READ;
        }
        else if (usage === "static-copy") {
            this.usage = gl.STATIC_COPY;
        }
        else if (usage === "dynamic-copy") {
            this.usage = gl.DYNAMIC_COPY;
        }
        else if (usage === "stream-copy") {
            this.usage = gl.STREAM_COPY;
        }
        else {
            throw new Error(`Unknown usage type: ${usage}`);
        }
        if (dataType != null) {
            this.dataType = dataType;
        }
        else if (data instanceof Int8Array) {
            this.dataType = gl.BYTE;
        }
        else if (data instanceof Uint8Array
            || data instanceof Uint8ClampedArray) {
            this.dataType = gl.UNSIGNED_BYTE;
        }
        else if (data instanceof Int16Array) {
            this.dataType = gl.SHORT;
        }
        else if (data instanceof Uint16Array) {
            this.dataType = gl.UNSIGNED_SHORT;
        }
        else if (data instanceof Int32Array) {
            this.dataType = gl.INT;
        }
        else if (data instanceof Uint32Array) {
            this.dataType = gl.UNSIGNED_INT;
        }
        else if (data instanceof Float32Array) {
            this.dataType = gl.FLOAT;
        }
        else {
            throw new Error("Unknown buffer data type");
        }
        if (dataSize != null) {
            this.dataSize = dataSize;
        }
        else {
            this.dataSize = data.BYTES_PER_ELEMENT;
        }
        this.length = data.length;
        this.bind();
        gl.bufferData(this.type, data, this.usage);
    }
    dispose() {
        if (!this.disposed) {
            this.gl.deleteBuffer(this.handle);
            this.disposed = true;
        }
    }
    bind() {
        this.gl.bindBuffer(this.type, this.handle);
    }
}
//# sourceMappingURL=Buffer.js.map