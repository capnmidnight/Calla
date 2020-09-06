async function getResponse(path) {
    const request = fetch(path);
    const response = await request;
    if (!response.ok) {
        throw new Error(`[${response.status}] - ${response.statusText}`);
    }
    return response;
}

/**
 * @param {string} path
 * @returns {Promise<any>}
 */
export async function getObject(path) {
    const response = await getResponse(path);
    const obj = await response.json();
    return obj;
}

/**
 * @param {string} path
 * @returns {Promise<string>}
 */
export async function getFile(path) {
    const response = await getResponse(path);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
}

/**
 * @param {string} path
 * @returns {Promise<Uint8Array[]>}
 */
async function getParts(path) {
    const response = await getResponse(path);

    const contentLength = parseInt(response.headers.get("Content-Length"), 10);
    if (!contentLength) {
        throw new Error("Server did not provide a content length header.");
    }

    const contentType = response.headers.get("Content-Type");
    if (!contentType) {
        throw new Error("Server did not provide a content type");
    }

    const reader = response.body.getReader();
    const buffer = new Uint8Array(contentLength);
    let receivedLength = 0;
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }

        if (receivedLength + value.length > contentLength) {
            throw new Error("Whoa! Recieved content exceeded expected amount");
        }

        buffer.set(value, receivedLength);
        receivedLength += value.length;
    }

    return { buffer, contentType };
}

/**
 * @param {string} path
 * @returns {Promise<any>}
 */
export async function getObjectWithProgress(path) {
    const { buffer } = await getParts(path);
    const decoder = new TextDecoder("utf-8");
    const text = decoder.decode(buffer);
    const obj = JSON.parse(text);
    return obj;
}

/**
 * @param {string} path
 * @returns {Promise<string>}
 */
export async function getFileWithProgress(path) {
    const { buffer, contentType } = await getParts(path);
    try {
        const blob = new Blob([buffer], { type: contentType });
        const blobUrl = URL.createObjectURL(blob);
        return blobUrl;
    }
    catch (exp) {
        throw exp;
    }
}