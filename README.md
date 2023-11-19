# Giotto

Giotto (or GIoTTo) is the General IoT Tool for home automation.

It's very much in its early stages, but the goal is to create an HA ecosystem that is easy to use and easy to expand in whatever language you chose.

## How do I get started?

First, you'll need to install node. Personally, I use [`nvm`](https://github.com/nvm-sh/nvm) for this. I add shell [integration](https://github.com/nvm-sh/nvm#deeper-shell-integration) so that any time I navigate to a directory with a `.nvmrc` file, it switches to the appropriate version.

Once you have node installed Node, you need to install [`yarn`](https://classic.yarnpkg.com/en/). This is done simply by running:

```zsh
npm install --global yarn
```

If you run `yarn build` from the root of the repo, it should build all of the packages in the appropriate order.

## What next?

Well, it's early days. I'm working on docs in the `docs` directory and will be slowly building things up as I go. Feel free to open issues and PRs and I'll take a look at them. You can also try and find me at https://gitter.im/giotto-ha/community.

- [Architecture](docs/Architecture.md)

# Getting started

Since this is a multi-workspace repo it can be tricky to figure out how to get started, so here's how to do it.

1. First step is to start the Docker containers: `docker compose up -d` should do it
2. Next, you'll want to start the GIoTTo registry: `DEBUG=giotto:* yarn workspace @giotto/registry start`
3. Next, start the configurator: `DEBUG=giotto:* yarn workspace @giotto/configurator start`
