// QVAC Jargon Decoder — core logic.
// completion() rewrites a jargon-heavy sentence/paragraph into plain English.

import { completion } from "@qvac/sdk";

function looksUnusable(text) {
  if (!text || text.trim().length === 0) return true;
  const bad = ["i cannot", "i can't", "as an ai", "i'm not able", "i am not able"];
  const lower = text.toLowerCase();
  return bad.some((phrase) => lower.includes(phrase));
}

function stripPreamble(text) {
  return text
    .trim()
    .replace(/^(here'?s|here is)[^:\n]*:\s*/i, "")
    .replace(/^plain english( version)?:\s*/i, "")
    .replace(/^in plain english,?\s*/i, "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .trim();
}

export async function decodeJargon(modelId, text) {
  const run = completion({
    modelId,
    history: [
      {
        role: "system",
        content:
          "You translate jargon-heavy, technical, or overly complex sentences into plain, " +
          "everyday English that a 12-year-old could understand. Use short sentences and common " +
          "words. Keep the same meaning and facts exactly — never invent a specific scenario, " +
          "reason, amount, or detail that isn't stated in the original. If the original is " +
          "abstract or general, keep your version equally general instead of making up a " +
          "concrete example. Reply with ONLY the plain-English version, no preamble, no notes.",
      },
      { role: "user", content: text },
    ],
    stream: true,
    completionOpts: { temperature: 0.3, maxTokens: Math.max(150, Math.ceil(text.length / 2)) },
  });

  let raw = "";
  for await (const token of run.tokenStream) raw += token;
  let plain = stripPreamble(raw);

  if (looksUnusable(plain)) plain = text;

  return { plain };
}
