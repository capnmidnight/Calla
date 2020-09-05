/**
 * @param {string} path
 * @returns {Promise<any>}
 */
export async function getObject(path) {
    const request = fetch(path),
        response = await request;
    if (!response.ok) {
        throw new Error(`[${response.status}] - ${response.statusText}`);
    }

    return await response.json();
}

/**
 * @param {string} path
 * @returns {Promise<string>}
 */
export async function getFile(path) {
    const request = fetch(path),
        response = await request;

    if (!response.ok) {
        throw new Error(`[${response.status}] - ${response.statusText}`);
    }

    const contentLength = parseInt(response.headers.get("Content-Length"), 10);
    if (!contentLength) {
        throw new Error("Server did not provide a content length header.");
    }

    const contentType = response.headers.get("Content-Type");
    if (!contentType) {
        throw new Error("Server did not provide a content type");
    }

    const reader = response.body.getReader();
    const parts = [];
    let receivedLength = 0;
    while(true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }

        receivedLength += value.length;
        if (receivedLength > contentLength) {
            throw new Error("Whoa! Recieved content exceeded expected amount");
        }

        parts.push(value);
    }

    const blob = new Blob(parts, { type: contentType });
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
}