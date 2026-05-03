---
version: alpha
name: Stride
description: Athletic endurance training UI with strong typography, warm action color, and utilitarian product density.
colors:
  background: "#fbfaf7"
  foreground: "#332d27"
  surface: "#ffffff"
  surface-2: "#f3f1ec"
  card: "#ffffff"
  primary: "#f06f24"
  secondary: "#39332e"
  muted: "#efeee9"
  accent: "#f2c94c"
  destructive: "#d64032"
  border: "#e5e1d8"
  kudos: "#f06f24"
  pr: "#46c272"
typography:
  display:
    fontFamily: "Space Grotesk"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "Space Grotesk"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "0"
  label:
    fontFamily: "JetBrains Mono"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.22em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
spacing:
  base: "4px"
  rhythm: "8px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    height: "36px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    height: "36px"
---

# Stride Design System

## Overview

Stride is a focused endurance-training product. The interface should feel athletic and direct: strong headings, compact controls, high-contrast calls to action, and data that is easy to scan. The brand voice is practical and momentum-oriented rather than decorative or motivational.

This is a best-effort draft inferred from the current codebase. The exact CSS variables in `src/styles.css` and the Shadcn primitive source files remain authoritative for implementation details.

## Colors

The core palette pairs a warm bone background with deep ink text and a signal-orange primary action color. Orange should mark decisive moments: signing in, recording effort, kudos, or the single primary action in a view. Secondary ink blocks can carry navigation, hero contrast, or selected segmented states. The PR green token is reserved for achievement and positive performance markers.

The YAML hex values are approximate sRGB references for human readability. The production styles use `oklch()` tokens in `src/styles.css`; preserve those verbatim when building.

## Typography

Use Space Grotesk for identity, display headings, stat numbers, and large editorial moments. Use Inter for body copy and form text. Use JetBrains Mono sparingly for labels, metadata, timestamps, and small uppercase annotations.

Headings should be confident but not oversized inside operational UI. Body copy should be concise and supportive; the product should not rely on paragraphs to explain itself.

## Layout

Layouts favor full-height product surfaces, split-screen compositions for authentication and onboarding, and dense but breathable spacing. Use 8px rhythm for most gaps, with 4px half-steps for compact labels and control internals. Keep form widths constrained around 28rem so fields stay easy to scan.

For pages with imagery, keep the product or activity signal visible in the first viewport and avoid card-heavy marketing compositions.

## Elevation & Depth

Hierarchy is primarily created with borders, tonal surfaces, typography, and contrast. Shadows are restrained and should not become the main visual language. Use thin borders around controls and panels; reserve stronger contrast for selected states and primary actions.

## Shapes

Corners are modest. The global radius is 8px, with Shadcn primitives using 6px and 8px derived radii. Avoid pill-heavy interfaces unless the element is a small badge or metadata chip.

## Components

Buttons use Shadcn's New York variant structure. Primary buttons are orange and should appear once per main action area. Secondary buttons use deep ink. Outline and ghost buttons are appropriate for lower-emphasis navigation and toggles.

Inputs are quiet, bordered, and transparent against the page background. Authentication fields may use taller custom inputs with embedded lucide icons, matching the current `/auth` route.

Small uppercase mono labels are used for metadata and mode indicators. Segment controls can use bordered two-column layouts with a filled secondary selected state.

## Do's and Don'ts

Do use orange for the most important action on the screen.

Do keep product workflows compact and scannable.

Do pair large display type with functional controls, not decorative cards.

Don't make the UI feel like a generic SaaS dashboard.

Don't overuse gradients; the existing orange gradient is an accent utility, not a default background.

Don't mix many corner radii in the same view.
