// @ts-nocheck
import { ProxyAgent } from "undici";
export function makeProxyFetch(proxyUrl) {
    const agent = new ProxyAgent(proxyUrl);
    return (input, init) => {
        const base = init ? { ...init } : {};
        return fetch(input, { ...base, dispatcher: agent });
    };
}
