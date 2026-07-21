# Synapse Three-Minute Demo Video Plan

## Principle

Use a deterministic golden path. Show only features that have passed the preflight checklist. Do not conceal a failure by editing the product to appear to perform an action it did not perform. It is appropriate to avoid unstable optional paths and to record multiple clean takes.

Target final runtime: **2:42-2:52**.

## Assets

- Deployed Synapse build
- `Synapse_Sample_Neural_Networks.pdf`
- Machine Learning preset as backup
- Browser at 1440x900 or 1920x1080
- Clean browser profile with notifications disabled
- Microphone recording at consistent volume
- No copyrighted music
- Optional title card made from your own product UI

## Preflight gate

Record only after all items pass:

- Preset loads in under a few seconds
- 2D/3D toggle preserves selection
- Backpropagation correct-answer fixture works
- Vanishing Gradients partial-answer fixture works
- Repair Path highlights the intended prerequisites
- Reload preserves mastery
- Sample PDF produces a useful graph
- API failure fallback is usable
- No high-severity console error appears
- The deployed URL is accessible without your local development environment

If PDF generation is slower or less reliable than the preset, record the PDF upload once, then cut to the completed generated graph with an honest caption such as “Generated from the uploaded chapter.”

## Recording sequence and narration

### 0:00-0:12 - Title and problem

**Record**
- Open on a clean Synapse hero/workspace shot.
- Slowly reveal the Machine Learning galaxy.

**Narration**
“Dense educational material is linear, but understanding is interconnected. Students can reread a chapter without knowing which missing prerequisite is causing the confusion.”

### 0:12-0:32 - Product definition

**Record**
- Rotate the 3D Galaxy once.
- Hover two clusters.
- Avoid excessive zooming.

**Narration**
“Synapse is a Spatial Knowledge Twin. It converts educational material into a source-grounded concept graph, while maintaining a second model of what the learner appears to know.”

### 0:32-0:50 - Same graph, two learning modes

**Record**
- Select Backpropagation in 3D.
- Switch to 2D Path.
- Keep the inspector open and selection preserved.

**Narration**
“The 3D Galaxy gives a high-level mental model. The 2D Path exposes readable prerequisite structure. Both views use the same canonical graph and learner state.”

### 0:50-1:12 - Source-grounded inspector

**Record**
- Show Backpropagation title, formula, page citation, source excerpt, and prerequisites.
- Briefly hover or click the Chain Rule relationship.

**Narration**
“Each concept includes an explanation, formula, page-level evidence, and the relationships that justify its position in the graph. Here, Backpropagation depends on the Chain Rule and a computational graph.”

### 1:12-1:37 - Correct active recall

**Enter**
“Backpropagation uses the chain rule to combine local derivatives backward through each layer, producing the gradient of the loss with respect to each weight.”

**Record**
- Click Verify Knowledge.
- Show correct verdict.
- Show mastery increase and graph status transition.
- Keep the cursor still during the animation.

**Narration**
“Synapse tests free-response recall instead of passive recognition. This answer covers the required mechanism, so mastery increases and the concept state updates across the graph.”

### 1:37-2:03 - Partial answer and Repair Path

**Record**
- Select Vanishing Gradients.
- Enter: “The gradients become small.”
- Verify.
- Show partial verdict and targeted missing idea.
- Click Repair My Understanding.

**Narration**
“A vague answer is not treated as fully correct. Synapse identifies the missing mechanism: repeated multiplication by small derivatives. It then traces the likely prerequisite gap and creates a focused Repair Path.”

### 2:03-2:24 - Upload sample PDF

**Record**
- Open Upload PDF/Text.
- Select `Synapse_Sample_Neural_Networks.pdf`.
- Show truthful processing stages.
- Cut to the generated graph if generation takes too long, with a visible caption: “Generated from the uploaded PDF.”

**Narration**
“PDF text is extracted locally with page boundaries preserved. GPT-5.6 then returns a schema-validated, source-grounded graph through a server-side route. If the AI endpoint is unavailable, the demo remains usable through deterministic fallback data.”

### 2:24-2:43 - Technical implementation

**Record**
- Briefly show session summary or architecture panel.
- Optionally insert a clean repository screenshot showing tests, not private keys or terminal clutter.

**Narration**
“Codex accelerated the architecture, TypeScript implementation, graph algorithms, testing, and release verification. The application combines React, React Flow, a Three.js force graph, PDF.js, Zod validation, IndexedDB persistence, and a probabilistic learner model.”

### 2:43-2:52 - Impact close

**Record**
- Return to Repair Path or a clean 3D overview.
- End on product name and one-line value proposition.

**Narration**
“Synapse does not only generate study material. It shows what the learner understands, why a gap exists, and what to repair next.”

## Editing rules

- Use hard cuts and short dissolves only.
- Do not speed up cursor motion so much that actions become unverifiable.
- Keep UI text readable.
- Show the correct answer being entered or already visible before verification.
- Use captions for key terms: Source-grounded, Active Recall, Learner Twin, Repair Path.
- Keep any cut between upload and generated graph explicit.
- Remove notifications, unrelated tabs, local file paths, API keys, and console windows.
- Do not use copyrighted background music.

## Safe omissions

Omit these from the public video unless they are fully stable:

- Scanned handwriting OCR
- Very large PDFs
- Mobile 3D interaction
- Optional providers not used in the final deployment
- Developer-only toggles
- Raw prompt text
- Internal build diary and unfinished roadmap experiments

## Backup plan

Record three isolated clips before the final take:

1. Correct Backpropagation verification
2. Partial Vanishing Gradients verification plus Repair Path
3. Successful sample-PDF graph generation

These clips can replace a failed live segment without misrepresenting the product.
