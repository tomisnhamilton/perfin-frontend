// src/components/ui/Card.jsx - Even more simplified Card component
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';
import { useColorScheme } from 'react-native';

// Simple Card component with manual dark mode support
export function Card({ children, style, ...rest }) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Create styles without theme reference
    const cardStyle = {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        ...style
    };

    return (
        <PaperCard
            style={cardStyle}
            {...rest}
        >
            {children}
        </PaperCard>
    );
}

// CardContent component
export function CardContent({ children, style, ...rest }) {
    return (
        <PaperCard.Content
            style={style}
            {...rest}
        >
            {children}
        </PaperCard.Content>
    );
}

// CardTitle component
export function CardTitle({
                              title,
                              subtitle,
                              style,
                              ...rest
                          }) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Create styles without theme reference
    const titleStyle = {
        color: isDark ? '#f9fafb' : '#1f2937',
    };

    const subtitleStyle = {
        color: isDark ? '#9ca3af' : '#6b7280',
    };

    return (
        <PaperCard.Title
            title={title}
            subtitle={subtitle}
            titleStyle={titleStyle}
            subtitleStyle={subtitleStyle}
            style={style}
            {...rest}
        />
    );
}

// CardActions component
export function CardActions({ children, style, ...rest }) {
    return (
        <PaperCard.Actions
            style={style}
            {...rest}
        >
            {children}
        </PaperCard.Actions>
    );
}

// CardCover component
export function CardCover({ source, style, ...rest }) {
    return (
        <PaperCard.Cover
            source={source}
            style={style}
            {...rest}
        />
    );
}

// Create a composite object for easier importing
const CardComponents = {
    Card,
    Content: CardContent,
    Title: CardTitle,
    Actions: CardActions,
    Cover: CardCover
};

export default CardComponents;