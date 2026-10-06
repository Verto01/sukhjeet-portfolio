# Implementation Plan: Journey Visualization System

## Overview

This plan breaks down the implementation of the journey visualization system that replaces the existing accordion component. The implementation follows a progressive enhancement approach: first removing old code, then building the HTML structure, styling with CSS, adding JavaScript interactivity, implementing accessibility features, and finally ensuring responsive behavior across all breakpoints.

## Tasks

- [x] 1. Remove existing accordion implementation
  - Delete all accordion-related HTML markup from the personal-note section
  - Remove all CSS rules for `.proof-card`, `.proof-summary`, `.proof-detail`, and accordion-specific classes
  - Remove JavaScript event listeners and functions controlling accordion behavior
  - Preserve the section ID `personal-note` and existing headline/paragraph content
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 2. Implement HTML structure for card grid and cards
  - [~] 2.1 Create card grid container with proper semantic markup
    - Add container div with class `journey-cards`
    - Apply `role="tablist"` and `aria-label="Journey steps"`
    - Create four step card button elements with `role="tab"`
    - Add `data-step` attributes (0-3) for state tracking
    - Set inline CSS custom properties for color hues (cyan, emerald, amber, rose)
    - _Requirements: 2.1, 2.2, 3.3, 3.4, 3.5, 3.6_
  
  - [~] 2.2 Add card content structure
    - Create decorative orb SVG with radial gradient for each card
    - Add card content div with number span, title h3, and description paragraph
    - Insert step data: "01 Discovery", "02 Planning", "03 Execution", "04 Delivery"
    - Include descriptive text for each step as specified in design
    - Add decorative illustration SVG placeholders with `aria-hidden="true"`
    - _Requirements: 2.1, 4.1, 4.2, 4.3_

- [ ] 3. Implement HTML structure for rail navigation system
  - [~] 3.1 Create rail system container and track
    - Add container div with class `journey-rail` and `role="none"`
    - Create rail track div with class `journey-rail-track` and `aria-hidden="true"`
    - Add rail nodes container with `role="tablist"` and `aria-label="Navigate journey steps"`
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [~] 3.2 Add rail nodes and travelling marker
    - Create four button elements with class `journey-rail-node` and `role="tab"`
    - Add `data-step` attributes (0-3) and `aria-label` for each node
    - Include screen reader text spans with class `sr-only`
    - Add travelling marker div with core and halo elements
    - Set initial `data-position="0"` on marker
    - _Requirements: 5.1, 5.4, 5.5, 10.5_

- [~] 4. Implement feedback loop SVG
  - Create SVG element with class `journey-feedback-loop`
  - Add `aria-hidden="true"`, `viewBox="0 0 1200 160"`, and `preserveAspectRatio="xMidYMid meet"`
  - Define linear gradient with color stops (rose→amber→emerald→cyan)
  - Draw closed loop path with curved corners using SVG path commands
  - Apply gradient stroke with dashed pattern (`stroke-dasharray="12 8"`)
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 5. Implement base CSS for card grid layout
  - [~] 5.1 Create grid layout with responsive breakpoints
    - Add CSS Grid with 4 columns on desktop (>900px)
    - Set container width to `min(1380px, calc(100% - 112px))`
    - Add 20px gap between cards
    - Implement single column layout for ≤900px breakpoint
    - Adjust container width to `calc(100% - 64px)` on mobile
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 15.1, 15.3, 15.4_
  
  - [~] 5.2 Style glass morphism cards
    - Apply semi-transparent white background `rgba(255, 255, 255, 0.45)`
    - Add `backdrop-filter: blur(12px)` with `-webkit-` prefix
    - Set border, border-radius (16px), and box-shadow for depth
    - Add `min-height: 380px` and padding `32px 28px`
    - Include fallback solid background for browsers without backdrop-filter support
    - Apply `contain: layout style paint` for performance isolation
    - _Requirements: 3.1, 3.2, 3.7, 3.8, 3.9, 21.1, 21.2_

- [ ] 6. Implement CSS for card color system and states
  - [~] 6.1 Create color hue custom properties
    - Define HSL color variables for each card using `data-step` attribute selectors
    - Cyan (step 0): `--h: 186; --s: 91%; --l: 44%`
    - Emerald (step 1): `--h: 161; --s: 84%; --l: 39%`
    - Amber (step 2): `--h: 38; --s: 92%; --l: 50%`
    - Rose (step 3): `--h: 348; --s: 89%; --l: 60%`
    - _Requirements: 3.3, 3.4, 3.5, 3.6_
  
  - [~] 6.2 Style active and hover states
    - Enhance active card with `background: rgba(255, 255, 255, 0.65)`
    - Add colored border using `hsla(var(--h), var(--s), var(--l), 0.5)`
    - Apply multi-layer box-shadow with color glow effect
    - Add `transform: translateY(-4px)` with `will-change: transform`
    - Style hover state with border color and subtle lift
    - Include transition properties (0.25s ease) for smooth state changes
    - _Requirements: 9.5_

- [ ] 7. Style decorative orbs and card content
  - [~] 7.1 Position and style SVG orbs
    - Position orb absolutely at `top: -40px; right: -40px`
    - Set width/height to 200px with `pointer-events: none`
    - Create radial gradient definitions for each color hue
    - Apply opacity 0.6 default, 1.0 on active card
    - Add smooth opacity transition (0.3s ease)
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [~] 7.2 Style card content hierarchy
    - Style card number with monospace font, 14px, bold (700)
    - Apply color using `hsla(var(--h), var(--s), var(--l), 1)`
    - Style title with 24px, bold (700), negative letter-spacing (-0.04em)
    - Style description with 15px, line-height 1.7, muted color
    - Add appropriate margins for visual hierarchy
    - Style decorative illustrations with responsive sizing
    - _Requirements: 4.4_

- [ ] 8. Implement CSS for rail navigation system
  - [~] 8.1 Style rail track and container
    - Position rail container with relative positioning and 64px height
    - Apply container width matching card grid
    - Add margin `48px auto 0` for spacing
    - Style track line at 2px height with gradient opacity on edges
    - Center track vertically using absolute positioning and transform
    - _Requirements: 5.3_
  
  - [~] 8.2 Style rail nodes and marker
    - Create flexbox layout for nodes with `justify-content: space-between`
    - Style nodes as 44px circles with transparent background
    - Add pseudo-element (::before) for 16px node indicator
    - Style active node with accent color and shadow ring
    - Add hover effects with scale transform (1.15)
    - Position travelling marker absolutely with centered transform
    - Style marker core (22px circle) with accent color and shadow
    - Add marker halo with radial gradient and scale(2) transform
    - _Requirements: 5.4, 5.5, 6.1, 6.2, 6.4, 10.3, 10.4, 10.5_

- [~] 9. Implement marker position system
  - Create CSS classes or data attributes for four marker positions
  - Calculate left positions: 5%, 35%, 65%, 95%
  - Add smooth transition with cubic-bezier(0.4, 0.0, 0.2, 1) easing
  - Set transition duration to 500ms
  - Apply `will-change: left` for performance optimization
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [~] 10. Style feedback loop SVG
  - Set display block with auto height
  - Apply width `min(1200px, 90%)` with auto margins
  - Add top margin of 72px
  - Set max-height to 160px
  - Ensure SVG scales responsively
  - _Requirements: 7.1, 7.4_

- [ ] 11. Implement JavaScript state management
  - [~] 11.1 Create state object and initialization
    - Define `journeyState` object with properties: activeStep, autoplayEnabled, autoplayTimer, isVisible, isPaused, pauseTimeout, prefersReducedMotion
    - Create `initializeState()` function to detect prefers-reduced-motion
    - Set `autoplayEnabled` to false if reduced motion is preferred
    - Define constants: AUTO_CYCLE_INTERVAL (2600), PAUSE_DURATION (8000), HOVER_RESUME_DELAY (1000)
    - _Requirements: 8.1, 19.1, 23.5_
  
  - [~] 11.2 Implement step control functions
    - Create `setActiveStep(newStep)` with input validation and clamping (0-3)
    - Implement `advanceStep()` to increment with wraparound (modulo 4)
    - Create `updateUIForActiveStep(stepIndex)` to sync all UI elements
    - Add bounds checking and type validation with error logging
    - _Requirements: 8.2, 22.1, 22.2_

- [ ] 12. Implement auto-cycle timer logic
  - [~] 12.1 Create timer control functions
    - Implement `startAutoplay()` to create setInterval with AUTO_CYCLE_INTERVAL
    - Add visibility and pause state checks before starting
    - Create `stopAutoplay()` to clear interval and reset timer reference
    - Implement `pauseAutoplay(resumeDelay)` with timeout for resume
    - Clear any existing pause timeout before creating new one
    - _Requirements: 8.1, 8.2, 8.4_
  
  - [~] 12.2 Handle timer lifecycle
    - Start timer only when component is visible and autoplay enabled
    - Stop timer when component leaves viewport
    - Pause timer on manual interaction with 8000ms resume delay
    - Never start timer when prefers-reduced-motion is active
    - _Requirements: 8.3, 8.4, 8.5, 19.1_

- [ ] 13. Implement click event handlers
  - [~] 13.1 Add card click handlers
    - Select all step cards with `querySelectorAll('.journey-card')`
    - Attach click event listener to each card
    - Extract step index from `data-step` attribute
    - Call `setActiveStep(stepIndex)` on click
    - Call `pauseAutoplay(8000)` on click
    - _Requirements: 9.1, 9.2, 9.3_
  
  - [~] 13.2 Add rail node click handlers
    - Select all rail nodes with `querySelectorAll('.journey-rail-node')`
    - Attach click event listener to each node
    - Extract step index from `data-step` attribute
    - Call `setActiveStep(stepIndex)` on click
    - Call `pauseAutoplay(8000)` on click
    - _Requirements: 10.1, 10.2_

- [~] 14. Implement keyboard navigation
  - Create `handleKeydown(event)` function for arrow key navigation
  - Check if focus is on card or rail node before processing
  - Handle ArrowRight/ArrowDown to advance step (with wraparound)
  - Handle ArrowLeft/ArrowUp to go to previous step (with wraparound)
  - Handle Home key to jump to step 0
  - Handle End key to jump to step 3
  - Call `pauseAutoplay(8000)` on any keyboard navigation
  - Implement `focusActiveElement()` to move focus after navigation
  - Add `event.preventDefault()` for all handled keys
  - Attach keydown listener to document
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 10.7_

- [ ] 15. Implement hover and focus pause behavior
  - [~] 15.1 Create hover pause handlers
    - Create `handleMouseEnter()` to stop autoplay and clear resume timeout
    - Create `handleMouseLeave()` to resume after HOVER_RESUME_DELAY (1000ms)
    - Attach mouseenter/mouseleave to journey-visualization container
    - Store hover resume timeout reference for cleanup
    - _Requirements: 11.1, 11.2_
  
  - [~] 15.2 Create focus pause handlers
    - Create `handleFocusIn()` to stop autoplay when component receives focus
    - Create `handleFocusOut(event)` to check if focus left component
    - Resume autoplay after 1000ms if focus moved outside
    - Attach focusin/focusout to journey-visualization container
    - _Requirements: 11.3, 11.4_

- [~] 16. Implement Intersection Observer for visibility tracking
  - Create `initializeIntersectionObserver()` function
  - Configure observer with threshold 0.1 (10% visible)
  - In callback, set `journeyState.isVisible` based on `entry.isIntersecting`
  - Start autoplay when component becomes visible (if enabled and not paused)
  - Stop autoplay when component leaves viewport
  - Observe the journey-visualization container element
  - _Requirements: 8.3, 8.4, 20.3, 20.4_

- [ ] 17. Implement UI update logic
  - [~] 17.1 Create card and rail UI update function
    - Loop through all cards and update `aria-selected` attribute
    - Add/remove `aria-current="step"` on active card
    - Loop through all rail nodes and update `aria-selected`
    - Update travelling marker `data-position` attribute
    - Ensure DOM updates are batched for performance
    - _Requirements: 9.5, 5.5, 6.1_
  
  - [~] 17.2 Create screen reader announcement system
    - Create live region div with `role="status"` and `aria-live="polite"`
    - Add `aria-atomic="true"` attribute
    - Apply `sr-only` class for visual hiding
    - Append to document body on initialization
    - Create `announceStepChange(stepIndex)` function
    - Clear and update live region text with 100ms delay
    - Format announcement: "Step X of 4: [Step Name]"
    - _Requirements: 13.6_

- [ ] 18. Implement ARIA attributes and roles
  - [~] 18.1 Add ARIA to card grid
    - Add `role="tablist"` to card container
    - Add `aria-label="Journey steps"` to card container
    - Add `role="tab"` to each card button
    - Add `aria-label="Step X of 4: [Title]"` to each card
    - Add `aria-selected` attribute (initially "true" for step 0)
    - Add `aria-controls` if content panels exist
    - _Requirements: 13.1, 13.2, 13.3_
  
  - [~] 18.2 Add ARIA to rail system
    - Add `role="none"` to rail container (decorative structure)
    - Add `role="tablist"` to rail nodes container
    - Add `aria-label="Navigate journey steps"` to nodes container
    - Add `role="tab"` to each rail node
    - Add `aria-label="Go to step X"` to each node
    - Add `aria-selected` attribute to nodes
    - Add `aria-hidden="true"` to decorative track and marker
    - _Requirements: 13.4, 13.5_
  
  - [~] 18.3 Add ARIA to decorative elements
    - Add `aria-hidden="true"` to all SVG orbs
    - Add `aria-hidden="true"` to card illustrations
    - Add `aria-hidden="true"` to feedback loop SVG
    - Ensure no focusable elements within hidden decorative SVGs
    - _Requirements: 4.2, 13.7_

- [~] 19. Add visible focus indicators
  - Style `:focus-visible` on cards with 2px solid accent outline
  - Set outline-offset to 4px for clear separation
  - Style `:focus-visible` on rail nodes with 2px solid accent outline
  - Apply border-radius to focus outline for visual consistency
  - Ensure focus indicators meet WCAG 2.1 contrast requirements
  - Test focus visibility on all interactive elements
  - _Requirements: 10.5_

- [~] 20. Implement spacing adjustments for section integration
  - Reduce hero section bottom padding to compensate for removed accordion
  - Adjust About section top padding as specified
  - Verify vertical rhythm remains consistent with other sections
  - Test spacing at all breakpoints (900px, 700px, 520px, 390px)
  - Ensure no excessive whitespace or cramped layouts
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [~] 21. Implement responsive CSS for 700px breakpoint
  - Reduce card grid horizontal padding to `calc(100% - 48px)`
  - Reduce card internal padding to `28px 24px`
  - Reduce card min-height to 320px
  - Scale card title to 21px
  - Scale card description to 14px
  - Reduce rail container height to 52px with 36px top margin
  - Scale rail nodes to 38px with 14px indicators
  - Scale travelling marker to 18px
  - Reduce feedback loop margin-top to 48px
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [~] 22. Implement responsive CSS for 520px breakpoint
  - Reduce card internal padding to `24px 20px`
  - Reduce card min-height to 280px
  - Scale SVG illustrations to 80px or hide
  - Reduce rail node size and spacing further
  - Adjust feedback loop stroke width and scale
  - Optimize text line-height for mobile reading
  - Hide rail system if specified in design
  - Hide feedback loop if specified in design
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 4.5_

- [~] 23. Implement responsive CSS for 390px breakpoint
  - Apply minimum viable padding to cards (20px 18px)
  - Ensure rail maintains 44px touch targets if visible
  - Scale or hide SVG illustrations to icon size
  - Ensure feedback loop fits within viewport boundaries
  - Verify text content readable without horizontal scrolling
  - Test on smallest target device (iPhone SE)
  - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

- [ ] 24. Implement prefers-reduced-motion support
  - [~] 24.1 Add CSS for reduced motion
    - Create media query for `@media (prefers-reduced-motion: reduce)`
    - Set all transition-duration to 0.01ms or none
    - Remove transform animations on cards
    - Disable marker transition completely
    - Set animation-iteration-count to 1
    - _Requirements: 19.2, 19.3, 6.5_
  
  - [~] 24.2 Disable JavaScript auto-cycle for reduced motion
    - Detect prefers-reduced-motion in `initializeState()`
    - Set `autoplayEnabled` to false when detected
    - Ensure timer never starts when reduced motion active
    - Allow manual navigation to function normally
    - _Requirements: 19.1, 19.4, 8.5, 11.5_

- [~] 25. Add performance optimizations
  - Apply `will-change: transform` only to active cards during transitions
  - Use `contain: layout style paint` on cards for isolation
  - Ensure all animations use transform and opacity only
  - Add debounced resize handler with 150ms delay (if needed)
  - Verify no layout thrashing during state updates
  - Test on low-powered devices or throttled CPU
  - _Requirements: 20.1, 20.2, 20.5, 20.6, 20.7_

- [~] 26. Add error handling and edge case management
  - Add input validation to `setActiveStep()` with type checking
  - Add NaN detection and default to 0
  - Add clamping logic for out-of-range values (0-3)
  - Add console warnings for invalid inputs
  - Handle rapid clicks with debouncing or state locking
  - Handle resize during animation gracefully
  - Ensure no errors when timer references are undefined
  - _Requirements: 22.1, 22.2, 22.3, 22.4_

- [~] 27. Implement graceful degradation
  - Test display with JavaScript disabled (cards should stack vertically)
  - Verify content readable without CSS
  - Add @supports fallback for backdrop-filter
  - Add @supports fallback for CSS Grid (use flexbox)
  - Test with intersection observer polyfill detection
  - _Requirements: 22.5, 22.6, 21.2, 21.3, 21.4_

- [~] 28. Code organization and documentation
  - Organize JavaScript into logical sections with comments
  - Define all magic numbers as named constants at top
  - Add JSDoc comments for main functions
  - Organize CSS into sections: layout, styling, states, responsive, animations
  - Use consistent naming conventions matching existing codebase
  - Add inline comments explaining complex logic
  - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5_

- [~] 29. Checkpoint - Manual testing across breakpoints
  - Test in Chrome DevTools device emulation for all breakpoints (900px, 700px, 520px, 390px)
  - Verify card grid layout switches correctly at each breakpoint
  - Verify rail system scales appropriately
  - Verify feedback loop adjusts correctly
  - Test on actual mobile devices if available
  - Ensure all tests pass, ask the user if questions arise
  - _Requirements: 24.1_

- [~] 30. Checkpoint - Keyboard and screen reader testing
  - Test Tab key navigation through all interactive elements
  - Test Arrow key navigation (left, right, up, down)
  - Test Home/End key navigation
  - Test Enter/Space activation on rail nodes
  - Verify focus indicators visible on all elements
  - Test with NVDA or VoiceOver for screen reader announcements
  - Verify ARIA live region announces step changes
  - Ensure all tests pass, ask the user if questions arise
  - _Requirements: 24.2, 24.3_

- [~] 31. Checkpoint - Accessibility validation
  - Run Lighthouse accessibility audit
  - Verify score meets or exceeds accordion baseline
  - Validate HTML with W3C validator
  - Validate CSS with W3C CSS validator
  - Check for console errors in browser
  - Verify WCAG 2.1 AA compliance
  - Ensure all tests pass, ask the user if questions arise
  - _Requirements: 24.4, 24.5, 24.6, 24.7_

- [~] 32. Final integration and polish
  - Verify auto-cycle starts when component enters viewport
  - Verify pause on hover/focus works correctly
  - Test manual override with 8s pause timing
  - Verify smooth transitions between all states
  - Test color system across all four cards
  - Ensure glass morphism effect renders correctly
  - Test on multiple browsers (Chrome, Firefox, Safari, Edge)
  - _Requirements: 21.3, 21.5, 21.6_

## Notes

- All tasks build incrementally: structure → styling → interactivity → accessibility → responsiveness
- Testing checkpoints ensure quality at major milestones
- Accessibility is integrated throughout, not added at the end
- Performance optimizations use CSS transforms and Intersection Observer
- Responsive design adapts gracefully at 5 breakpoints (900px, 700px, 520px, 390px)
- prefers-reduced-motion fully disables auto-cycling and animations
- Error handling ensures graceful degradation in edge cases
- Code follows existing codebase patterns for maintainability

## Task Dependency Graph

```json
{
  "waves": [
    {
      "id": 0,
      "tasks": ["1"]
    },
    {
      "id": 1,
      "tasks": ["2.1", "3.1", "4"]
    },
    {
      "id": 2,
      "tasks": ["2.2", "3.2", "5.1"]
    },
    {
      "id": 3,
      "tasks": ["5.2", "6.1", "8.1", "10"]
    },
    {
      "id": 4,
      "tasks": ["6.2", "7.1", "8.2", "9", "11.1"]
    },
    {
      "id": 5,
      "tasks": ["7.2", "11.2", "12.1", "18.1"]
    },
    {
      "id": 6,
      "tasks": ["12.2", "13.1", "17.1", "18.2"]
    },
    {
      "id": 7,
      "tasks": ["13.2", "14", "15.1", "16", "18.3"]
    },
    {
      "id": 8,
      "tasks": ["15.2", "17.2", "19", "20"]
    },
    {
      "id": 9,
      "tasks": ["21", "22", "23", "24.1", "25"]
    },
    {
      "id": 10,
      "tasks": ["24.2", "26", "27", "28"]
    },
    {
      "id": 11,
      "tasks": ["29"]
    },
    {
      "id": 12,
      "tasks": ["30"]
    },
    {
      "id": 13,
      "tasks": ["31"]
    },
    {
      "id": 14,
      "tasks": ["32"]
    }
  ]
}
```
