## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

### Docker dev environment

`docker compose up` from the repo root serves the app at `iantumulak.localhost` through the existing Traefik proxy (`docker-compose.yml`, `app/Dockerfile.dev`). `node_modules` is a named volume (`node_modules:/app/node_modules`), not the default anonymous volume: an anonymous volume gets discarded on `docker compose down`, forcing a full reinstall on the next `up`. `Dockerfile.dev` also runs `pnpm install --frozen-lockfile` at image build time (baked into the layer), not in the container's start command, so even a fresh/wiped volume gets seeded from the image instead of reinstalling from the network. `pnpm-workspace.yaml` must be copied into the image alongside `package.json`/`pnpm-lock.yaml`: it holds the `allowBuilds` trust list (`esbuild`, `simple-git-hooks`) pnpm needs to run their postinstall scripts non-interactively; omitting it fails the build with `ERR_PNPM_IGNORED_BUILDS`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
