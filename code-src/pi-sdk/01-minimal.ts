import { createAgentSession } from "@earendil-works/pi-coding-agent";

const { session } = await createAgentSession();

const unsubscribe = session.subscribe((event) => {
    if (event.type === "message_update" && event.assistantMessageEvent.type === "text_delta") {
        process.stdout.write(event.assistantMessageEvent.delta);
    }
});

try {
    await session.prompt("当前文件夹下有哪些文件");
    console.log();

    session.state.messages
        .filter((msg) => msg.role !== "system")
        .forEach((msg) => {
            console.log(msg);
        });
} finally {
    unsubscribe();
    session.dispose();
}
