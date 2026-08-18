/**
 * Jiwar Design System — Shared Components
 * Reusable primitives used across all screens.
 */

import { colors, fonts, fontSize, lineHeight, radius, spacing, heights, shadows } from '@/constants/theme';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TextProps,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    ViewProps,
} from 'react-native';

// ─── Typography ──────────────────────────────────────────────────────────────

interface TypographyProps extends TextProps {
    children: React.ReactNode;
}

/** Large editorial display heading — Playfair Display */
export function DisplayText({ style, ...props }: TypographyProps) {
    return (
        <Text
            style={[
                {
                    fontFamily: fonts.display,
                    fontSize: fontSize.display,
                    lineHeight: lineHeight.display,
                    color: colors.textPrimary,
                },
                style,
            ]}
            {...props}
        />
    );
}

/** H1 heading — Playfair Display */
export function H1({ style, ...props }: TypographyProps) {
    return (
        <Text
            style={[
                {
                    fontFamily: fonts.display,
                    fontSize: fontSize.h1,
                    lineHeight: lineHeight.h1,
                    color: colors.textPrimary,
                },
                style,
            ]}
            {...props}
        />
    );
}

/** H2 heading — Playfair Display */
export function H2({ style, ...props }: TypographyProps) {
    return (
        <Text
            style={[
                {
                    fontFamily: fonts.display,
                    fontSize: fontSize.h2,
                    lineHeight: lineHeight.h2,
                    color: colors.textPrimary,
                },
                style,
            ]}
            {...props}
        />
    );
}

/** H3 heading — Playfair Display */
export function H3({ style, ...props }: TypographyProps) {
    return (
        <Text
            style={[
                {
                    fontFamily: fonts.displaySB,
                    fontSize: fontSize.h3,
                    lineHeight: lineHeight.h3,
                    color: colors.textPrimary,
                },
                style,
            ]}
            {...props}
        />
    );
}

/** Screen / section title — Inter SemiBold */
export function TitleText({ style, ...props }: TypographyProps) {
    return (
        <Text
            style={[
                {
                    fontFamily: fonts.bodySB,
                    fontSize: fontSize.title,
                    lineHeight: lineHeight.title,
                    color: colors.textPrimary,
                },
                style,
            ]}
            {...props}
        />
    );
}

/** Body text — Inter Regular */
export function BodyText({ style, ...props }: TypographyProps) {
    return (
        <Text
            style={[
                {
                    fontFamily: fonts.body,
                    fontSize: fontSize.body,
                    lineHeight: lineHeight.body,
                    color: colors.textSecondary,
                },
                style,
            ]}
            {...props}
        />
    );
}

/** Label — Inter Medium */
export function LabelText({ style, ...props }: TypographyProps) {
    return (
        <Text
            style={[
                {
                    fontFamily: fonts.bodyM,
                    fontSize: fontSize.label,
                    lineHeight: lineHeight.label,
                    color: colors.textSecondary,
                },
                style,
            ]}
            {...props}
        />
    );
}

/** Caption — Inter Regular, small */
export function CaptionText({ style, ...props }: TypographyProps) {
    return (
        <Text
            style={[
                {
                    fontFamily: fonts.body,
                    fontSize: fontSize.caption,
                    lineHeight: lineHeight.caption,
                    color: colors.textMuted,
                },
                style,
            ]}
            {...props}
        />
    );
}

// ─── Section Header ──────────────────────────────────────────────────────────

interface SectionHeaderProps {
    title: string;
    action?: string;
    onAction?: () => void;
}

export function SectionHeader({ title, action, onAction }: SectionHeaderProps) {
    return (
        <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>{title}</Text>
            {action && (
                <TouchableOpacity onPress={onAction} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Text style={styles.sectionHeaderAction}>{action}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

/** Uppercase category label — used inside filters, form sections */
export function SectionLabel({ children }: { children: string }) {
    return (
        <Text style={styles.sectionLabel}>{children}</Text>
    );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

export function Divider({ style }: { style?: any }) {
    return (
        <View
            style={[
                {
                    height: 1,
                    backgroundColor: colors.border,
                },
                style,
            ]}
        />
    );
}

// ─── Buttons ─────────────────────────────────────────────────────────────────

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
    label: string;
    loading?: boolean;
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    style?: any;
}

export function Button({
    variant = 'primary',
    label,
    loading = false,
    size = 'lg',
    icon,
    style,
    disabled,
    ...props
}: ButtonProps) {
    const containerStyle = [
        styles.buttonBase,
        size === 'sm' && styles.buttonSm,
        size === 'md' && styles.buttonMd,
        variant === 'primary' && styles.buttonPrimary,
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'ghost' && styles.buttonGhost,
        variant === 'destructive' && styles.buttonDestructive,
        (disabled || loading) && styles.buttonDisabled,
        style,
    ];

    const labelStyle = [
        styles.buttonLabel,
        size === 'sm' && styles.buttonLabelSm,
        variant === 'primary' && styles.buttonLabelPrimary,
        variant === 'secondary' && styles.buttonLabelSecondary,
        variant === 'ghost' && styles.buttonLabelGhost,
        variant === 'destructive' && styles.buttonLabelDestructive,
    ];

    return (
        <TouchableOpacity
            style={containerStyle}
            disabled={disabled || loading}
            activeOpacity={0.75}
            {...props}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'primary' || variant === 'destructive' ? colors.surface : colors.brand}
                    size="small"
                />
            ) : (
                <>
                    {icon && <View style={{ marginRight: spacing.sm }}>{icon}</View>}
                    <Text style={labelStyle}>{label}</Text>
                </>
            )}
        </TouchableOpacity>
    );
}

// ─── Text Input ───────────────────────────────────────────────────────────────

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export function AppTextInput({
    label,
    error,
    leftIcon,
    rightIcon,
    style,
    ...props
}: InputProps) {
    const [focused, setFocused] = useState(false);

    return (
        <View style={{ width: '100%' }}>
            {label && (
                <Text style={styles.inputLabel}>{label}</Text>
            )}
            <View
                style={[
                    styles.inputContainer,
                    focused && styles.inputContainerFocused,
                    error ? styles.inputContainerError : null,
                ]}
            >
                {leftIcon && (
                    <View style={styles.inputLeftIcon}>{leftIcon}</View>
                )}
                <TextInput
                    style={[
                        styles.inputField,
                        leftIcon ? { paddingLeft: 0 } : null,
                        style,
                    ]}
                    placeholderTextColor={colors.textMuted}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    {...props}
                />
                {rightIcon && (
                    <View style={styles.inputRightIcon}>{rightIcon}</View>
                )}
            </View>
            {error && (
                <Text style={styles.inputError}>{error}</Text>
            )}
        </View>
    );
}

// ─── Badge ───────────────────────────────────────────────────────────────────

interface BadgeProps {
    label: string;
    variant?: 'type' | 'featured' | 'sold' | 'verified' | 'new';
}

export function Badge({ label, variant = 'type' }: BadgeProps) {
    const containerStyle = [
        styles.badgeBase,
        variant === 'featured' && styles.badgeFeatured,
        variant === 'sold' && styles.badgeSold,
        variant === 'verified' && styles.badgeVerified,
        variant === 'new' && styles.badgeNew,
    ];
    const labelStyle = [
        styles.badgeLabel,
        variant === 'featured' && styles.badgeLabelFeatured,
        variant === 'sold' && styles.badgeLabelSold,
        variant === 'verified' && styles.badgeLabelVerified,
        variant === 'new' && styles.badgeLabelNew,
    ];

    return (
        <View style={containerStyle}>
            <Text style={labelStyle}>{label}</Text>
        </View>
    );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
    return (
        <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>{icon}</View>
            <Text style={styles.emptyStateTitle}>{title}</Text>
            {description && (
                <Text style={styles.emptyStateDescription}>{description}</Text>
            )}
            {actionLabel && onAction && (
                <TouchableOpacity
                    onPress={onAction}
                    style={styles.emptyStateButton}
                    activeOpacity={0.75}
                >
                    <Text style={styles.emptyStateButtonLabel}>{actionLabel}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

// ─── App Screen ───────────────────────────────────────────────────────────────

export function AppScreen({ children, style, ...props }: ViewProps & { children: React.ReactNode }) {
    return (
        <View style={[styles.screen, style]} {...props}>
            {children}
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    // Section headers
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    sectionHeaderTitle: {
        fontFamily: fonts.bodySB,
        fontSize: fontSize.title,
        color: colors.textPrimary,
    },
    sectionHeaderAction: {
        fontFamily: fonts.bodyM,
        fontSize: fontSize.label,
        color: colors.brand,
    },
    sectionLabel: {
        fontFamily: fonts.bodySB,
        fontSize: fontSize.nano,
        color: colors.textMuted,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginBottom: spacing.md,
    },

    // Buttons
    buttonBase: {
        height: heights.buttonDefault,
        borderRadius: radius.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
    },
    buttonSm: {
        height: heights.buttonSm,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.sm,
    },
    buttonMd: {
        height: 44,
        paddingHorizontal: spacing.lg,
    },
    buttonPrimary: {
        backgroundColor: colors.brand,
    },
    buttonSecondary: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.borderStrong,
    },
    buttonGhost: {
        backgroundColor: 'transparent',
    },
    buttonDestructive: {
        backgroundColor: colors.error,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonLabel: {
        fontFamily: fonts.bodySB,
        fontSize: fontSize.bodyLg,
        color: colors.surface,
    },
    buttonLabelSm: {
        fontSize: fontSize.label,
    },
    buttonLabelPrimary: {
        color: colors.surface,
    },
    buttonLabelSecondary: {
        color: colors.textPrimary,
    },
    buttonLabelGhost: {
        color: colors.brand,
    },
    buttonLabelDestructive: {
        color: colors.surface,
    },

    // Inputs
    inputLabel: {
        fontFamily: fonts.bodyM,
        fontSize: fontSize.label,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: heights.inputDefault,
        backgroundColor: colors.surface,
        borderRadius: radius.sm,
        borderWidth: 1,
        borderColor: colors.borderStrong,
        paddingHorizontal: spacing.lg,
    },
    inputContainerFocused: {
        borderColor: colors.brand,
        borderWidth: 1.5,
    },
    inputContainerError: {
        borderColor: colors.error,
    },
    inputField: {
        flex: 1,
        fontFamily: fonts.body,
        fontSize: fontSize.body,
        color: colors.textPrimary,
    },
    inputLeftIcon: {
        marginRight: spacing.md,
    },
    inputRightIcon: {
        marginLeft: spacing.sm,
    },
    inputError: {
        fontFamily: fonts.body,
        fontSize: fontSize.caption,
        color: colors.error,
        marginTop: spacing.xs,
    },

    // Badges
    badgeBase: {
        backgroundColor: colors.brandSubtle,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: radius.xs,
        alignSelf: 'flex-start',
    },
    badgeFeatured: {
        backgroundColor: 'rgba(201, 164, 106, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(201, 164, 106, 0.25)',
    },
    badgeSold: {
        backgroundColor: colors.errorBg,
        borderWidth: 1,
        borderColor: 'rgba(180, 68, 53, 0.15)',
    },
    badgeVerified: {
        backgroundColor: colors.brandSubtle,
    },
    badgeNew: {
        backgroundColor: colors.brandSubtle,
    },
    badgeLabel: {
        fontFamily: fonts.bodySB,
        fontSize: fontSize.nano,
        color: colors.brand,
        textTransform: 'capitalize',
        letterSpacing: 0.3,
    },
    badgeLabelFeatured: {
        color: colors.accentGold,
        letterSpacing: 0.2,
    },
    badgeLabelSold: {
        color: colors.error,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    badgeLabelVerified: {
        color: colors.brand,
    },
    badgeLabelNew: {
        color: colors.brand,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    // Empty state
    emptyState: {
        alignItems: 'center',
        paddingVertical: spacing.giga,
        paddingHorizontal: spacing.xxl,
    },
    emptyStateIcon: {
        width: 64,
        height: 64,
        borderRadius: radius.lg,
        backgroundColor: colors.brandSubtle,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
    },
    emptyStateTitle: {
        fontFamily: fonts.displaySB,
        fontSize: fontSize.h3,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    emptyStateDescription: {
        fontFamily: fonts.body,
        fontSize: fontSize.body,
        color: colors.textMuted,
        textAlign: 'center',
        lineHeight: lineHeight.body,
        marginBottom: spacing.xxl,
    },
    emptyStateButton: {
        backgroundColor: colors.brand,
        paddingHorizontal: spacing.xxl,
        paddingVertical: spacing.md,
        borderRadius: radius.md,
    },
    emptyStateButtonLabel: {
        fontFamily: fonts.bodySB,
        fontSize: fontSize.body,
        color: colors.surface,
    },

    // Screen
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
});
