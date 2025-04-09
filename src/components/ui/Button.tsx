import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

export interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export function Button({
                           title,
                           variant = 'primary',
                           size = 'md',
                           fullWidth = false,
                           className = '',
                           ...props
                       }: ButtonProps) {

    // Variant styles
    let buttonClass = '';
    let textClass = '';

    switch (variant) {
        case 'primary':
            buttonClass = 'bg-blue-600 active:bg-blue-700 dark:bg-blue-500 dark:active:bg-blue-600';
            textClass = 'text-white';
            break;
        case 'secondary':
            buttonClass = 'bg-gray-200 active:bg-gray-300 dark:bg-gray-700 dark:active:bg-gray-600';
            textClass = 'text-gray-800 dark:text-gray-100';
            break;
        case 'outline':
            buttonClass = 'bg-transparent border border-blue-600 dark:border-blue-400';
            textClass = 'text-blue-600 dark:text-blue-400';
            break;
        case 'danger':
            buttonClass = 'bg-red-600 active:bg-red-700 dark:bg-red-500 dark:active:bg-red-600';
            textClass = 'text-white';
            break;
    }

    // Size styles
    let sizeClass = '';
    let textSizeClass = '';

    switch (size) {
        case 'sm':
            sizeClass = 'py-2 px-3';
            textSizeClass = 'text-sm';
            break;
        case 'md':
            sizeClass = 'py-3 px-4';
            textSizeClass = 'text-base';
            break;
        case 'lg':
            sizeClass = 'py-4 px-6';
            textSizeClass = 'text-lg';
            break;
    }

    // Width style
    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <TouchableOpacity
            className={`rounded-lg ${buttonClass} ${sizeClass} ${widthClass} ${className}`}
            {...props}
        >
            <Text className={`text-center font-medium ${textClass} ${textSizeClass}`}>{title}</Text>
        </TouchableOpacity>
    );
}