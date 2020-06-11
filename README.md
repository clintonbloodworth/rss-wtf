# WTF

RSS reader with sync and end-to-end encryption.

## Motivation

To see what a highly structured, moderately complex Svelte app with persistent 
state would look like.

## Setup

1. `$ npx vercel --local-config server/vercel.json && npx vercel env pull`
1. `$ npm run bootstrap`
1. `$ npm start`

## Screenshots
![Home](/home.png?raw=true)

<p></p>

![App](/app.png?raw=true)

<p></p>

## Technologies

- [Ava](https://github.com/avajs/ava)
- [ESLint](https://eslint.org)
- [Lerna](https://lerna.js.org)
- [PostCSS](https://postcss.org)
- [Prettier](https://prettier.io)
- [Stylelint](https://stylelint.io)
- [Svelte](https://svelte.dev)
- [Userbase](https://userbase.com)
- [Vercel](https://vercel.com)
- [Webpack](https://webpack.js.org)

## Architecture

WTF is a single-page app rendered entirely on the client. Server-side rendering is eschewed because:

- So much device-specific state is persisted client-side. 
- User feeds are end-to-end encrypted, leaving little that can be rendered on the server.
- This is a portfolio project where SEO doesn't come into play.

### Directory Structure

#### `client/components`
Components that are used by more than one view.

#### `client/jobs`
Scripts that run on a schedule.

#### `client/layouts`
Components used to share high-level design (and maybe a bit of functionality) between views.

#### `client/library`
Scripts used by more than one component, view, or whatever.

#### `client/mixins`
Purely stylistic components.

#### `client/router`
Adds base styling and handles routing.

#### `client/stores`
Stores are Svelte stores. They:

- Are used to be share state between two otherwise decoupled components.
- Implement `library/store`, which fulfills the [Svelte Store Contract](https://svelte.dev/docs#Store_contract)
and handles writing to memory or disk.

#### `client/views`
Views are the things the router routes to. They:

- Are made of components and layouts but not of each other.
- Can have their own components.

#### `server/library`
Same as `client/library` but for the server. These scripts are shared between endpoints.

### Lerna
Lerna isn't used for its primary purpose, which is to share packages among projects in a monorepo.
Instead, Lerna is used almost gratuitously: as a way to run NPM scripts from the top level of the 
repository without mucking with shell scripts.

### Tips

#### Don't Needlessly Share
If a component or script is used only by a single view, keep it where it is in either `views/[view]/components` or `views/[view]/library`. 
Keeping things closes to where they're reduces clutter in top-level directory and signals to others how widely a thing is used.

#### Prefer The Server
The client has enough to do and download. As an example, take [article ID generation](https://github.com/clintonbloodworth/rss.wtf/blob/stable/server/api/articles.js#L111).

Unlike article content retrieval, which we have to do on the server because of Cross-Origin restrictions, ID generation is something we _could_ do on the client.
But doing it on the server saves on bytes and CPU time. Do it once on the server and let Zeit cache it. 

Preferring the server can also simplify [the client implementation](https://github.com/clintonbloodworth/rss.wtf/blob/stable/client/source/views/app/articles/index.svelte#L223)
and reduce the jank that might come from processing a large batch of articles. 
Using a worker is an option. But why when it can be done simply on the server?
