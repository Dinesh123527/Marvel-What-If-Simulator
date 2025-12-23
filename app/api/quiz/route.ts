import { NextRequest, NextResponse } from 'next/server';
import { getCharacterDescription } from '../../lib/character-descriptions';
import { getFilteredCharacters } from '../../lib/data';

interface QuizQuestion {
    id: number;
    mode: 'stats' | 'hints' | 'silhouette';
    data: {
        stats?: {
            intelligence: number;
            strength: number;
            speed: number;
            durability: number;
            power: number;
            combat: number;
        };
        hints?: string[];
        iconName?: string;
        alignment?: string;
    };
    options: string[];
    correctAnswer: string;
}

// Generate progressive hints for a character
function generateHints(name: string, fullDescription: string, alignment: string): string[] {
    const hints: string[] = [];

    // Hint 1: Very vague (alignment based)
    if (alignment === 'hero') {
        hints.push('This character fights for justice and protects the innocent.');
    } else if (alignment === 'villain') {
        hints.push('This character has opposed the heroes of the Marvel Universe.');
    } else {
        hints.push('This character walks the line between hero and villain.');
    }

    // Hint 2: Extract a medium hint from description
    const sentences = fullDescription.split(/[.!?]+/).filter(s => s.trim().length > 10);
    if (sentences.length > 0) {
        // Pick a sentence that doesn't contain the character name
        const safeSentence = sentences.find(s => !s.toLowerCase().includes(name.toLowerCase().split(' ')[0]));
        hints.push(safeSentence?.trim() || 'A legendary figure in the Marvel Cinematic Universe.');
    } else {
        hints.push('A legendary figure in the Marvel Cinematic Universe.');
    }

    // Hint 3: More specific hint
    if (sentences.length > 1) {
        const secondSentence = sentences.find((s, i) => i > 0 && !s.toLowerCase().includes(name.toLowerCase().split(' ')[0]));
        hints.push(secondSentence?.trim() || `Known as a powerful ${alignment} in the MCU.`);
    } else {
        hints.push(`Known as a powerful ${alignment} in the MCU.`);
    }

    return hints;
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const mode = (searchParams.get('mode') || 'stats') as 'stats' | 'hints' | 'silhouette';
        const count = Math.min(parseInt(searchParams.get('count') || '10'), 20);
        const exclude = searchParams.get('exclude')?.split(',').filter(Boolean) || [];

        // Fetch a larger pool of characters to choose from
        const result = await getFilteredCharacters('all', '', 100, 0);
        let pool = result.characters.filter(c => !exclude.includes(c.name));

        // Ensure we have enough characters
        if (pool.length < 4) {
            return NextResponse.json({
                success: false,
                error: 'Not enough characters available for quiz'
            }, { status: 400 });
        }

        // Shuffle the pool
        pool = shuffleArray(pool);

        // Generate questions
        const questions: QuizQuestion[] = [];
        const usedCharacters = new Set<string>();

        for (let i = 0; i < count && pool.length > 0; i++) {
            // Pick a random character as the correct answer
            const correctCharIndex = Math.floor(Math.random() * pool.length);
            const correctChar = pool[correctCharIndex];

            // Skip if already used
            if (usedCharacters.has(correctChar.name)) {
                pool.splice(correctCharIndex, 1);
                i--;
                continue;
            }

            usedCharacters.add(correctChar.name);

            // Get 3 wrong options (different from correct answer)
            const wrongOptions = shuffleArray(
                pool.filter(c => c.name !== correctChar.name && !usedCharacters.has(c.name))
            ).slice(0, 3);

            if (wrongOptions.length < 3) {
                // Not enough unique options, skip
                pool.splice(correctCharIndex, 1);
                i--;
                continue;
            }

            // Create options array and shuffle
            const options = shuffleArray([correctChar.name, ...wrongOptions.map(c => c.name)]);

            // Build question data based on mode
            let questionData: QuizQuestion['data'] = {};

            if (mode === 'stats') {
                questionData = {
                    stats: {
                        intelligence: correctChar.intelligence,
                        strength: correctChar.strength,
                        speed: correctChar.speed,
                        durability: correctChar.durability,
                        power: correctChar.power,
                        combat: correctChar.combat,
                    },
                    alignment: correctChar.alignment,
                };
            } else if (mode === 'hints') {
                const description = getCharacterDescription(correctChar.name);
                questionData = {
                    hints: generateHints(correctChar.name, description, correctChar.alignment),
                    alignment: correctChar.alignment,
                };
            } else if (mode === 'silhouette') {
                questionData = {
                    iconName: correctChar.name,
                    alignment: correctChar.alignment,
                };
            }

            questions.push({
                id: correctChar.superhero_api_id,
                mode,
                data: questionData,
                options,
                correctAnswer: correctChar.name,
            });

            // Remove used character from pool
            pool.splice(correctCharIndex, 1);
        }

        return NextResponse.json({
            success: true,
            questions,
            mode,
            totalQuestions: questions.length,
        });

    } catch (error) {
        console.error('Error generating quiz:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to generate quiz questions'
        }, { status: 500 });
    }
}
