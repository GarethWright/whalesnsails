# Whales & Sails
A child-friendly browser arcade game with six playable whales and three pirate boss stages.

## Play locally

```sh
npm install
npm run dev
```
Open http://127.0.0.1:5173. `npm run build` creates the production site in `dist`.

Arrow keys / WASD swim, Space breaches, J rams, K performs a breaching tail strike, L fires rising bubbles. P pauses. Touch movement and attack buttons are also available. Surface to refill air, attack to escape nets, collect pearls and temporary shields, speed boosts and double-damage stars. Gentle mode starts enabled and assists with air and retries. Select any whale before or during play.

- Orca: stronger ram
- Humpback: strongest tail attack
- Minke: fast swimming and one-hit net escape
- Fin: fastest swimming
- Blue: five bubbles per blast and longest air capacity
- Gray: longer protection after being hit

## Asset pipeline

The reef background was generated through Magnific MCP (Seedream 5 Pro, 75 credits). Source: https://www.magnific.com/app/creation/ovrkP1R829 . Downloaded artwork is stored locally; no image service is needed at runtime.

All six whale animations were created through the requested https://github.com/ODU33104/rive-mcp MCP server. `scripts/build-whales.mjs` connects to that server using the MCP SDK, imports original SVG artwork, creates `.riv` animation files, and exports transparent animated sprite sheets. The game plays the Rive-rendered sheets on a canvas for consistent collision timing. Rive is the animation authoring pipeline; the JavaScript canvas loop implements gameplay. Editable SVGs, scene specs, `.riv` files and sprite sheets are in `public/assets`. `npm run assets` rebuilds them (requires Chrome or another browser supported by rive-mcp).

The whales have species-specific silhouettes, markings, shaded bodies, articulated tail/flipper rigs and blinks. Each Rive file contains swim, ram and tail animations, exported as 36-frame sheets. Swimming uses eased acceleration, breaches have anticipation and an arced landing, and defeated boats tip and sink with splash rings. Tail whacks coil underwater, rise into a full ballistic breach, rotate into a descending tail strike, and re-enter with a splash; damage is delayed until the tail touches a boat. The three stages use the same reef artwork with different colour treatments. Audio is synthesized locally after interaction. Fonts use Google Fonts with local system fallbacks.

## Checks

`npm test` checks breathing, whale combat strengths and level definitions. With the dev server running, `node scripts/smoke.mjs` checks keyboard actions, selection, help and phone layout in Chrome. `node scripts/playthrough.mjs` plays through all three stages using normal controls and a accelerated browser clock.

`node scripts/tail-breach-test.mjs` verifies the complete tail attack, including no immediate damage, full airborne clearance, contact damage, and underwater landing.

## Publish to Cloudflare

The live game is served at https://whales.garethwright.com using Workers Static Assets.

```sh
npx wrangler login
npm run deploy
```

`wrangler.jsonc` defines the account, static build directory, and custom domain. The deployment uploads the game and runtime art; editable Rive sources and review images stay in the repository. A GitHub push does not automatically deploy; run `npm run deploy` after changes.
