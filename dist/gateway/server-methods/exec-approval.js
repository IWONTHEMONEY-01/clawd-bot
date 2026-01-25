import { ErrorCodes, errorShape, formatValidationErrors, validateExecApprovalRequestParams, validateExecApprovalResolveParams, } from "../protocol/index.js";
export function createExecApprovalHandlers(manager) {
    return {
        "exec.approval.request": async ({ params, respond, context }) => {
            if (!validateExecApprovalRequestParams(params)) {
                respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, `invalid exec.approval.request params: ${formatValidationErrors(validateExecApprovalRequestParams.errors)}`));
                return;
            }
            const p = params;
            const timeoutMs = typeof p.timeoutMs === "number" ? p.timeoutMs : 120_000;
            const request = {
                command: p.command,
                cwd: p.cwd ?? null,
                host: p.host ?? null,
                security: p.security ?? null,
                ask: p.ask ?? null,
                agentId: p.agentId ?? null,
                resolvedPath: p.resolvedPath ?? null,
                sessionKey: p.sessionKey ?? null,
            };
            const record = manager.create(request, timeoutMs);
            context.broadcast("exec.approval.requested", {
                id: record.id,
                request: record.request,
                createdAtMs: record.createdAtMs,
                expiresAtMs: record.expiresAtMs,
            }, { dropIfSlow: true });
            const decision = await manager.waitForDecision(record, timeoutMs);
            respond(true, {
                id: record.id,
                decision,
                createdAtMs: record.createdAtMs,
                expiresAtMs: record.expiresAtMs,
            }, undefined);
        },
        "exec.approval.resolve": async ({ params, respond, client, context }) => {
            if (!validateExecApprovalResolveParams(params)) {
                respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, `invalid exec.approval.resolve params: ${formatValidationErrors(validateExecApprovalResolveParams.errors)}`));
                return;
            }
            const p = params;
            const decision = p.decision;
            if (decision !== "allow-once" && decision !== "allow-always" && decision !== "deny") {
                respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "invalid decision"));
                return;
            }
            const resolvedBy = client?.connect?.client?.displayName ?? client?.connect?.client?.id;
            const ok = manager.resolve(p.id, decision, resolvedBy ?? null);
            if (!ok) {
                respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "unknown approval id"));
                return;
            }
            context.broadcast("exec.approval.resolved", { id: p.id, decision, resolvedBy, ts: Date.now() }, { dropIfSlow: true });
            respond(true, { ok: true }, undefined);
        },
    };
}
