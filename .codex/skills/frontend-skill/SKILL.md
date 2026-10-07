---
name: frontend-skill
description: Use this skill when designing, improving, reviewing, or refactoring the touchscreen frontend UI of the IT415 POS Kiosk project.
---

# Frontend Skill

## Purpose

Use this skill for frontend design work in the IT415 Touchscreen POS Kiosk System.

The goal is to create a clean, modern, touchscreen-friendly POS interface that is simple enough for a BSIT student to understand and maintain.

## Design priorities

Prioritize:

- Clear visual hierarchy
- Large touchscreen targets
- Simple navigation
- Strong readability
- Consistent spacing
- Responsive layout
- Good contrast
- Minimal typing
- Clear feedback for user actions
- Consistent buttons, typography, and spacing

## POS-specific UI rules

The interface should feel like a real self-service kiosk.

Product cards should:

- Be large enough for touch interaction
- Clearly display the product name
- Clearly display the price
- Use consistent dimensions
- Have visible hover, focus, and pressed states

The order/cart panel should:

- Be easy to distinguish from the product area
- Clearly show an empty-cart state
- Have enough space for future cart items
- Clearly display the order total
- Keep the primary Continue button easy to find

## Layout

For larger screens:

- Product selection should occupy the majority of the screen
- Current Order should appear as a clear side panel

For smaller screens:

- Allow the layout to stack vertically
- Avoid horizontal overflow
- Keep touch controls comfortably sized

## Styling

Use:

- HTML5
- CSS3
- Vanilla JavaScript

Prefer:

- CSS variables for reusable design tokens
- Consistent spacing values
- Rounded corners used consistently
- Subtle shadows only where they improve hierarchy
- One primary accent color
- Neutral backgrounds
- Clear typography

Avoid:

- Excessive gradients
- Excessive animation
- Too many colors
- Tiny buttons
- Dense menus
- Decorative elements that make the kiosk harder to use
- Unnecessary cards
- Overly complicated visual effects

## Accessibility

Ensure:

- Good text/background contrast
- Visible keyboard focus states
- Buttons have understandable labels
- Interactive elements are actual buttons when appropriate
- Text is readable at normal viewing distance
- Touch targets are comfortably large

## Code quality

Before changing the frontend:

1. Inspect the existing HTML and CSS.
2. Preserve working functionality.
3. Reuse existing structure where reasonable.
4. Avoid unnecessary frameworks or dependencies.

When editing:

- Keep HTML semantic.
- Keep CSS organized.
- Avoid excessive inline styles.
- Avoid duplicate CSS rules.
- Use meaningful class names.
- Keep JavaScript separate from visual styling unless interaction requires it.

## Scope

This skill is for frontend/UI work only.

Do not implement:

- Payment processing logic
- Cart calculation logic
- Database functionality
- Authentication
- Backend APIs
- Transaction persistence

unless the task explicitly asks for those features.

## Definition of done

Before finishing a frontend task, verify:

- The interface loads without obvious layout errors.
- At least six products remain visible.
- Product names and prices remain readable.
- Buttons are large and touch-friendly.
- The layout works on desktop and narrower screens.
- There is no unwanted horizontal scrolling.
- Existing functionality has not been broken.
- The UI remains appropriate for a POS kiosk.
