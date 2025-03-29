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