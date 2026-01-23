import { randomUUID } from "node:crypto";
export class ExecApprovalManager {
    pending = new Map();
    create(request, timeoutMs) {
        const now = Date.now();
        const id = randomUUID();
        const record = {
            id,
            request,
            createdAtMs: now,
            expiresAtMs: now + timeoutMs,
        };
        return record;
    }
    async waitForDecision(record, timeoutMs) {
        return await new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                this.pending.delete(record.id);
                resolve(null);
            }, timeoutMs);
            this.pending.set(record.id, { record, resolve, reject, timer });
        });
    }
    resolve(recordId, decision, resolvedBy) {
        const pending = this.pending.get(recordId);
        if (!pending)
            return false;
        clearTimeout(pending.timer);
        pending.record.resolvedAtMs = Date.now();
        pending.record.decision = decision;
        pending.record.resolvedBy = resolvedBy ?? null;
        this.pending.delete(recordId);
        pending.resolve(decision);
        return true;
    }
    getSnapshot(recordId) {
        const entry = this.pending.get(recordId);
        return entry?.record ?? null;
    }
}
