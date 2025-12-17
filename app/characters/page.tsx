'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import CharacterCard from '../components/CharacterCard';
import CharacterModal from '../components/CharacterModal';

interface Character {
    superheroApiId: number;
    name: string;
    alignment: 'hero' | 'villain' | 'anti-hero';
    intelligence: number;
    strength: number;
    speed: number;
    durability: number;
    power: number;
    combat: number;
    imageUrl: string;
    fullName?: string;
    alterEgos?: string;
    aliases?: string[];
    placeOfBirth?: string;
    firstAppearance?: string;
    publisher?: string;
    gender?: string;
    race?: string;
    height?: string;
    weight?: string;
    eyeColor?: string;
    hairColor?: string;
    occupation?: string;
    base?: string;
    groupAffiliation?: string;
    relatives?: string;
}

export default function CharactersPage() {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [alignmentFilter, setAlignmentFilter] = useState<string>('all');
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [totalCharacters, setTotalCharacters] = useState(0);

    const [selectedLetter, setSelectedLetter] = useState<string>('');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCharacters(1, searchQuery, alignmentFilter, selectedLetter);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchCharacters = async (pageNum: number, query: string, alignment: string, letter: string) => {
        setIsLoading(true);
        // Scroll to top of grid
        if (pageNum > 1) {
            const gridElement = document.getElementById('characters-grid');
            if (gridElement) {
                gridElement.scrollIntoView({ behavior: 'smooth' });
            }
        }

        try {
            const res = await fetch(`/api/characters/all?page=${pageNum}&limit=12&query=${encodeURIComponent(query)}&alignment=${alignment}&letter=${letter}`);
            const data = await res.json();

            if (data.success) {
                setCharacters(data.data);
                setTotalCharacters(data.total);
                setPage(pageNum);
            }
        } catch (err) {
            console.error('Error loading characters:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchCharacters(1, searchQuery, alignmentFilter, selectedLetter);
    }, []);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= Math.ceil(totalCharacters / 12)) {
            fetchCharacters(newPage, searchQuery, alignmentFilter, selectedLetter);
        }
    };

    const handleAlignmentChange = (newAlignment: string) => {
        setAlignmentFilter(newAlignment);
        // Reset letter when changing alignment to avoid confusion, or keep it? User didn't specify.
        // Keeping it allows "Heroes starting with A".
        fetchCharacters(1, searchQuery, newAlignment, selectedLetter);
    };

    const handleLetterChange = (letter: string) => {
        if (selectedLetter === letter) {
            // Toggle off
            setSelectedLetter('');
            fetchCharacters(1, searchQuery, alignmentFilter, '');
        } else {
            setSelectedLetter(letter);
            fetchCharacters(1, searchQuery, alignmentFilter, letter);
        }
    };

    const handleCharacterClick = (character: Character) => {
        setSelectedCharacter(character);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedCharacter(null), 300);
    };

    const totalPages = Math.ceil(totalCharacters / 12);
    const alignmentTabs = [
        { id: 'all', label: 'All', icon: '🌟' },
        { id: 'hero', label: 'Heroes', icon: '🦸' },
        { id: 'villain', label: 'Villains', icon: '🦹' },
        { id: 'anti-hero', label: 'Anti-Heroes', icon: '⚔️' },
    ];

    return (
        <main className="min-h-screen pt-[var(--nav-height)]">
            {/* Header */}
            <section className="py-12 border-b border-white/5">
                <div className="container-cosmic text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Marvel <span className="text-gradient">Characters</span>
                        </h1>
                        <p className="text-text-secondary max-w-2xl mx-auto">
                            Explore the heroes and villains of the Marvel Cinematic Universe.
                            Click any character to view their full biography and stats.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filters */}
            <section className="py-6 border-b border-white/5 sticky top-[var(--nav-height)] bg-bg-primary/80 backdrop-blur-lg z-10">
                <div className="container-cosmic">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                placeholder="Search characters..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-text-muted focus:outline-none focus:border-quantum-purple transition-all"
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Alignment Tabs */}
                        <div className="flex gap-2 flex-wrap justify-center">
                            {alignmentTabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleAlignmentChange(tab.id)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${alignmentFilter === tab.id
                                        ? 'bg-quantum-purple text-white shadow-lg shadow-purple-500/20'
                                        : 'bg-cosmic-elevated text-text-secondary hover:text-white border border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    <span className="mr-1.5">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* A-Z Filter Bar */}
                    <div className="flex flex-wrap justify-center gap-1 mt-6">
                        {alphabet.map((letter) => (
                            <button
                                key={letter}
                                onClick={() => handleLetterChange(letter)}
                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${selectedLetter === letter
                                        ? 'bg-tva-gold text-cosmic-void shadow-lg shadow-yellow-500/20 scale-110'
                                        : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white hover:scale-105'
                                    }`}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Characters Grid */}
            <section id="characters-grid" className="py-8">
                <div className="container-cosmic">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            {/* Animated Loader */}
                            <div className="relative">
                                {/* Outer Ring */}
                                <motion.div
                                    className="w-24 h-24 rounded-full border-4 border-transparent"
                                    style={{
                                        borderTopColor: 'rgba(139, 92, 246, 0.8)',
                                        borderRightColor: 'rgba(59, 130, 246, 0.4)',
                                    }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                />

                                {/* Middle Ring */}
                                <motion.div
                                    className="absolute inset-2 rounded-full border-4 border-transparent"
                                    style={{
                                        borderTopColor: 'rgba(59, 130, 246, 0.8)',
                                        borderLeftColor: 'rgba(139, 92, 246, 0.4)',
                                    }}
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                />

                                {/* Inner Ring */}
                                <motion.div
                                    className="absolute inset-4 rounded-full border-4 border-transparent"
                                    style={{
                                        borderBottomColor: 'rgba(234, 179, 8, 0.8)',
                                        borderRightColor: 'rgba(234, 179, 8, 0.3)',
                                    }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                />

                                {/* Center Pulse */}
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-quantum-purple to-quantum-blue" />
                                </motion.div>
                            </div>

                            {/* Loading Text */}
                            <motion.div
                                className="mt-8 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <motion.p
                                    className="text-lg text-white font-medium"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    Loading Characters
                                </motion.p>
                                <motion.div className="flex items-center justify-center gap-1 mt-2">
                                    {[0, 1, 2].map((i) => (
                                        <motion.div
                                            key={i}
                                            className="w-2 h-2 rounded-full bg-quantum-purple"
                                            animate={{ y: [-2, 2, -2] }}
                                            transition={{
                                                duration: 0.6,
                                                repeat: Infinity,
                                                delay: i * 0.15,
                                                ease: 'easeInOut',
                                            }}
                                        />
                                    ))}
                                </motion.div>
                                <p className="text-sm text-text-muted mt-3">
                                    Accessing the Multiverse Database...
                                </p>
                            </motion.div>
                        </div>
                    ) : characters.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold text-white mb-2">No Characters Found</h3>
                            <p className="text-text-secondary">
                                Try adjusting your search or filter criteria.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white/5 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
                                <span className="text-sm text-text-secondary font-medium">
                                    Displaying <span className="text-white font-bold">{(page - 1) * 12 + 1}</span> - <span className="text-white font-bold">{Math.min(page * 12, totalCharacters)}</span> of <span className="text-tva-gold font-bold">{totalCharacters}</span> Characters
                                </span>
                                <span className="text-xs uppercase tracking-wider text-white/40 font-semibold mt-1 sm:mt-0">
                                    Page {page} / {totalPages}
                                </span>
                            </div>
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    layout
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                >
                                    {characters.map((char, index) => (
                                        <motion.div
                                            key={`${char.superheroApiId}-${index}`} // Use index to avoid duplicate key issues with pagination potentially
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ delay: (index % 12) * 0.03 }}
                                            onClick={() => handleCharacterClick(char)}
                                            className="cursor-pointer"
                                        >
                                            <CharacterCard
                                                name={char.name}
                                                alignment={char.alignment}
                                                intelligence={char.intelligence}
                                                strength={char.strength}
                                                speed={char.speed}
                                                durability={char.durability}
                                                power={char.power}
                                                combat={char.combat}
                                                imageUrl={char.imageUrl}
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>

                            {/* Pagination Controls */}
                            {!searchQuery && totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1}
                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                                    >
                                        &larr; Prev
                                    </button>

                                    {/* Page Numbers - Windowed */}
                                    {(() => {
                                        const pages = [];
                                        const maxVisible = 5;
                                        let start = Math.max(1, page - Math.floor(maxVisible / 2));
                                        let end = Math.min(totalPages, start + maxVisible - 1);

                                        if (end - start + 1 < maxVisible) {
                                            start = Math.max(1, end - maxVisible + 1);
                                        }

                                        if (start > 1) {
                                            pages.push(
                                                <button key={1} onClick={() => handlePageChange(1)} className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-text-secondary hover:bg-white/10 cursor-pointer">1</button>
                                            );
                                            if (start > 2) pages.push(<span key="dots-start" className="text-white/50">...</span>);
                                        }

                                        for (let i = start; i <= end; i++) {
                                            pages.push(
                                                <button
                                                    key={i}
                                                    onClick={() => handlePageChange(i)}
                                                    className={`w-10 h-10 rounded-lg font-medium transition-all cursor-pointer ${page === i
                                                        ? 'bg-quantum-purple text-white shadow-lg shadow-purple-500/20'
                                                        : 'bg-white/5 border border-white/10 text-text-secondary hover:bg-white/10 hover:text-white'
                                                        }`}
                                                >
                                                    {i}
                                                </button>
                                            );
                                        }

                                        if (end < totalPages) {
                                            if (end < totalPages - 1) pages.push(<span key="dots-end" className="text-white/50">...</span>);
                                            pages.push(
                                                <button key={totalPages} onClick={() => handlePageChange(totalPages)} className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-text-secondary hover:bg-white/10">{totalPages}</button>
                                            );
                                        }

                                        return pages;
                                    })()}

                                    {/* Next Button */}
                                    <button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={page === totalPages}
                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        Next &rarr;
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Character Detail Modal */}
            <CharacterModal
                character={selectedCharacter}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </main >
    );
}
