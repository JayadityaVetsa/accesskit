# AccessKit — fine print, clear next step

**[Watch the 2:05 captioned demo video](https://accesskit-evidence-workspace.trimaloes.chatgpt.site/watch)** · **[Try the working app](https://accesskit-evidence-workspace.trimaloes.chatgpt.site/)** · **[Source code](https://github.com/JayadityaVetsa/accesskit)**

The video is hosted directly on the project site and uses screenshots of the working app. It has burned-in captions and no audio.

## Elevator pitch
Turn complicated notices into source-linked checklists. Spot conflicting dates, preserve exceptions, and take a clear action plan with you. Free, private, and entirely in your browser.

## Inspiration
An opportunity can be technically available and still be hard to access. Long notices bury requirements across paragraphs; exceptions and inconsistent dates make the next step unclear. AccessKit explores a small intervention: put actionable details beside the evidence, without making users pay for an AI service or send personal text to a server.

This is a design hypothesis, not a validated claim from user interviews.

## What it does
Paste a notice or import plain text. AccessKit creates a checklist grouped by eligibility, documents and actions, costs and support, and access details. Every item retains its original wording and links to its source line. Date review surfaces missing years, relative dates, missing time zones, and different apparent deadlines. Users can track progress, download Markdown, print, copy organizer questions, and export confirmed all-day calendar reminders. Saving on the device is optional.

## How we built it
Vanilla JavaScript, HTML, CSS, browser localStorage and Blob downloads. A deterministic extraction engine uses phrase rules and source offsets. The date parser validates month/day combinations without inventing years. The interface renders notice content as text, not injected HTML. The app has no external runtime dependencies, model API, paid services, or required account.

OpenAI Codex generated and revised the implementation, tests, design, and submission materials under the entrant's direction. AI assistance is disclosed; the running application is rule-based, not an LLM.

## Challenges
Simplification can erase conditions. We preserve original sentences and explicitly flag conditional and negative wording. Two dates can refer to different stages rather than a true contradiction, so the interface asks for confirmation instead of selecting a winner. Avoiding paid services also means accepting a bounded English-language phrase parser rather than claiming broad document understanding.

## Accomplishments
A working local analysis flow with traceable evidence, private opt-in persistence, accessible keyboard tabs, responsive layouts, and portable exports. Ten automated tests pass for evidence offsets, different deadlines, exceptions and negation, invalid/yearless dates, recurring dates, absent deadlines, Markdown exports, calendar boundary rollover, empty input, and multiple dates per line. These are synthetic tests, not a measured extraction accuracy benchmark.

## What we learned
Uncertainty belongs in the interface. A useful plan should make missing information easier to ask about, and let a user inspect the original wording immediately.

## What's next
Test with students and community service navigators, measure completion time and missed requirements against reading the original notice, improve line segmentation and numeric-date parsing, and validate multilingual support. These are planned, not completed.

## Built with
JavaScript, HTML5, CSS3, Node.js, localStorage, iCalendar, OpenAI Codex.
