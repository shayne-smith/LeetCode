class Logger {
    private messageMap: Map<string, number>;
    private expirationQueue: [number, string][];
    private readonly TTL_SECONDS: number;

    constructor() {
        this.messageMap = new Map();
        this.expirationQueue = [];
        this.TTL_SECONDS = 10;
    }

    private cleanup(timestamp: number): void {
        const expiryThreshold = timestamp - this.TTL_SECONDS;

        while (this.expirationQueue.length > 0 && this.expirationQueue[0][0] <= expiryThreshold) {
            const [_, expiredMessage] = this.expirationQueue.shift();

            // only want to delete message from map if it's expired
            if (this.messageMap.get(expiredMessage) <= expiryThreshold) {
                this.messageMap.delete(expiredMessage);
            }
        }
    }

    shouldPrintMessage(timestamp: number, message: string): boolean {
        // proactively cleanup
        this.cleanup(timestamp);

        // if message is in map after cleanup, don't print message
        if (this.messageMap.has(message)) {
            return false;
        }

        // else, update queue & map and print message
        this.expirationQueue.push([timestamp, message]);
        this.messageMap.set(message, timestamp);
        return true;
    }
}