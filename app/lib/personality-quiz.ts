export type Trait =
    | 'leadership'
    | 'intellect'
    | 'strength'
    | 'humor'
    | 'loyalty'
    | 'sacrifice'
    | 'rebellion'
    | 'tech'
    | 'magic'
    | 'stealth';

export interface QuizAnswer {
    text: string;
    traits: Trait[];
}

export interface QuizQuestion {
    id: number;
    question: string;
    scenario?: string;
    answers: QuizAnswer[];
}

export interface CharacterMatch {
    id: string;
    name: string;
    heroName: string;
    traits: Trait[];
    description: string;
    quote: string;
    imageId: number; // SuperHero API ID
}

// The personality questions - scenario-based
export const personalityQuestions: QuizQuestion[] = [
    {
        id: 1,
        question: "The city is under attack. What's your first instinct?",
        answers: [
            { text: "Take charge and rally everyone to fight back", traits: ['leadership', 'sacrifice'] },
            { text: "Analyze the threat and find its weakness", traits: ['intellect', 'tech'] },
            { text: "Jump in fists-first and smash the threat", traits: ['strength', 'rebellion'] },
            { text: "Crack a joke to lighten the mood, then save the day", traits: ['humor', 'loyalty'] },
        ],
    },
    {
        id: 2,
        question: "Your closest friend betrays your trust. How do you react?",
        answers: [
            { text: "Try to understand why and work to rebuild the relationship", traits: ['loyalty', 'leadership'] },
            { text: "Cut them off completely - trust is earned, not given twice", traits: ['rebellion', 'stealth'] },
            { text: "Confront them directly and demand answers", traits: ['strength', 'sacrifice'] },
            { text: "Make a sarcastic comment but secretly plot your revenge", traits: ['humor', 'intellect'] },
        ],
    },
    {
        id: 3,
        question: "You discover an ancient artifact with unknown power. What do you do?",
        answers: [
            { text: "Study it extensively before touching it", traits: ['intellect', 'magic'] },
            { text: "Use it immediately to help those in need", traits: ['sacrifice', 'leadership'] },
            { text: "Hide it where no one can find it", traits: ['stealth', 'loyalty'] },
            { text: "Test its limits to understand your new power", traits: ['rebellion', 'strength'] },
        ],
    },
    {
        id: 4,
        question: "A villain offers you a deal: join them and save millions, or refuse and watch them suffer.",
        answers: [
            { text: "Refuse and find another way - there's always another way", traits: ['leadership', 'sacrifice'] },
            { text: "Pretend to accept, then double-cross them", traits: ['stealth', 'intellect'] },
            { text: "Accept temporarily while planning their downfall", traits: ['rebellion', 'humor'] },
            { text: "Challenge them to single combat for the stakes", traits: ['strength', 'loyalty'] },
        ],
    },
    {
        id: 5,
        question: "How do you prefer to solve problems?",
        answers: [
            { text: "With cutting-edge technology and innovation", traits: ['tech', 'intellect'] },
            { text: "Through diplomacy, teamwork, and moral leadership", traits: ['leadership', 'loyalty'] },
            { text: "With overwhelming force and determination", traits: ['strength', 'sacrifice'] },
            { text: "Creatively, often with a bit of chaos", traits: ['magic', 'rebellion'] },
        ],
    },
    {
        id: 6,
        question: "Your team is losing the battle. What's your play?",
        answers: [
            { text: "Inspire them with a rallying speech and lead the charge", traits: ['leadership', 'sacrifice'] },
            { text: "Find the enemy's blind spot and exploit it", traits: ['intellect', 'stealth'] },
            { text: "Go berserk and turn the tide with raw power", traits: ['strength', 'rebellion'] },
            { text: "Distract the enemy with banter while your team regroups", traits: ['humor', 'loyalty'] },
        ],
    },
    {
        id: 7,
        question: "What motivates you most?",
        answers: [
            { text: "Protecting those who can't protect themselves", traits: ['sacrifice', 'leadership'] },
            { text: "Proving everyone wrong about you", traits: ['rebellion', 'strength'] },
            { text: "Curiosity and the pursuit of knowledge", traits: ['intellect', 'magic'] },
            { text: "Making my loved ones proud", traits: ['loyalty', 'humor'] },
        ],
    },
    {
        id: 8,
        question: "You're offered ultimate power, but it will change who you are. Do you take it?",
        answers: [
            { text: "No - power corrupts, and I know who I am", traits: ['leadership', 'loyalty'] },
            { text: "Yes - I can handle it and use it for good", traits: ['rebellion', 'strength'] },
            { text: "Only if I can understand and control it first", traits: ['intellect', 'tech'] },
            { text: "I'd rather find a workaround that doesn't require sacrifice", traits: ['humor', 'stealth'] },
        ],
    },
    {
        id: 9,
        question: "How do others typically describe you?",
        answers: [
            { text: "A natural-born leader with unshakeable morals", traits: ['leadership', 'sacrifice'] },
            { text: "The smartest person in the room", traits: ['intellect', 'tech'] },
            { text: "Unpredictable but incredibly resourceful", traits: ['rebellion', 'humor'] },
            { text: "Fiercely loyal and surprisingly deep", traits: ['loyalty', 'strength'] },
        ],
    },
    {
        id: 10,
        question: "The multiverse is collapsing. You have one chance to save it, but you won't survive. What do you do?",
        answers: [
            { text: "Make the sacrifice without hesitation", traits: ['sacrifice', 'leadership'] },
            { text: "Find a scientific solution that saves everyone, including myself", traits: ['intellect', 'tech'] },
            { text: "Go down fighting with everything I have", traits: ['strength', 'rebellion'] },
            { text: "Leave behind a joke for history to remember me by", traits: ['humor', 'loyalty'] },
        ],
    },
];

// Character trait profiles - matched to SuperHero API IDs
export const characterMatches: CharacterMatch[] = [
    {
        id: 'iron-man',
        name: 'Tony Stark',
        heroName: 'Iron Man',
        traits: ['intellect', 'tech', 'sacrifice', 'humor'],
        description: "You're a genius with a sharp wit and an even sharper mind. Behind the jokes and flashy tech, you have a heart willing to make the ultimate sacrifice for those you love.",
        quote: "I am Iron Man.",
        imageId: 346, // Iron Man
    },
    {
        id: 'captain-america',
        name: 'Steve Rogers',
        heroName: 'Captain America',
        traits: ['leadership', 'loyalty', 'sacrifice', 'strength'],
        description: "You're the moral compass everyone looks to. Your unwavering principles and ability to inspire others make you a natural leader who will never compromise on what's right.",
        quote: "I can do this all day.",
        imageId: 149, // Captain America
    },
    {
        id: 'thor',
        name: 'Thor Odinson',
        heroName: 'Thor',
        traits: ['strength', 'leadership', 'humor', 'sacrifice'],
        description: "You're a powerhouse with the heart of a king. Your journey from arrogance to wisdom has made you both stronger and more compassionate. Also, you're worthy.",
        quote: "Bring me Thanos!",
        imageId: 659, // Thor
    },
    {
        id: 'black-widow',
        name: 'Natasha Romanoff',
        heroName: 'Black Widow',
        traits: ['stealth', 'loyalty', 'sacrifice', 'intellect'],
        description: "You're a master of reinvention who has turned a dark past into a force for good. Your skills are unmatched, but it's your loyalty that truly defines you.",
        quote: "I've got red in my ledger. I'd like to wipe it out.",
        imageId: 107, // Black Widow
    },
    {
        id: 'spider-man',
        name: 'Peter Parker',
        heroName: 'Spider-Man',
        traits: ['humor', 'loyalty', 'intellect', 'sacrifice'],
        description: "You're the friendly neighborhood hero who never stops cracking jokes, even in the face of danger. Your heart is pure, and you understand that with great power comes great responsibility.",
        quote: "With great power comes great responsibility.",
        imageId: 620, // Spider-Man
    },
    {
        id: 'doctor-strange',
        name: 'Stephen Strange',
        heroName: 'Doctor Strange',
        traits: ['intellect', 'magic', 'sacrifice', 'leadership'],
        description: "You're a brilliant mind who discovered there's more to the universe than meets the eye. Your arrogance has been tempered by humility, becoming a protector of reality itself.",
        quote: "We're in the endgame now.",
        imageId: 226, // Doctor Strange
    },
    {
        id: 'black-panther',
        name: "T'Challa",
        heroName: 'Black Panther',
        traits: ['leadership', 'intellect', 'tech', 'loyalty'],
        description: "You're a king who balances tradition with innovation. Your wisdom, strength, and commitment to your people make you a leader worthy of Wakanda's legacy.",
        quote: "Wakanda Forever!",
        imageId: 106, // Black Panther
    },
    {
        id: 'loki',
        name: 'Loki Laufeyson',
        heroName: 'Loki',
        traits: ['rebellion', 'intellect', 'humor', 'magic'],
        description: "You're the God of Mischief - clever, chaotic, and full of surprises. Your path has been winding, but deep down, you're capable of true heroism when it matters most.",
        quote: "Your savior is here!",
        imageId: 414, // Loki
    },
    {
        id: 'scarlet-witch',
        name: 'Wanda Maximoff',
        heroName: 'Scarlet Witch',
        traits: ['magic', 'sacrifice', 'rebellion', 'loyalty'],
        description: "You've known loss and pain, but they've only made your power grow. Your love is fierce, your grief is profound, and your abilities can reshape reality itself.",
        quote: "I don't need you to tell me who I am.",
        imageId: 579, // Scarlet Witch
    },
    {
        id: 'hulk',
        name: 'Bruce Banner',
        heroName: 'Hulk',
        traits: ['strength', 'intellect', 'sacrifice', 'loyalty'],
        description: "You contain multitudes - the brilliant scientist and the incredible force of nature. Finding balance between the two has made you stronger than ever.",
        quote: "Hulk... SMASH!",
        imageId: 332, // Hulk
    },
];

// Calculate which character matches the user's traits
export function calculateCharacterMatch(traitScores: Record<Trait, number>): CharacterMatch {
    let bestMatch = characterMatches[0];
    let bestScore = -1;

    for (const character of characterMatches) {
        let score = 0;
        for (const trait of character.traits) {
            score += traitScores[trait] || 0;
        }
        // Primary trait gets bonus weight
        score += (traitScores[character.traits[0]] || 0) * 0.5;

        if (score > bestScore) {
            bestScore = score;
            bestMatch = character;
        }
    }

    return bestMatch;
}

// Initialize empty trait scores
export function initTraitScores(): Record<Trait, number> {
    return {
        leadership: 0,
        intellect: 0,
        strength: 0,
        humor: 0,
        loyalty: 0,
        sacrifice: 0,
        rebellion: 0,
        tech: 0,
        magic: 0,
        stealth: 0,
    };
}
