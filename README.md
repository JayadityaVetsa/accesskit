# AccessKit

**Fine print. Clear next step.**

A free browser-local workspace that converts notices into source-linked checklists, flags dates that need review, and exports an action plan. Built November 1, 2026 for Next Byte Hacks V5.

## Run

Requires Node.js 20+. No dependencies, API key, paid subscription, or build step.

```sh
npm start
# Open http://127.0.0.1:4173
npm test
```

Alternatively host `dist/` on any static web host. Module scripts need HTTP, rather than opening index.html directly as a file.

## Try it

1. Choose the Fellowship example.
2. Review two distinct deadline dates and the warning to confirm which applies.
3. Select View source on an item. The original line is highlighted.
4. Check an action, switch to Dates, and download the Markdown plan.
5. Try Food pantry. Notice the original exception about missing documents is retained.

All examples are fictional. No users or organizers were interviewed; no real-world impact metrics are claimed.

## Architecture

`dist/engine.js`: deterministic phrase classification, month-name date parsing, evidence offsets, uncertainty questions, Markdown and iCalendar exports.

`dist/app.js`: DOM rendering using textContent, optional localStorage, text-file import, progress tracking, accessible tab navigation, and downloads.

`dist/index.html` and `dist/style.css`: responsive keyboard-accessible interface with reduced-motion and print styles. No external assets, fonts, analytics, or runtime libraries.

All analysis occurs locally. No runtime calls send notice text to any API. The static host can still see ordinary page requests. Workspace persistence is opt-in. Clearing saved data removes only AccessKit's storage key.

## Limits

- This is rule-based extraction, not generative AI or an eligibility decision.
- The parser groups lines by phrase matches; it can miss information, produce duplicate items across categories, or misclassify a line.
- Use one instruction per line for best results. Numeric dates, non-English notices, tables, PDFs, and arbitrary website fetching are not supported.
- Date conflicts are potential ambiguities, not definitive errors. Yearless dates are not assigned guessed years.
- Calendar exports are confirmed all-day date reminders, not exact deadline timestamps.
- No field validation can prove a notice is accurate or current. Read the source and confirm with the organizer.
- Evaluation is an automated synthetic fixture suite, not a user study or benchmark accuracy claim.

## AI disclosure and attribution

OpenAI Codex generated and revised the implementation, tests, design, and draft submission copy under the entrant's direction. The product itself does not call an AI service. Entrant review and understanding are still needed before representing the project to judges. Do not describe synthetic examples as real research.

No third-party application code or media is bundled. Uses standard browser and Node.js APIs. MIT licensed.
