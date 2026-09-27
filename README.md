# QVAC Jargon Decoder

Paste a complex or jargon-heavy sentence or paragraph and an on-device AI decodes it into plain, everyday English — no technical terms, no legalese, no buzzwords. No cloud call, no API key.

## Run

```bash
npm install
npm start
```

Then open http://localhost:31005

## QVAC SDK version

`@qvac/sdk` ^0.19.0 (see `package.json`).

## How it works

Built on [Tether's QVAC SDK](https://www.npmjs.com/package/@qvac/sdk) — all inference runs on-device, no cloud call, no API key. The app loads `LLAMA_3_2_1B_INST_Q4_0` locally with `loadModel()`, generates with `completion()` (streamed via `tokenStream`), and releases the model with `unloadModel()` on shutdown.

`src/logic.js` explicitly instructs the model to keep its rewrite as general as the original when the source is abstract — small on-device models otherwise tend to "helpfully" invent a concrete scenario, number, or reason that was never in the input, which would misrepresent what was actually said. If the model's reply looks unusable (empty, or a refusal), the original text is returned unchanged.

## Example

- **Input:** `"We need to leverage our synergies to operationalize a paradigm shift in customer-facing deliverables."`
- **Output:** something like `"We need to work together better so we can change how we do things for customers."` — same claim, no invented specifics, in plain words a 12-year-old could follow.

## Setup

Requires Node.js and a machine that can run the QVAC on-device runtime (see the QVAC SDK docs for platform support). `npm install` pulls in `@qvac/sdk`; `npm start` loads the `LLAMA_3_2_1B_INST_Q4_0` model on first run, which can take a moment.

## License

MIT
