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
