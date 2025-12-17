'use client';

interface CharacterIconProps {
    name: string;
    className?: string;
}

export default function CharacterIcon({ name, className = "w-full h-full" }: CharacterIconProps) {
    const normalizedName = name.toLowerCase();

    // Icon definitions
    const icons: Record<string, React.ReactNode> = {
        // Iron Man (Arc Reactor)
        'iron man': (
            <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                <path d="M12 2L9 4L10 7H14L15 4L12 2Z" fillOpacity="0.5" />
                <path d="M7 10L5 12L7 14H9L10 12L9 10H7Z" fillOpacity="0.5" />
                <path d="M17 10L15 12L14 10H17Z" fillOpacity="0.5" />
                <path d="M19 12L17 14H15L14 12H19Z" fillOpacity="0.5" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" fillRule="evenodd" clipRule="evenodd" />
            </svg>
        ),
        'tony stark': (
            <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                <path d="M12 2L4 7V17L12 22L20 17V7L12 2ZM12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16Z" opacity="0.8" />
                <circle cx="12" cy="12" r="2" fill="white" />
            </svg>
        ),

        // Captain America (Shield)
        'captain america': (
            <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7" />
                <circle cx="12" cy="12" r="4" fill="currentColor" />
                <path d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z" fill="white" transform="scale(0.3) translate(28, 28)" />
            </svg>
        ),
        'steve rogers': (
            <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                <path d="M12 2L15 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
        ),

        // Thor (Mjolnir)
        'thor': (
            <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                <rect x="7" y="2" width="10" height="12" rx="1" fill="currentColor" />
                <rect x="11" y="14" width="2" height="8" fill="currentColor" opacity="0.8" />
                <path d="M8 4L11 8L16 4" stroke="white" strokeWidth="1" fill="none" opacity="0.5" />
            </svg>
        ),

        // Hulk (Fist)
        'hulk': (
            <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                <path d="M18 4H6C4.9 4 4 4.9 4 6V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V6C20 4.9 19.1 4 18 4ZM16 16H8V8H16V16Z" fillOpacity="0.8" />
                <circle cx="12" cy="12" r="3" fill="white" opacity="0.5" />
            </svg>
        ),
        'bruce banner': (
            <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" />
            </svg>
        ),

        // Black Widow (Hourglass)
        'black widow': (
            <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                <path d="M12 13.5L17 20H7L12 13.5ZM12 10.5L7 4H17L12 10.5Z" fill="currentColor" />
                <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
            </svg>
        ),

        // Loki (Helmet)
        'loki': (
            <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                <path d="M12 22C12 22 6 18 6 12V6L12 2L18 6V12C18 18 12 22 12 22Z" fill="currentColor" opacity="0.5" />
                <path d="M12 2L8 10H16L12 2Z" fill="white" />
                <path d="M8 10L4 4" stroke="currentColor" strokeWidth="2" />
                <path d="M16 10L20 4" stroke="currentColor" strokeWidth="2" />
            </svg>
        ),

        // Thanos (Gauntlet)
        'thanos': (
            <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                <rect x="6" y="8" width="12" height="14" rx="2" fill="currentColor" opacity="0.8" />
                <circle cx="9" cy="12" r="1.5" fill="#eab308" /> {/* Mind */}
                <circle cx="15" cy="12" r="1.5" fill="#a855f7" /> {/* Power */}
                <circle cx="12" cy="12" r="1.5" fill="#ef4444" /> {/* Reality */}
                <circle cx="9" cy="16" r="1.5" fill="#3b82f6" /> {/* Space */}
                <circle cx="15" cy="16" r="1.5" fill="#22c55e" /> {/* Time */}
                <circle cx="12" cy="10" r="1.5" fill="#f97316" /> {/* Soul */}
            </svg>
        ),

        // Doctor Strange (Eye of Agamotto)
        'doctor strange': (
            <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                <path d="M12 4C7 8 2 12 2 12C2 12 7 16 12 20C17 16 22 12 22 12C22 12 17 8 12 4Z" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
        ),

        // Spider-Man
        'spider-man': (
            <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <path d="M12 9V5" stroke="currentColor" strokeWidth="2" />
                <path d="M12 15V19" stroke="currentColor" strokeWidth="2" />
                <path d="M9 12H5" stroke="currentColor" strokeWidth="2" />
                <path d="M15 12H19" stroke="currentColor" strokeWidth="2" />
                <path d="M10 10L7 7" stroke="currentColor" strokeWidth="2" />
                <path d="M14 10L17 7" stroke="currentColor" strokeWidth="2" />
                <path d="M10 14L7 17" stroke="currentColor" strokeWidth="2" />
                <path d="M14 14L17 17" stroke="currentColor" strokeWidth="2" />
            </svg>
        ),
    };

    const icon = icons[normalizedName] || icons[normalizedName.split(' ')[0]];

    if (icon) {
        return <div className={`text-white/90 drop-shadow-lg ${className}`}>{icon}</div>;
    }

    // Default Fallback (Initials)
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <text
                x="12"
                y="16"
                textAnchor="middle"
                fill="currentColor"
                fontSize="12"
                fontWeight="bold"
                className="opacity-50"
            >
                {name.charAt(0).toUpperCase()}
            </text>
        </svg>
    );
}
