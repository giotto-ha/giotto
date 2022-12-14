# Giotto

Giotto (or GIoTTo) is the General IoT Tool for home automation.

It's very much in its early stages, but the goal is to create an HA ecosystem that is easy to use and easy to expand in whatever language you chose.

## How do I get started?

First, you'll need to install node. Personally, I use [`nvm`](https://github.com/nvm-sh/nvm) for this. I add shell [integration](https://github.com/nvm-sh/nvm#deeper-shell-integration) so that any time I navigate to a directory with a `.nvmrc` file, it switches to the appropriate version.

Once you have node installed Node, you need to install [`yarn`](https://classic.yarnpkg.com/en/). This is done simply by running:

```zsh
npm install --global yarn
```

This repo actually uses the [latest versions of Yarn](https://yarnpkg.com/getting-started), in particular [Zero-Installs](https://yarnpkg.com/features/zero-installs). If
you're unfamiliar with what this brings, you should take some time to read the docs.

### IDE Support

This repo comes ready with a lot of VS Code support. In particular, there's a workspace file in the `.vscode` directory and the appropriate [SDK support](https://yarnpkg.com/getting-started/editor-sdks) set up for yarn.

## What next?

Well, it's early days. I'm working on docs in the `docs` directory and will be slowly building things up as I go. Feel free to open issues and PRs and I'll take a look at them. You can also try and find me at https://gitter.im/giotto-ha/community.

 - [Architecture](docs/Architecture.md)
