# README Asset Checklist

The public README intentionally contains no screenshot references until the corresponding assets are captured from the actual application. This prevents broken links and fabricated product imagery.

## Capture requirements

- Use the committed Version 1.0 application with the Machine Learning preset.
- Capture at a desktop viewport of at least 1280×720 unless a different viewport is specified.
- Do not include browser bookmarks, personal account details, private URLs, API keys, terminal windows, or local filesystem paths.
- Keep text legible at GitHub README width.
- Use lossless PNG for UI detail or high-quality WebP when file size is materially lower.
- Add meaningful alt text when each asset is embedded in `README.md`.
- Verify every final relative path and filename with exact case.

## Required screenshots

| README panel         | Target file                                          | State to capture                                                                                 | Suggested size |
| -------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------- |
| Hero / 3D Galaxy     | `docs/assets/readme/hero-3d-galaxy.webp`             | Machine Learning preset in 3D, graph settled, no inspector obscuring the graph                   | 1440×900       |
| 2D prerequisite Path | `docs/assets/readme/2d-prerequisite-path.webp`       | Backpropagation selected in 2D with readable prerequisite edges                                  | 1440×900       |
| Inspector evidence   | `docs/assets/readme/inspector-formula-citation.webp` | Backpropagation formula, page 12 citation, section, excerpt, and relationships visible           | 1440×900       |
| Verification result  | `docs/assets/readme/correct-mastery-update.webp`     | Documented Backpropagation answer scored correct and Mastered status visible                     | 1440×900       |
| Repair Path          | `docs/assets/readme/repair-path.webp`                | Vanishing Gradients selected with diagnosed path, explanations, and Start repair action visible  | 1440×900       |
| Upload flow          | `docs/assets/readme/upload-local-pdf.webp`           | PDF tab open with deterministic mode and privacy explanation visible; no private filename        | 1200×800       |
| Session summary      | `docs/assets/readme/session-summary.webp`            | At least one completed attempt, evidence distribution, highest-risk gap, and next action visible | 1200×800       |
| Responsive study     | `docs/assets/readme/mobile-inspector.webp`           | 390×844 viewport with the concept inspector rendered as a usable bottom sheet                    | 390×844        |

## Optional motion asset

| Asset                          | Target file                                | Content                                                                     | Limit                                      |
| ------------------------------ | ------------------------------------------ | --------------------------------------------------------------------------- | ------------------------------------------ |
| Core-loop GIF or video preview | `docs/assets/readme/synapse-core-loop.gif` | 3D/2D switch, answer submission, mastery change, and Repair Path activation | Under 12 seconds; optimize for GitHub size |

## Final insertion checks

- [ ] Every listed file exists in the repository.
- [ ] Images show implemented functionality only.
- [ ] No screenshot includes secrets, private data, local paths, or unverified deployment URLs.
- [ ] Captions describe the learning outcome, not just the screen.
- [ ] Mobile and desktop assets are sharp at GitHub-rendered width.
- [ ] `README.md` uses repository-relative paths and useful alt text.
- [ ] All image links pass the repository link checker.
