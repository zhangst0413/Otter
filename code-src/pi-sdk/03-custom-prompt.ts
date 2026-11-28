import {
    createAgentSession,
    DefaultResourceLoader,
    getAgentDir,
    SessionManager,
} from "@earendil-works/pi-coding-agent";

const cwd = process.cwd();
const agentDir = getAgentDir();

const loader = new DefaultResourceLoader({
    cwd,
    agentDir,
    appendSystemPromptOverride: (base) => [
        ...base,
        "## 附加说明\n- 永远保持简洁\n- 列出事项时用项目符号",
    ],
});
await loader.reload();

// 与前面的示例不同，当前仅将会话存储到内存，不持久化到磁盘
const { session } = await createAgentSession({
    resourceLoader: loader,
    sessionManager: SessionManager.inMemory(),
});

const unsubscribe = session.subscribe((event) => {
    if (event.type === "message_update" && event.assistantMessageEvent.type === "text_delta") {
        process.stdout.write(event.assistantMessageEvent.delta);
    }
});

try {
    console.log("=== 追加系统提示词示例 ===");
    await session.prompt("列出 TypeScript 的 3 个好处");
    console.log();
} finally {
    unsubscribe();
    session.dispose();
}
