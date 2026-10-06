# Design Document: Journey Visualization System

## Introduction

This document describes the architecture and design of the Journey Visualization System, an interactive component that replaces the existing accordion-based "A PERSONAL NOTE" section. The system features four glass-morphism step cards with distinctive color hues, a rail navigation system with a travelling marker, and an SVG feedback loop. It supports automatic cycling through steps with manual override capabilities while maintaining full accessibility standards.

The design prioritizes performance (CSS transforms only), accessibility (WCAG 2.1 AA compliance), and responsive adaptation across all viewport sizes. The component integrates seamlessly with the existing codebase's theme system and follows established patterns for consistency.

## Architecture Overview

### Component Structure

The Journey Visualization System follows a layered architecture:

```
Journey Visualization System
├── Presentation Layer (HTML/CSS)
│   ├── Card Grid Container
│   │   └── Step Cards (4) with Glass Morphism
│   ├── Rail Navigation System
│   │   ├── Rail Line
│   │   ├── Rail Nodes (4)
│   │   └── Travelling Marker
│   └── Feedback Loop (SVG)
├── State Management Layer (JavaScript)
│   ├── Active Step State (0-3)
│   ├── Timer State Management
│   └── Visibility Tracking
└── Interaction Layer (Event Handlers)
    ├── Click Handlers (Cards, Nodes)
    ├── Keyboard Navigation
    ├── Hover/Focus Pause Logic
    └── Intersection Observer
```

### Design Principles

1. **Performance-First**: All animations use CSS `transform` and `opacity` only. No `backdrop-filter` or `blur` animations.
2. **Progressive Enhancement**: Core content accessible without JavaScript; interactions enhance the experience.
3. **Accessibility-Native**: ARIA attributes, keyboard navigation, and screen reader support built in from the start.
4. **Theme Integration**: Reuses existing CSS custom properties (`--accent`, `--muted`, `--ink`, `--border`, `--soft-blue`).
5. **Responsive by Default**: Mobile-first approach with graceful enhancement for larger screens.

## Core Components

### 1. Card Grid & Step Cards

**Purpose**: Display four distinct journey steps with visual hierarchy and glass morphism styling.

#### HTML Structure

```html
<div class="journey-cards" role="tablist" aria-label="Journey steps">
  <button class="journey-card" 
          role="tab"
          aria-label="Step 1 of 4: Discovery"
          aria-selected="true"
          aria-controls="journey-content-0"
          data-step="0"
          style="--h: 186; --s: 91%; --l: 44%;">
    <!-- Decorative SVG orb (cyan hue) -->
    <div class="journey-card-orb" aria-hidden="true">
      <svg viewBox="0 0 200 200">
        <defs>
          <radialGradient id="orb-cyan">
            <stop offset="0%" stop-color="rgba(6,182,212,0.4)" />
            <stop offset="100%" stop-color="rgba(6,182,212,0)" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="80" fill="url(#orb-cyan)" />
      </svg>
    </div>
    
    <!-- Card content -->
    <div class="journey-card-content">
      <span class="journey-card-number">01</span>
      <h3 class="journey-card-title">Discovery</h3>
      <p class="journey-card-description">Understanding your unique needs and goals through collaborative exploration.</p>
    </div>
    
    <!-- Decorative illustration -->
    <svg class="journey-card-illustration" aria-hidden="true" viewBox="0 0 120 120">
      <!-- Abstract geometric shapes in cyan theme -->
    </svg>
  </button>
  
  <!-- Cards 2-4 with emerald, amber, rose hues -->
</div>
```

#### CSS Architecture

```css
/* Grid Layout - Responsive */
.journey-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  width: min(1380px, calc(100% - 112px));
  margin-inline: auto;
}

@media (max-width: 900px) {
  .journey-cards {
    grid-template-columns: 1fr;
    width: calc(100% - 64px);
  }
}

/* Glass Morphism Card */
.journey-card {
  position: relative;
  min-height: 380px;
  padding: 32px 28px;
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(228, 231, 236, 0.8);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(17, 24, 39, 0.06);
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  overflow: hidden;
  text-align: left;
}

/* Color Hue Modifiers using CSS Custom Properties */
.journey-card[data-step="0"] {
  --h: 186; --s: 91%; --l: 44%; /* cyan #06b6d4 */
}

.journey-card[data-step="1"] {
  --h: 161; --s: 84%; --l: 39%; /* emerald #10b981 */
}

.journey-card[data-step="2"] {
  --h: 38; --s: 92%; --l: 50%; /* amber #f59e0b */
}

.journey-card[data-step="3"] {
  --h: 348; --s: 89%; --l: 60%; /* rose #f43f5e */
}

/* Active State with Color Enhancement */
.journey-card[aria-selected="true"] {
  background: rgba(255, 255, 255, 0.65);
  border-color: hsla(var(--h), var(--s), var(--l), 0.5);
  box-shadow: 
    0 0 0 2px hsla(var(--h), var(--s), var(--l), 0.15),
    0 8px 32px rgba(17, 24, 39, 0.12);
  transform: translateY(-4px);
  will-change: transform;
}

.journey-card:hover:not([aria-selected="true"]) {
  border-color: rgba(37, 99, 235, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 6px 28px rgba(17, 24, 39, 0.08);
}

/* Decorative Orb - Radial Gradient (NOT blur filter) */
.journey-card-orb {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 200px;
  height: 200px;
  pointer-events: none;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.journey-card[aria-selected="true"] .journey-card-orb {
  opacity: 1;
}

/* Content Hierarchy */
.journey-card-number {
  display: block;
  font: 700 14px var(--mono);
  color: hsla(var(--h), var(--s), var(--l), 1);
  margin-bottom: 12px;
}

.journey-card-title {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.04em;
  margin: 0 0 12px;
  color: var(--ink);
}

.journey-card-description {
  font-size: 15px;
  line-height: 1.7;
  color: var(--muted);
  margin: 0;
}

/* Responsive Adjustments */
@media (max-width: 700px) {
  .journey-card {
    min-height: 320px;
    padding: 28px 24px;
  }
  
  .journey-card-title {
    font-size: 21px;
  }
  
  .journey-card-description {
    font-size: 14px;
  }
}

@media (max-width: 520px) {
  .journey-card {
    min-height: 280px;
    padding: 24px 20px;
  }
  
  .journey-card-illustration {
    width: 80px;
    height: 80px;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .journey-card {
    transition: none;
  }
  
  .journey-card[aria-selected="true"] {
    transform: none;
  }
}
```

#### Color System

The cards use a hue-based system with CSS custom properties for flexible color application:

- **Cyan (Step 0)**: HSL(186, 91%, 44%) → `#06b6d4`
- **Emerald (Step 1)**: HSL(161, 84%, 39%) → `#10b981`
- **Amber (Step 2)**: HSL(38, 92%, 50%) → `#f59e0b`
- **Rose (Step 3)**: HSL(348, 89%, 60%) → `#f43f5e`

These values are applied via `--h`, `--s`, `--l` custom properties and used in `hsla()` functions for borders, glows, and accent elements with varying alpha channels.

### 2. Rail Navigation System

**Purpose**: Provide visual progress indication and direct navigation to steps.

#### HTML Structure

```html
<div class="journey-rail" role="none">
  <div class="journey-rail-track" aria-hidden="true"></div>
  
  <div class="journey-rail-nodes" role="tablist" aria-label="Navigate journey steps">
    <button class="journey-rail-node" 
            role="tab"
            aria-label="Go to step 1"
            aria-selected="true"
            data-step="0">
      <span class="sr-only">Step 1</span>
    </button>
    <!-- Rail nodes 2-4 -->
  </div>
  
  <div class="journey-rail-marker" aria-hidden="true">
    <div class="journey-rail-marker-core"></div>
    <div class="journey-rail-marker-halo"></div>
  </div>
</div>
```

#### CSS Architecture

```css
/* Rail Container */
.journey-rail {
  position: relative;
  width: min(1380px, calc(100% - 112px));
  margin: 48px auto 0;
  height: 64px;
}

/* Rail Track Line */
.journey-rail-track {
  position: absolute;
  top: 50%;
  left: 5%;
  right: 5%;
  height: 2px;
  background: linear-gradient(
    to right,
    rgba(228, 231, 236, 0.5),
    rgba(228, 231, 236, 1) 20%,
    rgba(228, 231, 236, 1) 80%,
    rgba(228, 231, 236, 0.5)
  );
  transform: translateY(-50%);
}

/* Rail Nodes Container */
.journey-rail-nodes {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding-inline: 5%;
  transform: translateY(-50%);
}

/* Individual Rail Node */
.journey-rail-node {
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  position: relative;
  display: grid;
  place-items: center;
}

.journey-rail-node::before {
  content: '';
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--surface);
  border: 2px solid var(--border);
  transition: all 0.25s ease;
}

.journey-rail-node[aria-selected="true"]::before {
  background: var(--accent);
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
}

.journey-rail-node:hover::before {
  background: var(--soft-blue);
  border-color: var(--accent);
  transform: scale(1.15);
}

.journey-rail-node:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
  border-radius: 50%;
}

/* Travelling Marker */
.journey-rail-marker {
  position: absolute;
  top: 50%;
  left: 5%;
  width: 22px;
  height: 22px;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: left 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.journey-rail-marker-core {
  position: absolute;
  width: 22px;
  height: 22px;
  background: var(--accent-bright);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35);
}

.journey-rail-marker-halo {
  position: absolute;
  width: 22px;
  height: 22px;
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.3) 0%,
    rgba(59, 130, 246, 0) 70%
  );
  border-radius: 50%;
  transform: scale(2);
}

/* Marker Positions (calculated based on 4 nodes) */
.journey-rail-marker[data-position="0"] { left: 5%; }
.journey-rail-marker[data-position="1"] { left: calc(5% + 30%); }
.journey-rail-marker[data-position="2"] { left: calc(5% + 60%); }
.journey-rail-marker[data-position="3"] { left: 95%; }

/* Responsive Adjustments */
@media (max-width: 700px) {
  .journey-rail {
    height: 52px;
    margin-top: 36px;
  }
  
  .journey-rail-node {
    width: 38px;
    height: 38px;
  }
  
  .journey-rail-node::before {
    width: 14px;
    height: 14px;
  }
  
  .journey-rail-marker {
    width: 18px;
    height: 18px;
  }
  
  .journey-rail-marker-core {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 520px) {
  .journey-rail {
    display: none; /* Hide rail on very small mobile */
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .journey-rail-marker {
    transition: none;
  }
}
```

#### Position Calculation

The travelling marker positions are calculated as percentages based on 4 evenly distributed nodes:
- Node 0: 5% (left edge with padding)
- Node 1: 35% (5% + 30%)
- Node 2: 65% (5% + 60%)
- Node 3: 95% (right edge with padding)

The marker uses CSS `left` property with smooth transitions via `cubic-bezier(0.4, 0.0, 0.2, 1)` for natural easing.

### 3. Feedback Loop SVG

**Purpose**: Provide visual closure and suggest cyclical nature of the journey.

#### HTML Structure

```html
<svg class="journey-feedback-loop" 
     aria-hidden="true" 
     viewBox="0 0 1200 160"
     preserveAspectRatio="xMidYMid meet">
  <defs>
    <linearGradient id="feedback-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.6" />
      <stop offset="33%" stop-color="#f59e0b" stop-opacity="0.6" />
      <stop offset="66%" stop-color="#10b981" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.6" />
    </linearGradient>
  </defs>
  
  <path d="M 100 80 
           C 200 80, 250 30, 350 30
           L 850 30
           C 950 30, 1000 80, 1100 80
           C 1000 80, 950 130, 850 130
           L 350 130
           C 250 130, 200 80, 100 80 Z"
        fill="none"
        stroke="url(#feedback-gradient)"
        stroke-width="3"
        stroke-dasharray="12 8"
        stroke-linecap="round" />
</svg>
```

#### CSS Architecture

```css
.journey-feedback-loop {
  display: block;
  width: min(1200px, 90%);
  height: auto;
  margin: 72px auto 0;
  max-height: 160px;
}

@media (max-width: 900px) {
  .journey-feedback-loop {
    margin-top: 56px;
  }
}

@media (max-width: 700px) {
  .journey-feedback-loop {
    width: 95%;
    margin-top: 48px;
    max-height: 120px;
  }
}

@media (max-width: 520px) {
  .journey-feedback-loop {
    display: none; /* Hide on small mobile */
  }
}
```

The SVG path creates a closed loop shape with rounded corners. The gradient flows from rose→amber→emerald→cyan, mirroring the card color sequence and suggesting continuous progression.

## State Management

### State Object

```javascript
const journeyState = {
  activeStep: 0,               // Current step index (0-3)
  autoplayEnabled: true,       // Whether autoplay is active
  autoplayTimer: null,         // Timer reference
  isVisible: false,            // Intersection observer state
  isPaused: false,             // Manual pause state
  pauseTimeout: null,          // Pause resume timer
  prefersReducedMotion: false  // User motion preference
};
```

### State Transitions

```
Initial State (activeStep: 0)
  ↓
[Auto-cycle every 2600ms]
  ↓
activeStep: 1 → 2 → 3 → 0 (loop)
  ↑
[User Interaction: Click/Keyboard]
  ↓
Pause for 8000ms → Resume auto-cycle
  ↑
[Hover/Focus]
  ↓
Pause → Resume after 1000ms of no interaction
  ↑
[Visibility Change]
  ↓
Stop/Start auto-cycle based on viewport visibility
```

### State Management Functions

```javascript
// Initialize state based on user preferences
function initializeState() {
  journeyState.prefersReducedMotion = 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  journeyState.autoplayEnabled = !journeyState.prefersReducedMotion;
  
  return journeyState;
}

// Update active step with bounds checking
function setActiveStep(newStep) {
  // Clamp to valid range
  const clampedStep = Math.max(0, Math.min(3, Math.floor(newStep)));
  
  if (clampedStep === journeyState.activeStep) return;
  
  journeyState.activeStep = clampedStep;
  updateUIForActiveStep(clampedStep);
  announceStepChange(clampedStep);
}

// Advance to next step (with wraparound)
function advanceStep() {
  const nextStep = (journeyState.activeStep + 1) % 4;
  setActiveStep(nextStep);
}

// Start auto-cycle timer
function startAutoplay() {
  if (!journeyState.autoplayEnabled || journeyState.isPaused) return;
  
  stopAutoplay(); // Clear any existing timer
  
  journeyState.autoplayTimer = setInterval(() => {
    if (journeyState.isVisible && !journeyState.isPaused) {
      advanceStep();
    }
  }, AUTO_CYCLE_INTERVAL);
}

// Stop auto-cycle timer
function stopAutoplay() {
  if (journeyState.autoplayTimer) {
    clearInterval(journeyState.autoplayTimer);
    journeyState.autoplayTimer = null;
  }
}

// Pause auto-cycle temporarily
function pauseAutoplay(resumeDelay = PAUSE_DURATION) {
  journeyState.isPaused = true;
  stopAutoplay();
  
  // Clear any existing resume timeout
  if (journeyState.pauseTimeout) {
    clearTimeout(journeyState.pauseTimeout);
  }
  
  // Schedule resume
  journeyState.pauseTimeout = setTimeout(() => {
    journeyState.isPaused = false;
    if (journeyState.isVisible && journeyState.autoplayEnabled) {
      startAutoplay();
    }
  }, resumeDelay);
}
```

## Event Handling

### Click Events

```javascript
// Card click handler
function handleCardClick(event) {
  const card = event.currentTarget;
  const stepIndex = parseInt(card.dataset.step, 10);
  
  setActiveStep(stepIndex);
  pauseAutoplay(8000); // Pause for 8 seconds
}

// Rail node click handler
function handleRailNodeClick(event) {
  const node = event.currentTarget;
  const stepIndex = parseInt(node.dataset.step, 10);
  
  setActiveStep(stepIndex);
  pauseAutoplay(8000); // Pause for 8 seconds
}

// Attach click handlers
cards.forEach(card => {
  card.addEventListener('click', handleCardClick);
});

railNodes.forEach(node => {
  node.addEventListener('click', handleRailNodeClick);
});
```

### Keyboard Navigation

```javascript
// Keyboard event handler
function handleKeydown(event) {
  const { key, target } = event;
  
  // Only handle if focus is on a card or rail node
  const isCard = target.classList.contains('journey-card');
  const isNode = target.classList.contains('journey-rail-node');
  
  if (!isCard && !isNode) return;
  
  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault();
      const nextStep = (journeyState.activeStep + 1) % 4;
      setActiveStep(nextStep);
      pauseAutoplay(8000);
      focusActiveElement();
      break;
      
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault();
      const prevStep = (journeyState.activeStep - 1 + 4) % 4;
      setActiveStep(prevStep);
      pauseAutoplay(8000);
      focusActiveElement();
      break;
      
    case 'Home':
      event.preventDefault();
      setActiveStep(0);
      pauseAutoplay(8000);
      focusActiveElement();
      break;
      
    case 'End':
      event.preventDefault();
      setActiveStep(3);
      pauseAutoplay(8000);
      focusActiveElement();
      break;
  }
}

// Focus management
function focusActiveElement() {
  const activeCard = cards[journeyState.activeStep];
  if (activeCard && document.activeElement) {
    activeCard.focus();
  }
}

// Attach keyboard handler
document.addEventListener('keydown', handleKeydown);
```

### Hover/Focus Pause

```javascript
// Hover pause with debounce
let hoverResumeTimeout = null;

function handleMouseEnter() {
  if (hoverResumeTimeout) {
    clearTimeout(hoverResumeTimeout);
    hoverResumeTimeout = null;
  }
  
  if (journeyState.autoplayEnabled) {
    stopAutoplay();
  }
}

function handleMouseLeave() {
  if (!journeyState.autoplayEnabled) return;
  
  hoverResumeTimeout = setTimeout(() => {
    if (!journeyState.isPaused && journeyState.isVisible) {
      startAutoplay();
    }
  }, 1000);
}

// Focus pause
function handleFocusIn() {
  if (journeyState.autoplayEnabled) {
    stopAutoplay();
  }
}

function handleFocusOut(event) {
  // Check if focus moved outside the component
  const container = document.querySelector('.journey-visualization');
  if (!container.contains(event.relatedTarget)) {
    if (!journeyState.isPaused && journeyState.isVisible) {
      setTimeout(() => {
        if (journeyState.autoplayEnabled) {
          startAutoplay();
        }
      }, 1000);
    }
  }
}

// Attach hover handlers to container
const container = document.querySelector('.journey-visualization');
container.addEventListener('mouseenter', handleMouseEnter);
container.addEventListener('mouseleave', handleMouseLeave);
container.addEventListener('focusin', handleFocusIn);
container.addEventListener('focusout', handleFocusOut);
```

### Intersection Observer

```javascript
// Visibility tracking
function initializeIntersectionObserver() {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // Component is 10% visible
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      journeyState.isVisible = entry.isIntersecting;
      
      if (entry.isIntersecting) {
        // Component became visible
        if (journeyState.autoplayEnabled && !journeyState.isPaused) {
          startAutoplay();
        }
      } else {
        // Component left viewport
        stopAutoplay();
      }
    });
  }, options);
  
  const container = document.querySelector('.journey-visualization');
  if (container) {
    observer.observe(container);
  }
  
  return observer;
}
```

## UI Update Logic

### Update Active Step

```javascript
function updateUIForActiveStep(stepIndex) {
  // Update cards
  cards.forEach((card, index) => {
    const isActive = index === stepIndex;
    card.setAttribute('aria-selected', String(isActive));
    
    if (isActive) {
      card.setAttribute('aria-current', 'step');
    } else {
      card.removeAttribute('aria-current');
    }
  });
  
  // Update rail nodes
  railNodes.forEach((node, index) => {
    const isActive = index === stepIndex;
    node.setAttribute('aria-selected', String(isActive));
  });
  
  // Update travelling marker
  const marker = document.querySelector('.journey-rail-marker');
  if (marker) {
    marker.setAttribute('data-position', String(stepIndex));
  }
}
```

### Screen Reader Announcements

```javascript
// Create live region for announcements
function createLiveRegion() {
  const liveRegion = document.createElement('div');
  liveRegion.id = 'journey-live-region';
  liveRegion.className = 'sr-only';
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  
  document.body.appendChild(liveRegion);
  return liveRegion;
}

// Announce step changes
function announceStepChange(stepIndex) {
  const liveRegion = document.getElementById('journey-live-region');
  if (!liveRegion) return;
  
  const stepNames = ['Discovery', 'Planning', 'Execution', 'Delivery'];
  const message = `Step ${stepIndex + 1} of 4: ${stepNames[stepIndex]}`;
  
  // Clear and set with delay to ensure announcement
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 100);
}
```

## Data Model

### Card Content Structure

```javascript
const journeySteps = [
  {
    id: 0,
    number: '01',
    title: 'Discovery',
    description: 'Understanding your unique needs and goals through collaborative exploration.',
    hue: { h: 186, s: 91, l: 44 }, // cyan
    illustration: 'discovery-svg', // SVG identifier
    color: '#06b6d4'
  },
  {
    id: 1,
    number: '02',
    title: 'Planning',
    description: 'Crafting a detailed roadmap with clear milestones and success criteria.',
    hue: { h: 161, s: 84, l: 39 }, // emerald
    illustration: 'planning-svg',
    color: '#10b981'
  },
  {
    id: 2,
    number: '03',
    title: 'Execution',
    description: 'Building with precision, transparency, and continuous feedback integration.',
    hue: { h: 38, s: 92, l: 50 }, // amber
    illustration: 'execution-svg',
    color: '#f59e0b'
  },
  {
    id: 3,
    number: '04',
    title: 'Delivery',
    description: 'Launching with confidence, support, and comprehensive documentation.',
    hue: { h: 348, s: 89, l: 60 }, // rose
    illustration: 'delivery-svg',
    color: '#f43f5e'
  }
];
```

### Constants

```javascript
const AUTO_CYCLE_INTERVAL = 2600;  // ms between auto-advances
const PAUSE_DURATION = 8000;        // ms to pause after manual interaction
const HOVER_RESUME_DELAY = 1000;    // ms to wait before resuming after hover
const MARKER_TRANSITION_DURATION = 500; // ms for marker movement
```

## Responsive Design Strategy

### Breakpoint System

| Breakpoint | Grid Layout | Rail Visibility | Loop Visibility | Card Padding |
|------------|-------------|-----------------|-----------------|--------------|
| > 900px    | 4 columns   | Visible         | Visible         | 32px 28px    |
| ≤ 900px    | 1 column    | Visible         | Visible         | 28px 24px    |
| ≤ 700px    | 1 column    | Visible (scaled)| Visible (scaled)| 28px 24px    |
| ≤ 520px    | 1 column    | Hidden          | Hidden          | 24px 20px    |
| ≤ 390px    | 1 column    | Hidden          | Hidden          | 20px 18px    |

### Layout Adaptations

**Desktop (> 900px)**:
- Horizontal card grid with equal-width columns
- Full-width rail system with 44px touch targets
- Large feedback loop (1200px wide)
- Maximum container width: `min(1380px, calc(100% - 112px))`

**Tablet (≤ 900px)**:
- Vertical card stack
- Rail system below cards
- Reduced container padding
- Maintained touch target sizes

**Mobile (≤ 700px)**:
- Single column cards
- Scaled-down rail nodes (38px)
- Smaller feedback loop
- Reduced typography sizes

**Small Mobile (≤ 520px)**:
- Rail system hidden (cards remain interactive)
- Feedback loop hidden
- Minimum padding to maximize content area
- Smaller SVG illustrations

### Typography Scaling

```css
/* Card titles */
.journey-card-title {
  font-size: clamp(18px, 4vw, 24px);
}

/* Card descriptions */
.journey-card-description {
  font-size: clamp(13px, 2.5vw, 15px);
  line-height: clamp(1.6, 1.7, 1.8);
}

/* Card numbers */
.journey-card-number {
  font-size: clamp(12px, 2vw, 14px);
}
```

## Accessibility Implementation

### ARIA Roles and Attributes

**Card Grid**:
- `role="tablist"` on container
- `role="tab"` on each card
- `aria-label` describing component purpose
- `aria-selected` on active card
- `aria-current="step"` on active card
- `aria-controls` linking to content panel (if present)

**Rail System**:
- `role="tablist"` on nodes container
- `role="tab"` on each node
- `aria-label` on each node ("Go to step X")
- `aria-selected` on active node
- `aria-hidden="true"` on decorative track and marker

**Decorative Elements**:
- `aria-hidden="true"` on all SVG orbs, illustrations, and feedback loop
- No focusable elements within decorative SVGs

### Keyboard Support

| Key | Action |
|-----|--------|
| Tab | Move focus between cards and rail nodes |
| Enter / Space | Activate focused card or node |
| Arrow Right / Down | Move to next step (wraparound at end) |
| Arrow Left / Up | Move to previous step (wraparound at start) |
| Home | Jump to first step |
| End | Jump to last step |

### Focus Management

```javascript
// Visible focus indicators
.journey-card:focus-visible,
.journey-rail-node:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
}

// Skip link for keyboard users
<a href="#journey-visualization" class="skip-link">
  Skip to journey visualization
</a>
```

### Screen Reader Experience

1. **Initial Load**: "Journey steps, 4 tabs. Discovery, step 1 of 4, selected."
2. **Auto-Advance**: "Step 2 of 4: Planning"
3. **Manual Navigation**: "Step 3 of 4: Execution, selected"
4. **Card Content**: Full description read when focused

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .journey-rail-marker {
    transition: none;
  }
  
  .journey-card {
    transition: none;
  }
}
```

JavaScript disables autoplay entirely when `prefers-reduced-motion: reduce` is detected.

## Performance Optimization

### CSS Performance

1. **Transform-only animations**: All moving elements use `transform` and `opacity` for GPU acceleration
2. **will-change usage**: Applied only to active cards during transitions
3. **No blur animations**: Backdrop-filter is static; never animated
4. **Contain property**: Cards use `contain: layout style paint` for isolation

```css
.journey-card[aria-selected="true"] {
  will-change: transform;
}

.journey-card {
  contain: layout style paint;
}
```

### JavaScript Performance

1. **Event delegation**: Single listener for multiple cards/nodes where possible
2. **Debounced resize**: Resize event listeners debounced to 150ms
3. **Intersection Observer**: Automatic pause when component not visible
4. **requestAnimationFrame**: DOM updates batched in RAF callbacks

```javascript
// Debounced resize handler
let resizeTimeout;
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    updateMarkerPositions();
  }, 150);
}

window.addEventListener('resize', handleResize);
```

### Resource Loading

1. **Inline SVGs**: Small decorative SVGs inlined to reduce HTTP requests
2. **CSS containment**: Prevents layout thrashing
3. **Lazy initialization**: Intersection Observer created only when needed

## Error Handling

### Input Validation

```javascript
function setActiveStep(newStep) {
  // Handle invalid types
  if (typeof newStep !== 'number') {
    console.warn('setActiveStep: Invalid step type:', typeof newStep);
    return;
  }
  
  // Handle NaN
  if (Number.isNaN(newStep)) {
    console.warn('setActiveStep: Step is NaN, defaulting to 0');
    newStep = 0;
  }
  
  // Clamp to valid range
  const clampedStep = Math.max(0, Math.min(3, Math.floor(newStep)));
  
  if (clampedStep !== newStep) {
    console.warn(`setActiveStep: Clamped ${newStep} to ${clampedStep}`);
  }
  
  // Continue with valid step...
}
```

### Graceful Degradation

**JavaScript Disabled**:
- All cards visible in vertical stack
- No autoplay (obviously)
- Cards remain accessible via standard HTML navigation
- Content fully readable

**CSS Disabled**:
- Semantic HTML structure preserved
- Cards render as vertical list
- Content hierarchy maintained via heading levels
- Links and navigation still functional

**Browser Support Fallbacks**:
```css
/* Backdrop-filter fallback */
@supports not (backdrop-filter: blur(12px)) {
  .journey-card {
    background: rgba(255, 255, 255, 0.9);
  }
}

/* Grid fallback */
@supports not (display: grid) {
  .journey-cards {
    display: flex;
    flex-wrap: wrap;
  }
  
  .journey-card {
    flex: 1 1 calc(25% - 20px);
  }
}
```

### Error Boundaries

```javascript
// Wrap initialization in try-catch
function initializeJourneyVisualization() {
  try {
    const state = initializeState();
    const observer = initializeIntersectionObserver();
    attachEventListeners();
    
    if (state.autoplayEnabled && state.isVisible) {
      startAutoplay();
    }
    
    console.log('Journey Visualization initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Journey Visualization:', error);
    // Ensure component still displays statically
    const cards = document.querySelectorAll('.journey-card');
    if (cards.length > 0) {
      cards[0].setAttribute('aria-selected', 'true');
    }
  }
}

// Safe initialization on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeJourneyVisualization);
} else {
  initializeJourneyVisualization();
}
```

## Integration with Existing Codebase

### Section Spacing Adjustments

The journey visualization replaces the accordion in the `.intro-band` section. Spacing must be adjusted to maintain vertical rhythm:

**Before (with accordion)**:
```css
.intro-band {
  padding: clamp(72px, 10vh, 112px) 0;
}

.hero {
  padding-block: clamp(48px, 9vh, 96px) clamp(64px, 10vh, 120px);
}
```

**After (with journey visualization)**:
```css
.intro-band {
  padding: clamp(56px, 8vh, 88px) 0; /* Reduced top padding */
}

.hero {
  padding-block: clamp(48px, 9vh, 96px) clamp(48px, 8vh, 96px); /* Reduced bottom */
}

.journey-visualization {
  padding-top: 24px; /* Internal top spacing */
}
```

### Theme Token Usage

The component exclusively uses existing theme tokens:

```css
:root {
  --bg: #F7F8FA;
  --surface: #FFFFFF;
  --ink: #111827;
  --muted: #667085;
  --accent: #2563EB;
  --accent-bright: #3B82F6;
  --border: #E4E7EC;
  --soft-blue: #EFF6FF;
}
```

Applied in component:
- `--surface`: Card backgrounds, rail node backgrounds
- `--ink`: Text color, active states
- `--muted`: Secondary text, inactive states
- `--accent`: Primary interactive color, focus indicators
- `--border`: Card borders, rail track
- `--soft-blue`: Hover backgrounds

### Typography Consistency

```css
.journey-card-number {
  font-family: var(--mono); /* Matches existing monospace usage */
}

.journey-card-title {
  font-family: var(--display); /* Matches existing display font */
}

.journey-card-description {
  font-family: var(--sans); /* Matches body text */
}
```

### Animation Patterns

Matches existing patterns from project cards and navigation:

```css
/* Consistent with .project-card hover */
.journey-card:hover {
  transform: translateY(-2px);
}

/* Consistent with .nav-links a transition */
.journey-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
```

## Testing Strategy

### Manual Testing Checklist

**Functionality**:
- [ ] Auto-cycle advances every 2600ms
- [ ] Cycle wraps from step 3 to step 0
- [ ] Card clicks navigate to correct step
- [ ] Rail node clicks navigate to correct step
- [ ] Marker moves to correct position
- [ ] Hover pauses autoplay
- [ ] Focus pauses autoplay
- [ ] Keyboard navigation works (Arrow keys, Home, End)
- [ ] Manual interaction pauses for 8000ms

**Accessibility**:
- [ ] Screen reader announces step changes
- [ ] All interactive elements keyboard focusable
- [ ] Focus indicators visible
- [ ] ARIA attributes correct (selected, current)
- [ ] Tab order logical
- [ ] Reduced motion disables animations

**Responsive**:
- [ ] 4-column layout at > 900px
- [ ] 1-column layout at ≤ 900px
- [ ] Rail scales appropriately
- [ ] Rail hidden at ≤ 520px
- [ ] Loop hidden at ≤ 520px
- [ ] Touch targets minimum 44px
- [ ] No horizontal scroll at any width

**Performance**:
- [ ] Animations smooth (60fps)
- [ ] No layout thrashing
- [ ] Autoplay stops when scrolled out of view
- [ ] No memory leaks from timers

**Browser Compatibility**:
- [ ] Works in Chrome, Firefox, Safari, Edge
- [ ] Backdrop-filter fallback applies
- [ ] Intersection Observer polyfill (if needed)

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Card Count Invariant

*For any* render of the Card_Grid, the number of Step_Cards SHALL equal exactly 4.

**Validates: Requirements 2.1, 5.1**

### Property 2: Step Index to Color Hue Mapping

*For any* Step_Card at index i where i ∈ {0, 1, 2, 3}, the card SHALL have the color hue corresponding to the mapping: {0→cyan, 1→emerald, 2→amber, 3→rose}.

**Validates: Requirements 3.3, 3.4, 3.5, 3.6**

### Property 3: Active Step Bounds

*For any* value assigned to Active_Step, the system SHALL clamp it to the valid range [0, 3].

**Validates: Requirements 22.1**

### Property 4: Rail Node Active State Correspondence

*For any* Active_Step value i where i ∈ {0, 1, 2, 3}, the Rail_Node at index i SHALL have aria-selected="true" and all other Rail_Nodes SHALL have aria-selected="false".

**Validates: Requirements 5.5**

### Property 5: Travelling Marker Position Correspondence

*For any* Active_Step value i where i ∈ {0, 1, 2, 3}, the Travelling_Marker SHALL be positioned at the coordinates of Rail_Node[i].

**Validates: Requirements 6.1**

### Property 6: Auto-Cycle Advancement

*For any* Active_Step value i where i ∈ {0, 1, 2}, when 2600ms elapses with autoplay enabled and no user interaction, Active_Step SHALL become i + 1.

**Validates: Requirements 8.1**

### Property 7: Auto-Cycle Wraparound

*When* Active_Step equals 3 and 2600ms elapses with autoplay enabled and no user interaction, Active_Step SHALL become 0.

**Validates: Requirements 8.2**

### Property 8: Card Click Navigation

*For any* Step_Card at index i where i ∈ {0, 1, 2, 3}, when clicked, Active_Step SHALL become i.

**Validates: Requirements 9.1**

### Property 9: Manual Interaction Pause Duration

*For any* user interaction (card click, rail node click, or keyboard navigation), the Auto_Cycle_Timer SHALL pause for exactly 8000ms before resuming.

**Validates: Requirements 9.2, 10.2, 12.5**

### Property 10: Rail Node Click Navigation

*For any* Rail_Node at index i where i ∈ {0, 1, 2, 3}, when clicked, Active_Step SHALL become i.

**Validates: Requirements 10.1**

### Property 11: Hover Pause Effect

*For any* Step_Card, when the pointer hovers over it, the Auto_Cycle_Timer SHALL pause.

**Validates: Requirements 11.1**

### Property 12: Right Arrow Navigation

*For any* Active_Step value i where i ∈ {0, 1, 2}, when Right Arrow key is pressed with focus on the Journey_Visualization_System, Active_Step SHALL become i + 1.

**Validates: Requirements 12.1**

### Property 13: Right Arrow Wraparound

*When* Active_Step equals 3 and Right Arrow key is pressed with focus on the Journey_Visualization_System, Active_Step SHALL become 0.

**Validates: Requirements 12.3**

### Property 14: Left Arrow Wraparound

*When* Active_Step equals 0 and Left Arrow key is pressed with focus on the Journey_Visualization_System, Active_Step SHALL become 3.

**Validates: Requirements 12.4**

### Property 15: Step Card ARIA Label

*For any* Step_Card at index i where i ∈ {0, 1, 2, 3}, the card SHALL have an aria-label attribute containing "Step [i+1] of 4".

**Validates: Requirements 13.2**

### Property 16: Active Step ARIA Current

*For any* Active_Step value i where i ∈ {0, 1, 2, 3}, the Step_Card at index i SHALL have aria-current="step" and all other Step_Cards SHALL not have aria-current attribute.

**Validates: Requirements 13.3**

### Property 17: Reduced Motion Disables Autoplay

*When* user has prefers-reduced-motion: reduce enabled, the Auto_Cycle_Timer SHALL not start.

**Validates: Requirements 19.1**

### Property 18: Visibility Controls Autoplay

*For any* viewport scroll position where Journey_Visualization_System is not visible (as determined by Intersection Observer), the Auto_Cycle_Timer SHALL be stopped.

**Validates: Requirements 20.4**

### Property 19: Rapid Click Stability

*For any* sequence of rapid Step_Card clicks, the final Active_Step SHALL correspond to the last clicked card's index, and the system SHALL remain stable without errors.

**Validates: Requirements 22.3**

## Implementation Phases

### Phase 1: Static Structure (HTML/CSS)
1. Remove accordion markup and styles
2. Create card grid HTML with semantic structure
3. Apply glass morphism styling
4. Implement color hue system
5. Add decorative SVG orbs
6. Build rail system HTML/CSS
7. Create feedback loop SVG
8. Apply responsive breakpoints

**Validation**: Visual inspection, HTML validator, accessibility audit

### Phase 2: State Management (JavaScript)
1. Initialize state object
2. Implement setActiveStep with bounds checking
3. Create updateUIForActiveStep function
4. Add screen reader live region
5. Implement announceStepChange

**Validation**: Console logging, manual state manipulation

### Phase 3: Auto-Cycle Logic
1. Implement startAutoplay function
2. Implement stopAutoplay function
3. Add pauseAutoplay with resume timeout
4. Integrate prefers-reduced-motion detection
5. Create Intersection Observer

**Validation**: Timer verification, visibility testing

### Phase 4: User Interactions
1. Add card click handlers
2. Add rail node click handlers
3. Implement keyboard navigation
4. Add hover/focus pause logic
5. Ensure pause duration correctness

**Validation**: Manual interaction testing, keyboard-only navigation

### Phase 5: Accessibility & Polish
1. Verify all ARIA attributes
2. Test with screen readers (NVDA, VoiceOver)
3. Confirm keyboard focus indicators
4. Test reduced motion support
5. Validate touch target sizes

**Validation**: Accessibility audit tools, screen reader testing

### Phase 6: Performance Optimization
1. Verify GPU-accelerated animations
2. Add will-change property management
3. Implement resize debouncing
4. Test with Performance Monitor
5. Optimize JavaScript execution

**Validation**: Chrome DevTools Performance tab, Lighthouse

### Phase 7: Cross-Browser Testing
1. Test in Chrome, Firefox, Safari, Edge
2. Apply vendor prefixes where needed
3. Add backdrop-filter fallback
4. Test on iOS and Android devices
5. Verify graceful degradation

**Validation**: BrowserStack, physical device testing

## Maintenance Considerations

### Content Updates

To update journey step content, modify the `journeySteps` array:

```javascript
const journeySteps = [
  {
    id: 0,
    title: 'New Title',
    description: 'New description text...',
    // Other properties remain same
  },
  // ...
];
```

Rebuild cards with updated content via `renderCards()` function.

### Color Theme Updates

Colors are controlled via CSS custom properties on each card:

```css
.journey-card[data-step="0"] {
  --h: 186; --s: 91%; --l: 44%; /* Change these values */
}
```

Update the SVG gradient stops in the feedback loop to match:

```html
<stop offset="0%" stop-color="#NEW_COLOR" />
```

### Timing Adjustments

All timing constants are defined at the top of the JavaScript file:

```javascript
const AUTO_CYCLE_INTERVAL = 2600;  // Change cycle speed
const PAUSE_DURATION = 8000;        // Change pause duration
const HOVER_RESUME_DELAY = 1000;    // Change hover resume delay
```

### Adding/Removing Steps

The current design supports exactly 4 steps. To modify:

1. Update `journeySteps` array length
2. Adjust `setActiveStep` bounds (currently 0-3)
3. Update rail node calculations (currently 4 positions)
4. Modify CSS grid columns (currently `repeat(4, 1fr)`)
5. Update ARIA labels (currently "X of 4")
6. Adjust marker position calculations

**Note**: Significant refactoring required; 4-step design is intentional.

## Appendix

### File Structure

```
portfolio/
├── index.html
│   └── Journey Visualization markup
├── styles.css
│   ├── .journey-visualization (container)
│   ├── .journey-cards (grid)
│   ├── .journey-card (glass morphism)
│   ├── .journey-rail (navigation)
│   └── .journey-feedback-loop (SVG)
└── script.js
    ├── State management
    ├── Event handlers
    ├── Auto-cycle logic
    ├── UI updates
    └── Initialization
```

### Browser Support Matrix

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| CSS Grid | ✅ | ✅ | ✅ | ✅ |
| Backdrop Filter | ✅ | ✅ | ✅ (-webkit) | ✅ |
| CSS Custom Props | ✅ | ✅ | ✅ | ✅ |
| Intersection Observer | ✅ | ✅ | ✅ | ✅ |
| ARIA 1.2 | ✅ | ✅ | ✅ | ✅ |
| prefers-reduced-motion | ✅ | ✅ | ✅ | ✅ |

### Resources

- [ARIA Authoring Practices: Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [MDN: Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [CSS Tricks: A Complete Guide to CSS Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Web.dev: Backdrop Filter](https://web.dev/backdrop-filter/)

---

*Design Document Version 1.0*  
*Last Updated: 2024*  
*Status: Ready for Implementation*
