# mdbook

mdbook是rust官方出品的类gitbook项目，它可以从 Markdown 文件创建书籍，且使用 Rust 实现

## mdbook的安装与使用

安装：在[发布页](https://github.com/rust-lang/mdBook/releases)下载当前系统对应的二进制文件，然后将二进制文件所在目录添加到环境变量

初始化项目： `mdbook init my-first-book`

启动项目：进入到`my-first-book`目录下，再执行`mdbook serve --open`

构建并发布：执行`mdbook build`，然后将book目录下的文件部署即可
