import { createAgentSession, ModelRuntime } from "@earendil-works/pi-coding-agent";

const modelRuntime = await ModelRuntime.create();

const deeps = modelRuntime.getModel("opencode-go", "deepseek-v4.1-flash");
if (!deeps) {
    throw new Error("未找到模型: opencode-go/deepseek-v4.1-flash");
}
console.log(`找到模型: ${deeps.provider}/${deeps.id}`);

const { session } = await createAgentSession({
    model: deeps,
    thinkingLevel: "high",
    modelRuntime,
});

const unsubscribe = session.subscribe((event) => {
    if (event.type === "message_update" && event.assistantMessageEvent.type === "text_delta") {
        process.stdout.write(event.assistantMessageEvent.delta);
    }
});

try {
    await session.prompt("用一句话打个招呼");
    console.log();
} finally {
    unsubscribe();
    session.dispose();
}
