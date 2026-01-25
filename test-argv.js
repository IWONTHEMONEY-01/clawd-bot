// Test what entry.js normalizeWindowsArgv does to argv
import path from "node:path";

function normalizeWindowsArgv(argv) {
    if (process.platform !== "win32")
        return argv;
    if (argv.length < 2)
        return argv;
    const stripControlChars = (value) => {
        let out = "";
        for (let i = 0; i < value.length; i += 1) {
            const code = value.charCodeAt(i);
            if (code >= 32 && code !== 127) {
                out += value[i];
            }
        }
        return out;
    };
    const normalizeArg = (value) => stripControlChars(value)
        .replace(/^['"]+|['"]+$/g, "")
        .trim();
    const normalizeCandidate = (value) => normalizeArg(value).replace(/^\\\\\\?\\/, "");
    const execPath = normalizeCandidate(process.execPath);
    const execPathLower = execPath.toLowerCase();
    const execBase = path.basename(execPath).toLowerCase();
    const isExecPath = (value) => {
        if (!value)
            return false;
        const lower = normalizeCandidate(value).toLowerCase();
        console.log(`  isExecPath("${value}"): checking "${lower}"`);
        console.log(`    vs execPathLower="${execPathLower}"`);
        console.log(`    vs execBase="${execBase}"`);
        const result = (lower === execPathLower ||
            path.basename(lower) === execBase ||
            lower.endsWith("\\node.exe") ||
            lower.endsWith("/node.exe") ||
            lower.includes("node.exe"));
        console.log(`    result: ${result}`);
        return result;
    };
    console.log("Starting normalization with argv:", argv);
    const next = [...argv];
    for (let i = 1; i <= 3 && i < next.length;) {
        console.log(`Loop 1: checking next[${i}] = "${next[i]}"`);
        if (isExecPath(next[i])) {
            console.log(`  Splicing out next[${i}]`);
            next.splice(i, 1);
            continue;
        }
        i += 1;
    }
    console.log("After loop 1:", next);
    const filtered = next.filter((arg, index) => index === 0 || !isExecPath(arg));
    console.log("After filter:", filtered);
    if (filtered.length < 3)
        return filtered;
    const cleaned = [...filtered];
    for (let i = 2; i < cleaned.length;) {
        const arg = cleaned[i];
        if (!arg || arg.startsWith("-")) {
            i += 1;
            continue;
        }
        if (isExecPath(arg)) {
            cleaned.splice(i, 1);
            continue;
        }
        break;
    }
    console.log("Final:", cleaned);
    return cleaned;
}

console.log("Original argv:", process.argv);
const result = normalizeWindowsArgv([...process.argv]);
console.log("Normalized:", result);
