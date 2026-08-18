/**
 * Jiwar — Desert Minimal Design System
 * Centralized design tokens. All UI should reference this file.
 * Do NOT hardcode colors, spacing, or radius values in screens.
 */

import { Platform } from 'react-native';

// ─── Color Palette ──────────────────────────────────────────────────────────

export const colors = {
    // Backgrounds
    background: '#FAF8F4',   // Warm ivory — primary page background
    surface: '#FFFFFF',   // Pure white — cards, inputs, modals
    surfaceWarm: '#F5F0E8',   // Sand — secondary surfaces, warm highlights

    // Text
    textPrimary: '#1C1C1E',   // Charcoal — headings, titles
    textSecondary: '#6F6F6F',   // Dark stone — body text, descriptions
    textMuted: '#8E8E93',   // Light stone — placeholders, metadata, secondary labels

    // Brand
    brand: '#6B7A57',   // Olive — primary CTAs, active nav, selected states
    brandPressed: '#5A6748',   // Olive pressed — slightly darker
    brandSubtle: '#F0F2EC',   // Olive background — very subtle surface tint

    // Accent
    accentGold: '#C9A46A',   // Muted gold — Featured markers, premium accents ONLY

    // Semantic
    error: '#B44435',   // Terracotta red — errors, destructive
    errorBg: '#FAF0EE',   // Error background
    success: '#4A7A5C',   // Deep green — success states
    successBg: '#EEF5F1',   // Success background

    // Borders
    border: 'rgba(28, 28, 30, 0.08)',    // Default subtle border
    borderStrong: 'rgba(28, 28, 30, 0.16)',    // Stronger border for inputs on ivory bg
    borderWarm: 'rgba(201, 164, 106, 0.20)', // Gold-tinted border for featured

    // Overlays
    overlayLight: 'rgba(28, 28, 30, 0.04)',
    overlayMedium: 'rgba(28, 28, 30, 0.32)',
    overlayImage: 'rgba(28, 28, 30, 0.28)',    // Subtle image scrim for text readability
} as const;

// ─── Typography ─────────────────────────────────────────────────────────────

export const fonts = {
    display: Platform.select({ web: '"PlayfairDisplay-Medium", "Playfair Display", Georgia, serif', default: 'PlayfairDisplay-Medium' }),
    displaySB: Platform.select({ web: '"PlayfairDisplay-SemiBold", "Playfair Display", Georgia, serif', default: 'PlayfairDisplay-SemiBold' }),
    displayI: Platform.select({ web: '"PlayfairDisplay-Italic", "Playfair Display", Georgia, serif', default: 'PlayfairDisplay-Italic' }),
    body: Platform.select({ web: '"Inter-Regular", "Inter", -apple-system, sans-serif', default: 'Inter-Regular' }),
    bodyM: Platform.select({ web: '"Inter-Medium", "Inter", -apple-system, sans-serif', default: 'Inter-Medium' }),
    bodySB: Platform.select({ web: '"Inter-SemiBold", "Inter", -apple-system, sans-serif', default: 'Inter-SemiBold' }),
    bodyB: Platform.select({ web: '"Inter-Bold", "Inter", -apple-system, sans-serif', default: 'Inter-Bold' }),
} as const;

export const fontSize = {
    display: 32,   // Display editorial
    h1: 28,   // Primary headings
    h2: 24,   // Section headings
    h3: 20,   // Sub-section headings
    title: 18,   // Screen titles
    bodyLg: 16,   // Large body
    body: 14,   // Default body
    label: 13,   // Labels, meta
    caption: 12,   // Small captions
    micro: 11,   // Tiny labels, badges
    nano: 10,   // Section labels (uppercase caps)
} as const;

export const lineHeight = {
    display: 40,
    h1: 36,
    h2: 32,
    h3: 28,
    title: 26,
    bodyLg: 24,
    body: 22,
    label: 18,
    caption: 16,
} as const;

// ─── Spacing ────────────────────────────────────────────────────────────────

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
    mega: 48,
    giga: 64,

    // Semantic aliases
    pageHorizontal: 20,    // Standard horizontal screen padding
    pagePaddingTop: 16,    // Top padding for screen content
    sectionGap: 28,    // Gap between major sections
    itemGap: 16,    // Gap between list items
    internalGap: 12,    // Internal component padding
} as const;

// ─── Border Radius ──────────────────────────────────────────────────────────

export const radius = {
    xs: 6,   // Micro chips, small badges
    sm: 8,   // Input corners, small cards
    md: 12,  // Standard cards, buttons
    lg: 16,  // Large cards, featured cards
    xl: 20,  // Extra large cards
    pill: 100, // Only for genuine pill shapes (use sparingly)
} as const;

// ─── Shadows ────────────────────────────────────────────────────────────────

export const shadows = {
    none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    subtle: {
        shadowColor: '#1C1C1E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    card: {
        shadowColor: '#1C1C1E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    floating: {
        shadowColor: '#1C1C1E',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 5,
    },
} as const;

// ─── Component Heights ───────────────────────────────────────────────────────

export const heights = {
    inputDefault: 50,   // Standard input height
    buttonDefault: 50,   // Standard button height
    buttonSm: 40,   // Small button
    navBar: 62,   // Bottom navigation bar
    headerBar: 52,   // App header bar
    tabBarItem: 48,   // Tab bar item height
} as const;

// ─── Icon Sizes ──────────────────────────────────────────────────────────────

export const iconSizes = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
} as const;
