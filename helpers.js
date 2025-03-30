export async function waitUntilTargetTime(targetTime) {
    while (true) {
        const now = new Date();
        const currentTime = now.toTimeString().split(' ')[0]; // Format HH:MM:SS

        if (currentTime >= targetTime) {
            console.log(`Starting test at ${currentTime}`);
            break;
        }

        await new Promise(resolve => setTimeout(resolve, 1000)); // Check every 1s
    }
}

export async function waitForExpectedResponse(page, urlPart, statusCode, timeout = 10000) {
    console.log(`🟡 Waiting for XHR response: URL contains '${urlPart}', Status Code: ${statusCode}`);
    return new Promise(resolve => {
        let matched = false;

        const listener = async request => {
            if (matched) return;

            const response = await request.response().catch(() => null);
            if (response) {
                console.log(`🔄 XHR Intercepted: ${request.url()} | Status: ${response.status()}`);
                if (request.url().includes(urlPart) && response.status() === statusCode) {
                    matched = true;
                    page.off('requestfinished', listener); // Stop listening after match
                    console.log(`✅ Matched XHR request: ${request.url()} | Status: ${response.status()}`);
                    resolve(true);
                }
            }
        };

        page.on('requestfinished', listener); // Use 'requestfinished' for XHR requests

        setTimeout(() => {
            if (!matched) {
                page.off('requestfinished', listener);
                console.log(`❌ Timeout: No matching XHR request found for '${urlPart}' with status ${statusCode}`);
                resolve(false);
            }
        }, timeout);
    });
}