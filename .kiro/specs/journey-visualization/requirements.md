# Requirements Document

## Introduction

This document specifies the requirements for replacing the existing accordion-based "A PERSONAL NOTE" section with an interactive journey visualization system. The new system features four glass-morphism step cards with custom color hues, a rail navigation system with a travelling marker, and an SVG feedback loop. The system supports both automatic cycling and manual navigation while maintaining full accessibility standards.

## Glossary

- **Journey_Visualization_System**: The complete interactive component that replaces the accordion section, comprising Card_Grid, Rail_System, and Feedback_Loop
- **Card_Grid**: The container holding four Step_Cards arranged horizontally (desktop) or vertically (mobile)
- **Step_Card**: An individual glass-morphism card representing one step in the journey, with custom background hue and decorative SVG illustration
- **Rail_System**: A horizontal track with four Rail_Nodes and a Travelling_Marker indicating progress
- **Rail_Node**: A clickable point on the Rail_System corresponding to a Step_Card
- **Travelling_Marker**: A visual indicator that moves along the Rail_System to show the active step
- **Feedback_Loop**: An SVG element with gradient styling positioned after the Card_Grid, providing visual closure to the journey
- **Auto_Cycle_Timer**: The mechanism that automatically advances through steps at 2600ms intervals
- **Active_Step**: The currently displayed Step_Card (integer value 0-3)
- **Glass_Morphism**: A semi-transparent visual style using backdrop-filter blur and translucent backgrounds
- **Accordion_Section**: The existing proof-card component being removed from the personal-note section
- **Container_Width**: The responsive width constraint min(1380px, calc(100% - 112px)) on desktop
- **Breakpoint**: Screen width threshold that triggers responsive layout changes (900px, 700px, 520px, 390px)

## Requirements

### Requirement 1: Accordion Removal

**User Story:** As a developer, I want the existing accordion completely removed, so that the journey visualization can be implemented cleanly

#### Acceptance Criteria

1.1 THE Journey_Visualization_System SHALL remove all HTML markup associated with Accordion_Section from the personal-note section

1.2 THE Journey_Visualization_System SHALL remove all CSS rules targeting Accordion_Section class names and identifiers

1.3 THE Journey_Visualization_System SHALL remove all JavaScript event listeners and functions controlling Accordion_Section behavior

1.4 THE Journey_Visualization_System SHALL preserve the section identifier "personal-note" for the containing section

1.5 THE Journey_Visualization_System SHALL preserve the existing headline and paragraph text content without modification

### Requirement 2: Card Grid Structure

**User Story:** As a user, I want to see four visually distinct step cards, so that I can understand the journey stages

#### Acceptance Criteria

2.1 THE Card_Grid SHALL contain exactly four Step_Cards

2.2 WHEN viewport width exceeds 900px, THE Card_Grid SHALL arrange Step_Cards in a horizontal row

2.3 WHEN viewport width is 900px or below, THE Card_Grid SHALL arrange Step_Cards in a vertical column

2.4 THE Card_Grid SHALL apply Container_Width constraint on desktop viewports

2.5 WHEN viewport width is 700px or below, THE Card_Grid SHALL apply full-width layout with adjusted horizontal padding

### Requirement 3: Glass Morphism Styling

**User Story:** As a user, I want each card to have a distinctive glass-like appearance with unique coloring, so that I can visually differentiate the steps

#### Acceptance Criteria

3.1 THE Step_Card SHALL apply backdrop-filter blur effect for Glass_Morphism appearance

3.2 THE Step_Card SHALL apply semi-transparent background color

3.3 THE Step_Card at index 0 SHALL apply cyan hue background modifier

3.4 THE Step_Card at index 1 SHALL apply emerald hue background modifier

3.5 THE Step_Card at index 2 SHALL apply amber hue background modifier

3.6 THE Step_Card at index 3 SHALL apply rose hue background modifier

3.7 THE Step_Card SHALL use CSS custom properties from the existing theme (--accent, --muted, --ink, --border, --soft-blue)

3.8 THE Step_Card SHALL include border styling consistent with Glass_Morphism design pattern

3.9 THE Step_Card SHALL include box-shadow for depth perception

### Requirement 4: Decorative SVG Illustrations

**User Story:** As a user, I want each card to feature abstract visual elements, so that the interface feels modern and engaging

#### Acceptance Criteria

4.1 THE Step_Card SHALL contain one decorative SVG illustration with abstract geometric shapes

4.2 THE SVG illustration SHALL use aria-hidden="true" attribute for accessibility

4.3 THE SVG illustration SHALL use colors harmonious with the Step_Card's color hue

4.4 THE SVG illustration SHALL scale responsively within the Step_Card boundaries

4.5 WHEN viewport width is 520px or below, THE SVG illustration SHALL reduce in size or hide to optimize mobile layout

### Requirement 5: Rail System Structure

**User Story:** As a user, I want to see a visual progress indicator, so that I understand my position in the journey

#### Acceptance Criteria

5.1 THE Rail_System SHALL contain exactly four Rail_Nodes

5.2 THE Rail_System SHALL position Rail_Nodes evenly distributed across the horizontal axis

5.3 THE Rail_System SHALL render a connecting line between all Rail_Nodes

5.4 THE Rail_Node SHALL display a circular or rounded shape indicator

5.5 WHEN a Rail_Node corresponds to Active_Step, THE Rail_Node SHALL display active state styling

5.6 WHEN viewport width is 700px or below, THE Rail_System SHALL adjust scaling or spacing to fit smaller screens

### Requirement 6: Travelling Marker Behavior

**User Story:** As a user, I want to see smooth movement along the rail, so that I perceive continuous progress

#### Acceptance Criteria

6.1 THE Travelling_Marker SHALL position at the Rail_Node corresponding to Active_Step

6.2 WHEN Active_Step changes, THE Travelling_Marker SHALL animate smoothly to the new Rail_Node position

6.3 THE Travelling_Marker animation SHALL complete within 400ms to 600ms

6.4 THE Travelling_Marker SHALL use CSS transform for position changes to ensure performance

6.5 WHEN user has prefers-reduced-motion enabled, THE Travelling_Marker SHALL transition instantly without animation

### Requirement 7: Feedback Loop Visualization

**User Story:** As a user, I want to see a visual element suggesting continuity, so that I understand the journey is cyclical

#### Acceptance Criteria

7.1 THE Feedback_Loop SHALL render as an SVG element positioned after the Card_Grid

7.2 THE Feedback_Loop SHALL include curved path geometry suggesting a loop or return

7.3 THE Feedback_Loop SHALL apply gradient fill or stroke using theme color variables

7.4 THE Feedback_Loop SHALL scale responsively across all Breakpoint thresholds

7.5 WHEN viewport width is 520px or below, THE Feedback_Loop SHALL adjust stroke width or scale to maintain visual balance

### Requirement 8: Auto-Cycle Mechanism

**User Story:** As a user, I want the journey to progress automatically, so that I experience all steps without interaction

#### Acceptance Criteria

8.1 THE Auto_Cycle_Timer SHALL advance Active_Step by 1 every 2600ms

8.2 WHEN Active_Step reaches index 3, THE Auto_Cycle_Timer SHALL set Active_Step to index 0 on the next cycle

8.3 WHEN Journey_Visualization_System becomes visible in viewport, THE Auto_Cycle_Timer SHALL start

8.4 WHEN Journey_Visualization_System leaves viewport, THE Auto_Cycle_Timer SHALL stop to conserve resources

8.5 WHEN user has prefers-reduced-motion enabled, THE Auto_Cycle_Timer SHALL remain stopped

### Requirement 9: Manual Navigation via Cards

**User Story:** As a user, I want to click on any card to jump to that step, so that I control my exploration pace

#### Acceptance Criteria

9.1 WHEN a Step_Card is clicked, THE Journey_Visualization_System SHALL set Active_Step to the clicked Step_Card's index

9.2 WHEN a Step_Card is clicked, THE Journey_Visualization_System SHALL pause Auto_Cycle_Timer for 8000ms

9.3 WHEN the pause period expires, THE Auto_Cycle_Timer SHALL resume automatic cycling

9.4 THE Step_Card SHALL display pointer cursor on hover to indicate clickability

9.5 WHEN a Step_Card is Active_Step, THE Step_Card SHALL display enhanced visual styling to indicate active state

### Requirement 10: Manual Navigation via Rail

**User Story:** As a user, I want to click on rail nodes to jump to specific steps, so that I have precise navigation control

#### Acceptance Criteria

10.1 WHEN a Rail_Node is clicked, THE Journey_Visualization_System SHALL set Active_Step to the clicked Rail_Node's index

10.2 WHEN a Rail_Node is clicked, THE Journey_Visualization_System SHALL pause Auto_Cycle_Timer for 8000ms

10.3 THE Rail_Node SHALL display pointer cursor on hover to indicate clickability

10.4 THE Rail_Node SHALL include sufficient hit area (minimum 44x44px) for touch accessibility

10.5 WHEN a Rail_Node is focused via keyboard, THE Rail_Node SHALL display visible focus indicator

### Requirement 11: Hover and Focus Pause

**User Story:** As a user, I want the auto-cycle to pause when I interact with cards, so that I can read content without interruption

#### Acceptance Criteria

11.1 WHEN pointer hovers over any Step_Card, THE Auto_Cycle_Timer SHALL pause

11.2 WHEN pointer leaves all Step_Cards, THE Auto_Cycle_Timer SHALL resume after 1000ms delay

11.3 WHEN any interactive element within Journey_Visualization_System receives keyboard focus, THE Auto_Cycle_Timer SHALL pause

11.4 WHEN keyboard focus leaves Journey_Visualization_System, THE Auto_Cycle_Timer SHALL resume after 1000ms delay

11.5 WHEN user has prefers-reduced-motion enabled, THE pause and resume logic SHALL not affect the stopped Auto_Cycle_Timer

### Requirement 12: Keyboard Navigation

**User Story:** As a keyboard user, I want to navigate through steps using arrow keys, so that I can explore without a mouse

#### Acceptance Criteria

12.1 WHEN Journey_Visualization_System has focus and user presses Right Arrow key, THE Journey_Visualization_System SHALL increment Active_Step by 1

12.2 WHEN Journey_Visualization_System has focus and user presses Left Arrow key, THE Journey_Visualization_System SHALL decrement Active_Step by 1

12.3 WHEN Active_Step is 3 and Right Arrow is pressed, THE Journey_Visualization_System SHALL set Active_Step to 0

12.4 WHEN Active_Step is 0 and Left Arrow is pressed, THE Journey_Visualization_System SHALL set Active_Step to 3

12.5 WHEN arrow key navigation occurs, THE Journey_Visualization_System SHALL pause Auto_Cycle_Timer for 8000ms

12.6 THE Rail_Node SHALL be keyboard focusable with tabindex attribute

12.7 WHEN Rail_Node has keyboard focus and user presses Enter or Space, THE Journey_Visualization_System SHALL activate that step

### Requirement 13: Screen Reader Accessibility

**User Story:** As a screen reader user, I want to understand the journey structure and current position, so that I have equivalent access to visual users

#### Acceptance Criteria

13.1 THE Journey_Visualization_System SHALL include aria-label describing the component purpose

13.2 THE Step_Card SHALL include aria-label describing the step number and total steps

13.3 WHEN a Step_Card is Active_Step, THE Step_Card SHALL include aria-current="step" attribute

13.4 THE Rail_System SHALL use role="tablist" or equivalent ARIA pattern for navigation

13.5 THE Rail_Node SHALL include aria-label indicating step number

13.6 WHEN Active_Step changes, THE Journey_Visualization_System SHALL announce the change to screen readers using aria-live region

13.7 THE Feedback_Loop SVG SHALL include aria-hidden="true" as it is decorative

### Requirement 14: Spacing Adjustments

**User Story:** As a developer, I want consistent vertical spacing around the new component, so that the page layout remains balanced

#### Acceptance Criteria

14.1 THE Journey_Visualization_System SHALL apply the same top padding as the removed Accordion_Section

14.2 THE section preceding Journey_Visualization_System (hero section) SHALL reduce bottom margin or padding by the appropriate amount

14.3 THE section following Journey_Visualization_System (About section) SHALL adjust top padding only

14.4 WHEN viewport width crosses a Breakpoint, THE spacing adjustments SHALL scale proportionally

14.5 THE Journey_Visualization_System SHALL maintain vertical rhythm with other page sections

### Requirement 15: Responsive Layout - 900px Breakpoint

**User Story:** As a tablet user, I want the interface to adapt to my screen size, so that all elements remain usable

#### Acceptance Criteria

15.1 WHEN viewport width is 900px or below, THE Card_Grid SHALL switch from horizontal to vertical layout

15.2 WHEN viewport width is 900px or below, THE Rail_System SHALL maintain horizontal orientation below the Card_Grid

15.3 WHEN viewport width is 900px or below, THE Step_Card SHALL occupy full available width

15.4 WHEN viewport width is 900px or below, THE Container_Width constraint SHALL adjust padding values

### Requirement 16: Responsive Layout - 700px Breakpoint

**User Story:** As a mobile user, I want the interface to optimize for smaller screens, so that content remains readable

#### Acceptance Criteria

16.1 WHEN viewport width is 700px or below, THE Card_Grid SHALL apply reduced horizontal padding

16.2 WHEN viewport width is 700px or below, THE Step_Card SHALL reduce internal padding

16.3 WHEN viewport width is 700px or below, THE Rail_System SHALL scale Rail_Nodes to smaller size

16.4 WHEN viewport width is 700px or below, THE Feedback_Loop SHALL scale proportionally

16.5 WHEN viewport width is 700px or below, THE text content within Step_Cards SHALL adjust font size for readability

### Requirement 17: Responsive Layout - 520px Breakpoint

**User Story:** As a small mobile device user, I want the interface to prioritize essential content, so that nothing is cut off

#### Acceptance Criteria

17.1 WHEN viewport width is 520px or below, THE SVG illustrations SHALL reduce size by 30-50 percent

17.2 WHEN viewport width is 520px or below, THE Step_Card SHALL further reduce internal padding

17.3 WHEN viewport width is 520px or below, THE Rail_System SHALL reduce Rail_Node size and spacing

17.4 WHEN viewport width is 520px or below, THE Feedback_Loop SHALL adjust stroke width and overall scale

17.5 WHEN viewport width is 520px or below, THE text line-height SHALL adjust for optimal mobile reading

### Requirement 18: Responsive Layout - 390px Breakpoint

**User Story:** As a very small mobile device user, I want the interface to remain functional on my device, so that I can access all content

#### Acceptance Criteria

18.1 WHEN viewport width is 390px or below, THE Step_Card SHALL apply minimum viable padding

18.2 WHEN viewport width is 390px or below, THE Rail_System SHALL scale to minimum usable size while maintaining 44px touch targets

18.3 WHEN viewport width is 390px or below, THE SVG illustrations SHALL hide or reduce to icon size

18.4 WHEN viewport width is 390px or below, THE Feedback_Loop SHALL scale to fit within viewport boundaries

18.5 WHEN viewport width is 390px or below, THE text content SHALL remain readable without horizontal scrolling

### Requirement 19: Reduced Motion Support

**User Story:** As a user with vestibular motion disorders, I want animations to be disabled when I enable reduced motion, so that the interface does not cause discomfort

#### Acceptance Criteria

19.1 WHEN user has prefers-reduced-motion: reduce enabled, THE Auto_Cycle_Timer SHALL not start

19.2 WHEN user has prefers-reduced-motion: reduce enabled, THE Travelling_Marker SHALL transition instantly without animation duration

19.3 WHEN user has prefers-reduced-motion: reduce enabled, THE Step_Card active state changes SHALL occur without transition effects

19.4 WHEN user has prefers-reduced-motion: reduce enabled, THE manual navigation SHALL function identically without animated transitions

19.5 WHEN user has prefers-reduced-motion: reduce enabled, THE Feedback_Loop SHALL remain visible without animated effects

### Requirement 20: Performance Optimization

**User Story:** As a user on a low-powered device, I want the interface to perform smoothly, so that interaction feels responsive

#### Acceptance Criteria

20.1 THE Travelling_Marker animation SHALL use CSS transform and opacity properties only

20.2 THE Step_Card transition effects SHALL use CSS transform and opacity properties only

20.3 THE Journey_Visualization_System SHALL use Intersection Observer API to detect viewport visibility

20.4 WHEN Journey_Visualization_System is not visible in viewport, THE Auto_Cycle_Timer SHALL stop executing

20.5 THE Glass_Morphism backdrop-filter SHALL apply will-change property only during active transitions

20.6 THE Journey_Visualization_System SHALL debounce resize event listeners with minimum 150ms delay

20.7 THE Rail_System SHALL render using CSS rather than canvas for optimal performance

### Requirement 21: Browser Compatibility

**User Story:** As a user of different browsers, I want the interface to work consistently, so that I have a reliable experience

#### Acceptance Criteria

21.1 THE Glass_Morphism backdrop-filter SHALL include -webkit- vendor prefix for Safari compatibility

21.2 WHEN backdrop-filter is not supported, THE Step_Card SHALL apply fallback solid background with appropriate opacity

21.3 THE CSS Grid or Flexbox layout SHALL function in all modern browsers (Chrome, Firefox, Safari, Edge)

21.4 THE Intersection Observer API SHALL include polyfill detection for older browsers

21.5 THE CSS custom properties SHALL function correctly in all target browsers

21.6 THE ARIA attributes SHALL comply with WAI-ARIA 1.2 specification

### Requirement 22: Error Handling and Edge Cases

**User Story:** As a developer, I want the system to handle unexpected states gracefully, so that the user experience remains stable

#### Acceptance Criteria

22.1 WHEN Active_Step receives invalid index value, THE Journey_Visualization_System SHALL clamp to valid range (0-3)

22.2 WHEN Auto_Cycle_Timer interval reference is undefined, THE Journey_Visualization_System SHALL not throw errors

22.3 WHEN user clicks multiple Step_Cards rapidly, THE Journey_Visualization_System SHALL process only the final valid click

22.4 WHEN viewport resize occurs during animation, THE Journey_Visualization_System SHALL complete animation smoothly

22.5 WHEN JavaScript fails to load, THE Journey_Visualization_System SHALL display all four Step_Cards in accessible vertical layout

22.6 WHEN CSS fails to load, THE text content SHALL remain readable with browser default styling

### Requirement 23: Code Organization

**User Story:** As a developer maintaining the codebase, I want clear separation of concerns, so that the code is maintainable

#### Acceptance Criteria

23.1 THE Journey_Visualization_System JavaScript SHALL organize into distinct functions for initialization, event handling, and state management

23.2 THE Journey_Visualization_System CSS SHALL organize into logical sections: layout, card styling, rail system, animations, responsive

23.3 THE Journey_Visualization_System SHALL use consistent naming conventions matching existing codebase patterns

23.4 THE Journey_Visualization_System SHALL include code comments explaining complex logic

23.5 THE Journey_Visualization_System SHALL define magic numbers (2600ms, 8000ms, etc.) as named constants

### Requirement 24: Testing and Validation

**User Story:** As a developer, I want to verify the implementation works correctly, so that users have a bug-free experience

#### Acceptance Criteria

24.1 THE Journey_Visualization_System SHALL render correctly in Chrome DevTools device emulation for all Breakpoints

24.2 THE Journey_Visualization_System SHALL pass manual keyboard navigation testing (Tab, Arrow keys, Enter, Space)

24.3 THE Journey_Visualization_System SHALL pass screen reader testing with NVDA or VoiceOver

24.4 THE Journey_Visualization_System SHALL validate HTML structure using W3C validator

24.5 THE Journey_Visualization_System SHALL validate CSS syntax using CSS validator

24.6 THE Journey_Visualization_System SHALL function correctly with JavaScript console errors absent

24.7 THE Journey_Visualization_System SHALL maintain accessibility score in Lighthouse audit equivalent to or better than Accordion_Section
