# Synapse Design System

## 1. Design direction

Synapse should look like a polished scientific instrument with a restrained cyberpunk layer.

Keywords:

- Spatial
- Scientific
- Focused
- Trustworthy
- Dark
- Glassmorphic
- Neon accents
- High information density without visual noise

Avoid:

- Excessive glow
- Random gradients
- Tiny labels
- Full-screen decorative animation
- Gamer UI clichés
- Status communicated only by color
- Low-contrast glass panels

## 2. Core tokens

```css
:root {
  --background: #020617;
  --background-elevated: #0f172a;
  --surface: rgba(15, 23, 42, 0.78);
  --surface-strong: rgba(30, 41, 59, 0.88);
  --border-neutral: rgba(148, 163, 184, 0.16);
  --border-active: rgba(34, 211, 238, 0.55);

  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;

  --accent-cyan: #22d3ee;
  --accent-violet: #8b5cf6;

  --status-gap: #ef4444;
  --status-review: #eab308;
  --status-mastered: #22c55e;
  --status-locked: #64748b;

  --radius-panel: 16px;
  --radius-control: 10px;
}
```

Use Tailwind equivalents where practical.

## 3. Layout

Desktop:

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Synapse | Document | View toggle | Progress | Upload               │
├──────────┬──────────────────────────────────────────┬───────────────┤
│ Tool rail│ Knowledge canvas                         │ Inspector     │
│          │                                          │ drawer        │
├──────────┴──────────────────────────────────────────┴───────────────┤
│ Current study path / status / session summary shortcut             │
└─────────────────────────────────────────────────────────────────────┘
```

- Header: approximately 64 px
- Tool rail: approximately 56–72 px
- Inspector: 360–440 px
- Canvas consumes remaining space
- Drawer overlays or becomes bottom sheet on narrow screens

## 4. Header

Left:

- Neural icon
- “Synapse”
- Optional subtitle: “Spatial Knowledge Twin”

Center:

- Preset/document selector
- 2D Path / 3D Galaxy segmented control

Right:

- Mastery progress
- Upload PDF/Text
- Session summary
- Settings

Header should remain visually quieter than the selected node.

## 5. Graph status semantics

### Gap

- Red outer ring
- Broken-circle or alert icon
- Text label “Gap”
- Strongest when selected

### Review

- Yellow ring
- Half-filled circle or clock icon
- Text label “Review”

### Mastered

- Green ring
- Check icon
- Text label “Mastered”

### Locked

- Slate
- Lock icon
- Dashed border/edge
- Text label “Locked”

## 6. Interaction emphasis

Strong glow is reserved for:

- Selected concept
- Newly mastered concept
- Active repair path
- Brief edge pulse after verification
- Primary call to action

Do not glow every border.

## 7. Inspector hierarchy

1. Breadcrumb and cluster
2. Concept title
3. Status and mastery percentage
4. One-sentence summary
5. Formula card when present
6. Source card with page and excerpt
7. Relationship/prerequisite chips
8. Active-recall question
9. Response text area
10. Verify Knowledge button
11. Feedback panel
12. Repair Path action

The source card must visually separate source evidence from AI-generated explanation.

## 8. Motion

Use subtle transitions:

- Drawer: 180–240 ms
- Selection glow: brief
- Camera focus: smooth but not slow
- Edge pulse: 600–1,000 ms
- Confetti: only for major milestones

Respect `prefers-reduced-motion`. In reduced-motion mode:

- No continuous force movement after layout
- No confetti
- No large camera fly-through
- Replace pulses with static highlights

## 9. Accessibility

Required:

- Keyboard-operable view toggle and controls
- Visible focus rings
- Drawer focus management
- Escape closes modal/drawer where appropriate
- Semantic labels for graph controls
- Status has icon and text
- Minimum reasonable contrast
- Text areas and buttons have labels
- Error messages are associated with fields
- Canvas interactions have an accessible parallel list/search pathway

A graph canvas alone is not accessible. Search results or concept lists must allow keyboard selection.

## 10. Responsive behavior

Desktop is the primary judged experience.

Tablet/mobile:

- Inspector becomes bottom sheet or full-screen panel
- Tool rail collapses
- Header controls compress
- 3D may default to 2D on resource-constrained devices
- Upload and study loop remain functional
