# Repository Guidelines

## Project Structure & Module Organization
Static Campus Store POS using HTML, CSS, and vanilla JavaScript.
- `index.html` defines the product selection and current-order interface.
- `css/style.css` contains design tokens, layout, responsive styles, and focus states.
- `js/products.js` defines product IDs, names, and prices.
- `js/app.js` renders products and manages cart quantities, removal, totals, and accessibility feedback.
- `assets/` holds visual assets; `.agents/skills/` and `.codex/skills/` contain contributor skills.

Load `products.js` before `app.js`; keep catalog and interaction logic separate.

## Build, Test, and Development Commands
No package manager, build pipeline, or automated test runner is configured.
- Open `index.html` directly in a browser.
- `python -m http.server 8000`: serve locally at `http://localhost:8000` (requires Python).
- `node --check js/app.js` and `node --check js/products.js`: check syntax (requires Node.js).
- `git diff --check`: check whitespace before committing.

## Coding Style & Naming Conventions
Use four-space indentation, `const` where possible, semicolons, double-quoted JavaScript strings, and camelCase functions/variables. Use kebab-case CSS classes and HTML IDs. Reuse CSS custom properties. No formatter or linter is configured.

Use native buttons, accessible labels, and `textContent`. Preserve keyboard focus and live cart announcements.

## Required UI Skill Workflow
For UI design, implementation, review, or accessibility changes, read and apply [.agents/skills/ui-ux-pro-max/SKILL.md](.agents/skills/ui-ux-pro-max/SKILL.md) alongside [.codex/skills/frontend-skill/SKILL.md](.codex/skills/frontend-skill/SKILL.md). These are skills, not autonomous subagents. Skip design searches for non-UI tasks.

- Inspect existing markup, styles, and behavior. Keep vanilla HTML/CSS/JavaScript; use domain guidance without assuming Tailwind or React.
- For focused changes, run a relevant local search, for example: `python .agents/skills/ui-ux-pro-max/scripts/search.py "touch target spacing" --domain ux -n 2`. Use the absolute script path when outside the repository root.
- Use `--design-system` for new pages or broad visual direction. Check result relevance; retry off-topic searches once. Read existing design-system files before persisting; never use `--force` without explicit authorization.
- Prioritize readable prices, clear totals, visible focus, and touch controls at least 44 CSS pixels with 8px gaps as project design targets. Reuse existing tokens. Consult `references/quick-reference.md` for applicable web guidance.

## Testing Guidelines
Application testing is manual; no coverage threshold exists. Verify repeated additions, quantity changes, removal at quantity one, explicit removal, and accurate peso totals. Check empty-cart feedback, keyboard focus, all six products, narrow layouts, and absence of horizontal overflow. Verify Continue opens order review, Escape/Back closes it, and focus returns to Continue. Payment is unavailable. Skill-script tests are separate from application tests.

## Commit & Pull Request Guidelines
Use short, action-oriented subjects, following history: `Implement cart and quantity controls`. PRs should explain changes, list verification, link relevant issues, and include screenshots for visible UI changes.
