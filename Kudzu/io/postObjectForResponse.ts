export async function postObjectForResponse<T>(path: string, obj: T) {
    const request = fetch(path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    });

    const response = await request;
    if (response.ok) {
        console.log("Thanks!");
    }

    return response;
}