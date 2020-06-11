# Server

## Setup

1. `$ npx vercel`

### Enviromental Variables

Environmental variables in Vercel are a little screwy.
Secret environmental variables can't be used locally.
And non-secret are empty locally, even when set using the UI.
Meanwhile, there's no way using `vercel.json` to vary environmental variables based on branch.
So we're stuck using both `vercel.json` for locally environmental variables and the UI for non-local ones.st
