class Logger {
    private messageMap: Map<string, number>;
    private readonly TTL_SECONDS: number;

    constructor() {
        this.messageMap = new Map();
        this.TTL_SECONDS = 10;
    }

    shouldPrintMessage(timestamp: number, message: string): boolean {
        // attempt to fetch previous message's timestamp
        const prevMessageTimestamp = this.messageMap.get(message);

        // return true if value not in map
        if (prevMessageTimestamp === undefined) {
            this.messageMap.set(message, timestamp);
            return true;
        };

        // return false if value in map and new timestamp less than prev timestmap + TTL
        if (timestamp < prevMessageTimestamp + this.TTL_SECONDS) return false;

        // else add message to map and return true
        this.messageMap.set(message, timestamp);
        return true;
    }
}