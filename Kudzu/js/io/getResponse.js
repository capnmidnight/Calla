export async function getResponse(path) {
    const request = fetch(path);
    const response = await request;
    if (!response.ok) {
        throw new Error(`[${response.status}] - ${response.statusText}. Path ${path}`);
    }
    return response;
}
//# sourceMappingURL=getResponse.js.map