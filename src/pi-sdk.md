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

