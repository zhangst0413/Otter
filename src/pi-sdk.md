# pi-sdk

## 在终端中使用pi

安装pi：

```powershell
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
```

使用：在目标目录下执行`pi`并回车即可启动，然后输入`/login`添加模型供应商。另外可使用`/model`切换模型，使用`/thinking`切换思考强度

pi还依赖fd和ripgrep，它们能提升文件和代码块的查找速度。若你在启动pi后，在终端提示fd和ripgrep安装失败，可执行如下命令安装：

```powershell
winget install -e --id sharkdp.fd
winget install BurntSushi.ripgrep.MSVC
```

pi的模型供应商主要是云厂商和llama.cpp，我们还可以自定义模型和供应商，在 `C:\Users\<用户名>\.pi\agent\models.json` 添加如下类似配置：

```json
{
  "providers": {
    "local": {
      "baseUrl": "http://localhost:8000/v1",
      "api": "openai-completions",
      "apiKey": "your_api_key",
      "models": [{ "id": "your_model_id" }]
    }
  }
}

```

## 在代码中使用pi

安装：

```powershell
npm install @earendil-works/pi-coding-agent
```

### 使用默认配置对话

```typescript
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
```

### 自定义模型和思考强度

```typescript
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
```

### 追加系统提示词

```typescript
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
```