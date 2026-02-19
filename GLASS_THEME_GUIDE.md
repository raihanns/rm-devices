# Apple Liquid Glass Theme - Design System

## Overview

Complete redesign with Apple-inspired liquid glass aesthetic featuring subtle glassmorphism, smooth animations, and lightweight performance.

---

## Design Principles

1. **Minimalism** - Clean, uncluttered interfaces
2. **Depth** - Layered glass effects with subtle shadows
3. **Motion** - Smooth, purposeful animations
4. **Performance** - GPU-accelerated, lightweight effects

---

## Color Palette

### Base Colors
```
Background: #fafafa (Light gray)
Foreground: #1d1d1f (Almost black)
```

### Glass Effects
```
Glass BG: rgba(255, 255, 255, 0.65)
Glass Border: rgba(255, 255, 255, 0.8)
Glass Shadow: rgba(0, 0, 0, 0.05)
```

### Accent Colors (Subtle)
```
Blue: rgba(0, 122, 255, 0.1)
Purple: rgba(88, 86, 214, 0.1)
Pink: rgba(255, 45, 85, 0.1)
```

---

## CSS Classes

### Glass Utilities

```css
/* Standard glass effect */
.glass {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
}

/* Dark glass for overlays */
.glass-dark {
  background: rgba(29, 29, 31, 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Glass card with hover effect */
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.85);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.85);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
}
```

### Animations

```css
/* Floating animation (background orbs) */
.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Shimmer effect (loading states) */
.animate-shimmer {
  animation: shimmer 2s linear infinite;
}

/* Fade in (content load) */
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

/* Scale in (badges, overlays) */
.animate-scale-in {
  animation: scaleIn 0.3s ease-out forwards;
}

/* Slide up (hero content) */
.animate-slide-up {
  animation: slideUp 0.5s ease-out forwards;
}
```

### Buttons

```css
/* Glass button */
.btn-glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

/* Primary button (dark gradient) */
.btn-primary {
  background: linear-gradient(135deg, #1d1d1f 0%, #424245 100%);
  color: white;
}
```

---

## Components Updated

### 1. Navbar
- Glass effect that intensifies on scroll
- Smooth transitions
- Animated mobile menu
- Gradient button for Admin/Sign Out

### 2. Home Page
- Gradient mesh background
- Floating animated orbs
- Glass cards for brands and features
- Smooth scroll indicator
- Staggered animations for hero content

### 3. Product Cards
- Glass card effect
- Hover lift animation
- Image zoom on hover
- Condition badges with colors
- Quick view overlay
- Discount badges (only when > 0)

### 4. Catalog Page
- Sticky glass header
- Glass filter controls
- Active state with scale animation
- Skeleton loading states

### 5. Product Detail
- Glass breadcrumb bar
- Glass specification cards
- Animated image gallery
- Gradient WhatsApp button
- Glass info cards

### 6. Testimonials
- Glass testimonial cards
- Star ratings
- Customer avatars

### 7. Admin Pages
- Glass sidebar
- Glass input fields
- Glass table headers
- Glass buttons throughout

---

## Background System

### Gradient Mesh
```css
.bg-gradient-mesh {
  background: 
    radial-gradient(at 40% 20%, rgba(255, 107, 107, 0.08) 0px, transparent 50%),
    radial-gradient(at 80% 0%, rgba(88, 86, 214, 0.06) 0px, transparent 50%),
    radial-gradient(at 0% 50%, rgba(0, 122, 255, 0.06) 0px, transparent 50%),
    radial-gradient(at 80% 50%, rgba(255, 45, 85, 0.05) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgba(255, 107, 107, 0.06) 0px, transparent 50%);
  background-attachment: fixed;
}
```

### Subtle Gradient
```css
.bg-gradient-subtle {
  background: linear-gradient(180deg, rgba(250, 250, 250, 0.8) 0%, rgba(245, 245, 247, 0.9) 100%);
}
```

---

## Performance Optimizations

### 1. GPU-Accelerated Animations
- Using `transform` and `opacity` only
- No layout thrashing animations
- `will-change` for critical elements

### 2. Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 3. Lazy Loading
```css
img {
  loading: lazy;
  image-rendering: -webkit-optimize-contrast;
}
```

### 4. Efficient Selectors
- No deep nesting
- Single class selectors where possible
- CSS custom properties for theming

---

## Motion Guidelines

### Timing Functions
```css
/* Standard easing */
cubic-bezier(0.4, 0, 0.2, 1)

/* Quick interactions */
duration-200 (0.2s)

/* Smooth transitions */
duration-300 (0.3s)

/* Deliberate movements */
duration-500 (0.5s)
```

### Animation Delays
```
Hero title: 0s
Hero subtitle: 0.1s
Hero buttons: 0.2s
Floating orbs: 2s, 4s (staggered)
```

### Hover States
```css
/* Card hover */
transform: translateY(-2px);
box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);

/* Button hover */
transform: scale(1.05);
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

/* Image hover */
transform: scale(1.10);
```

---

## Accessibility

### Focus States
```css
button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 2px solid rgba(0, 122, 255, 0.5);
  outline-offset: 2px;
}
```

### Contrast Ratios
- Text: Minimum 4.5:1 contrast
- Large text: Minimum 3:1 contrast
- Interactive elements: Clear visual feedback

### Screen Reader Support
- Semantic HTML throughout
- ARIA labels on interactive elements
- Skip to content links

---

## Browser Support

### Full Support
- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

### Fallbacks
- `@supports` for backdrop-filter
- Solid backgrounds for older browsers
- Graceful degradation for animations

---

## File Locations

```
src/
├── app/
│   ├── globals.css          ← All glass utilities & animations
│   ├── page.tsx             ← Home page with glass effects
│   └── ...
├── components/
│   ├── ui/
│   │   ├── Navbar.tsx       ← Glass navbar
│   │   └── Footer.tsx       ← Dark glass footer
│   └── catalog/
│       ├── ProductCard.tsx  ← Glass product cards
│       └── ImageGallery.tsx ← Glass gallery
└── ...
```

---

## Usage Examples

### Basic Glass Card
```tsx
<div className="glass-card rounded-2xl p-6 glass-card-hover">
  <h3 className="text-xl font-semibold">Content</h3>
  <p className="text-gray-600">Description</p>
</div>
```

### Glass Button
```tsx
<button className="btn-glass px-6 py-3 rounded-xl font-semibold">
  Click Me
</button>
```

### Animated Background
```tsx
<section className="bg-gradient-mesh min-h-screen">
  <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl animate-float" />
  {/* Content */}
</section>
```

### Loading State
```tsx
<div className="skeleton h-10 rounded-xl" />
```

---

## Performance Metrics

### Target Scores
- Lighthouse Performance: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Cumulative Layout Shift: < 0.1

### Optimization Tips
1. Limit blur radius to 24px max
2. Use `will-change: transform` sparingly
3. Avoid multiple backdrop-filters on same element
4. Lazy load images below the fold
5. Use CSS containment for complex components

---

**Theme Version:** 1.0  
**Last Updated:** 2026  
**Design Inspiration:** Apple Inc.
