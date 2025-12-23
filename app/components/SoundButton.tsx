'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MouseEventHandler, ReactNode } from 'react';
import { useSoundEffect } from '../contexts/AudioProvider';

interface SoundButtonProps {
    children: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    href?: string;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

export default function SoundButton({
    children,
    onClick,
    href,
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = '',
    type = 'button',
}: SoundButtonProps) {
    const { playClick, playHover, initializeAudio } = useSoundEffect();

    const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        initializeAudio();
        playClick();
        onClick?.(e);
    };

    const handleHover = () => {
        playHover();
    };

    const baseStyles = 'font-semibold rounded-xl transition-all duration-200 cursor-pointer inline-flex items-center justify-center gap-2';

    const variantStyles = {
        primary: 'bg-gradient-to-r from-quantum-purple to-nexus-blue text-white hover:opacity-90 shadow-lg shadow-quantum-purple/25',
        secondary: 'glass border border-white/10 text-white hover:border-white/20 hover:bg-white/5',
        ghost: 'text-text-secondary hover:text-white hover:bg-white/5',
        danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:opacity-90 shadow-lg',
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-8 py-3 text-base',
    };

    const buttonClass = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

    // If href is provided, render as Link
    if (href) {
        return (
            <Link href={href}>
                <motion.span
                    className={buttonClass}
                    whileHover={{ scale: disabled ? 1 : 1.02 }}
                    whileTap={{ scale: disabled ? 1 : 0.98 }}
                    onHoverStart={handleHover}
                >
                    {children}
                </motion.span>
            </Link>
        );
    }

    return (
        <motion.button
            type={type}
            onClick={handleClick}
            disabled={disabled}
            className={buttonClass}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onHoverStart={handleHover}
        >
            {children}
        </motion.button>
    );
}

// Card wrapper with click sound
interface SoundCardProps {
    children: ReactNode;
    onClick?: () => void;
    href?: string;
    className?: string;
}

export function SoundCard({ children, onClick, href, className = '' }: SoundCardProps) {
    const { playClick, playHover, initializeAudio } = useSoundEffect();

    const handleClick = () => {
        initializeAudio();
        playClick();
        onClick?.();
    };

    const handleHover = () => {
        playHover();
    };

    const cardContent = (
        <motion.div
            className={`cursor-pointer ${className}`}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={handleHover}
            onClick={onClick ? handleClick : undefined}
        >
            {children}
        </motion.div>
    );

    if (href) {
        return (
            <Link href={href} onClick={handleClick}>
                {cardContent}
            </Link>
        );
    }

    return cardContent;
}
