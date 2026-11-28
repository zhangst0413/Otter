# mdbook

[mdbook](https://rust-lang.github.io/mdBook/index.html)是rust官方出品的类gitbook项目，它可以从 Markdown 文件创建书籍

## mdbook的安装与使用

安装：在[发布页](https://github.com/rust-lang/mdBook/releases)下载当前系统对应的二进制文件，然后将二进制文件所在目录添加到环境变量

初始化项目： 

```powershell
mdbook init my-first-book
```

启动项目：

```powershell
cd my-first-book
mdbook serve --open
```

构建并发布：

```powershell
mdbook build
```

然后将book目录下的文件部署即可


## mdbook的部署

可创建`.github\workflows\deploy.yml`文件并推送到远程分支

```yml
name: Deploy mdBook to GitHub Pages

on:
  push:
    branches:
      - main          # 只有推送到 main 分支才触发
    paths-ignore:     # 纯文档/协议类改动不必重新部署站点
      - 'LICENSE'
      - 'README.md'
      - '.gitignore'
      - 'book/**'     # book/ 已在 .gitignore 中，此处为防御性忽略

# 连推多次时取消排队中的旧任务，避免 gh-pages 被交错写入
concurrency:
  group: deploy-pages-${{ github.ref }}
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write  # 必须：允许 Actions 向仓库写入（gh-pages 分支）

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: false   # book/ 是被忽略的构建产物而非 submodule，显式关闭更稳妥

      - name: Install mdBook
        uses: peaceiris/actions-mdbook@v2
        with:
          mdbook-version: "0.5.4"   # 与本地 mdbook --version 对齐，保证 CI 产物一致

      - name: Show mdBook version
        run: mdbook --version

      - name: Build
        run: mdbook build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./book        # 只发布构建产物，勿把整个仓库推到 gh-pages
          force_orphan: true         # 每次单提交覆盖 gh-pages，历史干净、不会残留旧源码
          # cname: docs.example.com  # 若启用自定义域名再打开（同时保留仓库内 CNAME 文件）
```


然后在仓库的 `Settings` -> `Pages` 将部署分支设置为 `gh-pages`，部署目录为根目录，然后保存即可，等待一段时间后就会自动部署
