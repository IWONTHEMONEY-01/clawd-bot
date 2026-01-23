export class GatewayLockError extends Error {
    cause;
    constructor(message, cause) {
        super(message);
        this.cause = cause;
        this.name = "GatewayLockError";
    }
}
