# 🎨 MediBot UI/UX Design Documentation

## Overview

This document provides comprehensive UI/UX design specifications for MediBot, including wireframes, component hierarchy, color schemes, and design principles.

---

## 📋 Table of Contents

- [Design Principles](#design-principles)
- [Color Palette](#color-palette)
- [Typography](#typography)
- [Component Library](#component-library)
- [Page Wireframes](#page-wireframes)
- [Responsive Design](#responsive-design)
- [Accessibility](#accessibility)

---

## 🎯 Design Principles

### 1. **User-Centered Design**
- Focus on user needs and healthcare accessibility
- Simple, intuitive navigation
- Clear call-to-action buttons

### 2. **Professional & Trustworthy**
- Clean, medical-grade aesthetic
- Consistent branding
- Trust indicators (security badges, certifications)

### 3. **Accessibility First**
- WCAG 2.1 AA compliance
- High contrast ratios
- Keyboard navigation support
- Screen reader compatibility

### 4. **Mobile-First Approach**
- Responsive design for all devices
- Touch-friendly interfaces
- Optimized loading times

### 5. **Performance**
- Fast loading (< 3 seconds)
- Smooth animations (60 FPS)
- Optimized images and assets

---

## 🎨 Color Palette

### Primary Colors

```
Medical Blue (Primary)
├─ Light:    #60A5FA
├─ Main:     #3B82F6
├─ Dark:     #2563EB
└─ Darkest:  #1E40AF

Health Green (Secondary)
├─ Light:    #34D399
├─ Main:     #10B981
├─ Dark:     #059669
└─ Darkest:  #047857
```

### Semantic Colors

```
Success:     #10B981
Warning:     #F59E0B
Error:       #EF4444
Info:        #3B82F6
Critical:    #DC2626
```

### Neutral Colors

```
White:       #FFFFFF
Gray 50:     #F9FAFB
Gray 100:    #F3F4F6
Gray 200:    #E5E7EB
Gray 300:    #D1D5DB
Gray 400:    #9CA3AF
Gray 500:    #6B7280
Gray 600:    #4B5563
Gray 700:    #374151
Gray 800:    #1F2937
Gray 900:    #111827
Black:       #000000
```

### Usage Guidelines

| Element | Color |
|---------|-------|
| Primary Buttons | Medical Blue (#3B82F6) |
| Secondary Buttons | Health Green (#10B981) |
| Links | Medical Blue (#3B82F6) |
| Success Messages | Health Green (#10B981) |
| Error Messages | Error Red (#EF4444) |
| Background | Gray 50 (#F9FAFB) |
| Text | Gray 900 (#111827) |

---

## 📝 Typography

### Font Family

```
Primary Font: Inter (Google Fonts)
Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

Monospace: 'Fira Code', 'Courier New', monospace
```

### Font Sizes

```
xs:   0.75rem  (12px)
sm:   0.875rem (14px)
base: 1rem     (16px)
lg:   1.125rem (18px)
xl:   1.25rem  (20px)
2xl:  1.5rem   (24px)
3xl:  1.875rem (30px)
4xl:  2.25rem  (36px)
5xl:  3rem     (48px)
```

### Font Weights

```
Normal:  400
Medium:  500
Semibold: 600
Bold:    700
```

### Line Heights

```
Tight:   1.25
Normal:  1.5
Relaxed: 1.75
```

---

## 🧩 Component Library

### Button Components

#### Primary Button
```tsx
<Button variant="primary" size="md">
  Get Started
</Button>
```
- Background: Medical Blue
- Text: White
- Border-radius: 6px
- Padding: 12px 24px

#### Secondary Button
```tsx
<Button variant="secondary" size="md">
  Learn More
</Button>
```
- Background: Transparent
- Border: 2px solid Medical Blue
- Text: Medical Blue

#### Danger Button
```tsx
<Button variant="danger" size="md">
  Delete Account
</Button>
```
- Background: Error Red
- Text: White

---

### Input Components

#### Text Input
```tsx
<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  error="Invalid email format"
/>
```

#### Search Input
```tsx
<SearchInput
  placeholder="Search diseases..."
  onSearch={handleSearch}
/>
```

---

### Chat Components

#### Message Bubble (User)
```tsx
<MessageBubble
  type="user"
  content="I have fever and headache"
  timestamp="10:30 AM"
/>
```
- Background: Medical Blue
- Text: White
- Border-radius: 16px (top-left: 4px)

#### Message Bubble (Bot)
```tsx
<MessageBubble
  type="bot"
  content="Based on your symptoms..."
  timestamp="10:30 AM"
  symptoms={['Fever', 'Headache']}
  diseases={[{name: 'Common Cold', confidence: 0.85}]}
/>
```
- Background: White
- Text: Gray 900
- Border: 1px solid Gray 200
- Border-radius: 16px (top-right: 4px)

#### Typing Indicator
```tsx
<TypingIndicator />
```
- Three bouncing dots
- Animation: 0.6s ease-in-out infinite

---

### Card Components

#### Disease Card
```tsx
<DiseaseCard
  name="Common Cold"
  icd10_code="J00"
  severity="Mild"
  symptom_count={8}
/>
```

#### Stat Card
```tsx
<StatCard
  title="Total Consultations"
  value="1,234"
  trend="+12%"
  icon={<ConsultationIcon />}
/>
```

---

## 📱 Page Wireframes

### 1. Landing Page

```
┌─────────────────────────────────────────────────────────────┐
│  NAVIGATION BAR                                             │
│  [Logo] MediBot    [Features] [About] [Login] [Sign Up]    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  HERO SECTION                                               │
│  ┌─────────────────────────────────────┐                    │
│  │  Your AI Healthcare Assistant       │   [Illustration]  │
│  │  Get instant medical guidance       │   [Chatbot Image] │
│  │  [Start Chat Now] [Learn More]      │                   │
│  └─────────────────────────────────────┘                    │
│                                                              │
│  FEATURES SECTION                                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ 🎯       │  │ 🤖       │  │ 🔒       │                  │
│  │ Accurate │  │ 24/7     │  │ Secure   │                  │
│  │ Diagnosis│  │ Available│  │ & Private│                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
│                                                              │
│  HOW IT WORKS                                               │
│  Step 1 → Step 2 → Step 3                                   │
│  Describe   Get       Follow                                │
│  Symptoms   Diagnosis Advice                                │
│                                                              │
│  TESTIMONIALS                                               │
│  [User Review 1] [User Review 2] [User Review 3]           │
│                                                              │
│  FOOTER                                                     │
│  [Links] [Social Media] [Copyright]                        │
└─────────────────────────────────────────────────────────────┘
```

---

### 2. Chat Interface (Main Feature)

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
│  [Menu] MediBot Chat              [Profile] [Settings]     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  CHAT AREA (Scrollable)                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                      │   │
│  │  [Bot Avatar]                                       │   │
│  │  Hello! I'm MediBot. How can I help you today?     │   │
│  │  10:00 AM                                           │   │
│  │                                                      │   │
│  │                          [User Avatar]              │   │
│  │                          I have fever and headache  │   │
│  │                          10:01 AM                   │   │
│  │                                                      │   │
│  │  [Bot Avatar]                                       │   │
│  │  Based on your symptoms, you may have:              │   │
│  │  • Common Cold (85% confidence)                     │   │
│  │  • Viral Fever (72% confidence)                     │   │
│  │                                                      │   │
│  │  💡 Advice:                                         │   │
│  │  • Rest and stay hydrated                          │   │
│  │  • Take paracetamol for fever                      │   │
│  │                                                      │   │
│  │  🌿 Home Remedies:                                  │   │
│  │  • Warm salt water gargle                          │   │
│  │  • Steam inhalation                                │   │
│  │  10:01 AM                                           │   │
│  │                                                      │   │
│  │  [Typing Indicator...]                              │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  INPUT AREA                                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ [🎤] Type your message...               [Send] [📎] │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  QUICK ACTIONS                                              │
│  [Fever] [Headache] [Cough] [Cold] [More...]               │
└─────────────────────────────────────────────────────────────┘
```

---

### 3. User Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  SIDEBAR          │  MAIN CONTENT                           │
│  ┌─────────────┐  │                                         │
│  │ [Avatar]    │  │  Welcome back, John! 👋                │
│  │ John Doe    │  │                                         │
│  │             │  │  ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │ 📊 Dashboard│  │  │ Total    │ │ Consult- │ │ Health │ │
│  │ 💬 Chat     │  │  │ Consult- │ │ ations   │ │ Score  │ │
│  │ 📋 History  │  │  │ ations   │ │ Today    │ │        │ │
│  │ 🏥 Diseases │  │  │ 156      │ │ 12       │ │ 85/100 │ │
│  │ 📈 Analytics│  │  └──────────┘ └──────────┘ └────────┘ │
│  │ ⚙️ Settings │  │                                         │
│  │             │  │  RECENT ACTIVITY                      │
│  │ [Logout]    │  │  ┌─────────────────────────────────┐  │
│  └─────────────┘  │  │ Mar 25 - Common Cold check      │  │
│                   │  │ Mar 24 - Fever consultation     │  │
│                   │  │ Mar 22 - Headache advice        │  │
│                   │  └─────────────────────────────────┘  │
│                   │                                         │
│                   │  HEALTH TIPS                            │
│                   │  ┌─────────────────────────────────┐  │
│                   │  │ 💧 Stay hydrated - drink 8      │  │
│                   │  │ glasses of water daily          │  │
│                   │  └─────────────────────────────────┘  │
│                   │                                         │
└───────────────────┴─────────────────────────────────────────┘
```

---

### 4. Login Page

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                    ┌──────────────────┐                     │
│                    │   [MediBot Logo] │                     │
│                    │                  │                     │
│                    │   Welcome Back   │                     │
│                    │                  │                     │
│                    │   Email          │                     │
│                    │   ┌──────────┐   │                     │
│                    │   │          │   │                     │
│                    │   └──────────┘   │                     │
│                    │                  │                     │
│                    │   Password       │                     │
│                    │   ┌──────────┐   │                     │
│                    │   │          │   │                     │
│                    │   └──────────┘   │                     │
│                    │                  │                     │
│                    │   [Forgot Pass?] │                     │
│                    │                  │                     │
│                    │   [  Login  ]    │                     │
│                    │                  │                     │
│                    │   ─── OR ───     │                     │
│                    │                  │                     │
│                    │   [Google Login] │                     │
│                    │                  │                     │
│                    │   New user?      │                     │
│                    │   [Sign Up]      │                     │
│                    └──────────────────┘                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### 5. Admin Panel

```
┌─────────────────────────────────────────────────────────────┐
│  ADMIN PANEL                                                │
│  [Logo] MediBot Admin    [Dashboard] [Users] [Diseases]    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  STATS OVERVIEW                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ 👥       │ │ 💬       │ │ ⚠️       │ │ 📈       │      │
│  │ 1,234    │ │ 5,678    │ │ 45       │ │ 89%      │      │
│  │ Users    │ │ Chats    │ │ Alerts   │ │ Accuracy │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                              │
│  USER MANAGEMENT                                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Search users...                         [+ Add User]│   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ Name        │ Email          │ Role   │ Status     │   │
│  │ John Doe    │ john@mail.com  │ User   │ ✅ Active  │   │
│  │ Jane Smith  │ jane@mail.com  │ Admin  │ ✅ Active  │   │
│  │ Bob Wilson  │ bob@mail.com   │ User   │ ❌ Banned  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  DISEASE MANAGEMENT                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Search diseases...                     [+ Add Disease]│  │
│  ├─────────────────────────────────────────────────────┤   │
│  │ Name              │ Category    │ Severity │ Actions │   │
│  │ Common Cold       │ Respiratory │ Mild     │ ✏️ 🗑️  │   │
│  │ Diabetes          │ Endocrine   │ Severe   │ ✏️ 🗑️  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ANALYTICS                                                  │
│  [Chart: User Growth] [Chart: Top Diseases]                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📐 Responsive Design

### Breakpoints

```
Mobile (Small):    320px  - 639px
Mobile (Large):    640px  - 767px
Tablet:            768px  - 1023px
Desktop (Small):   1024px - 1279px
Desktop (Medium):  1280px - 1535px
Desktop (Large):   1536px+
```

### Mobile Layout

```
┌─────────────────┐
│ [Menu] Logo     │
├─────────────────┤
│                 │
│  Content        │
│                 │
│                 │
├─────────────────┤
│ [Bottom Nav]    │
│ 🏠 💬 📊 👤    │
└─────────────────┘
```

### Tablet Layout

```
┌─────────────────────────────────┐
│ [Logo]  Nav Links    [Profile] │
├─────────────────────────────────┤
│                                 │
│  Content (2 columns)            │
│                                 │
└─────────────────────────────────┘
```

### Desktop Layout

```
┌─────────────────────────────────────────────────┐
│ [Logo]  Nav Links              [Profile] [⚙️]  │
├──────────┬──────────────────────────────────────┤
│ Sidebar  │  Main Content                        │
│          │                                      │
│ - Menu   │  (Full width minus sidebar)          │
│ - Quick  │                                      │
│ - Access │                                      │
└──────────┴──────────────────────────────────────┘
```

---

## ♿ Accessibility

### WCAG 2.1 AA Compliance

#### 1. **Perceivable**
- Text alternatives for images
- Captions for videos
- Minimum contrast ratio: 4.5:1
- Resizable text up to 200%

#### 2. **Operable**
- Full keyboard navigation
- No keyboard traps
- Skip to content link
- Focus indicators

#### 3. **Understandable**
- Clear labels and instructions
- Consistent navigation
- Error messages with suggestions
- Language attribute set

#### 4. **Robust**
- Valid HTML/CSS
- ARIA labels where needed
- Screen reader compatible
- Progressive enhancement

### Accessibility Features

```tsx
// Focus Management
<button
  className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
  aria-label="Submit form"
>
  Submit
</button>

// Screen Reader Support
<div role="alert" aria-live="assertive">
  Error: Please fill all required fields
</div>

// Skip Link
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

---

## 🎭 Animations

### Loading States

```tsx
// Spinner
<Spinner size="md" color="blue" />

// Skeleton Loader
<Skeleton height="200px" width="100%" />

// Progress Bar
<ProgressBar progress={75} />
```

### Transitions

```
Duration:
- Fast:   150ms
- Normal: 300ms
- Slow:   500ms

Easing:
- Ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
- Bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

---

## 📊 Design Tools

### Recommended Tools

- **Design:** Figma, Adobe XD
- **Prototyping:** InVision, Framer
- **Handoff:** Zeplin
- **Icons:** Heroicons, Feather Icons
- **Illustrations:** unDraw, Storyset

### Figma File Structure

```
MediBot Design/
├── 📁 Cover
├── 📁 Foundations
│   ├── Colors
│   ├── Typography
│   ├── Icons
│   └── Grid System
├── 📁 Components
│   ├── Atoms
│   ├── Molecules
│   └── Organisms
├── 📁 Pages
│   ├── Landing
│   ├── Chat
│   ├── Dashboard
│   └── Admin
└── 📁 Prototypes
    ├── User Flow
    └── Interactions
```

---

## 📞 Design Review Checklist

### Before Development

- [ ] All screens designed
- [ ] Components documented
- [ ] Interactions specified
- [ ] Responsive variants created
- [ ] Accessibility checked
- [ ] Design system complete

### During Development

- [ ] Pixel-perfect implementation
- [ ] Responsive breakpoints working
- [ ] Animations smooth
- [ ] Accessibility maintained
- [ ] Performance optimized

### Before Launch

- [ ] Cross-browser testing
- [ ] Device testing
- [ ] Performance audit
- [ ] Accessibility audit
- [ ] User testing completed

---

**© 2024 MediBot Team. All Rights Reserved.**
