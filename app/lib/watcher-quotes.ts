export type QuoteCategory =
    | 'intro'
    | 'simulation_start'
    | 'hopeful'
    | 'dark'
    | 'chaotic'
    | 'stable'
    | 'collapsing';

export const WATCHER_QUOTES: Record<QuoteCategory, string[]> = {
    intro: [
        "I am the Watcher. I see all. I know all.",
        "Time. Space. Reality. It's more than a linear path.",
        "In this vast multiverse, infinite possibilities await.",
        "I observe all that transpires here. But I do not, cannot, will not interfere.",
        "The multiverse is a prism of endless possibility, where a single choice can branch out into infinite realities.",
    ],

    simulation_start: [
        "Let us observe what unfolds when destiny takes a different path...",
        "A nexus event ripples through the timeline. Watch closely.",
        "In this reality, a single choice changes everything...",
        "The Sacred Timeline fractures. A new universe is born.",
        "What if... the story unfolded differently?",
        "A divergence point. The moment where worlds are born and die.",
        "I have watched this moment countless times. But never quite like this.",
    ],

    hopeful: [
        "In this reality, hope prevails. Heroes rise to meet the challenge.",
        "Even in darkness, light finds a way. This timeline breathes with possibility.",
        "A universe where heroes triumph against impossible odds. Beautiful.",
        "Against all probability, this reality chose hope. Remarkable.",
        "The human spirit... always fascinating in its resilience.",
        "In this timeline, courage rewrites destiny itself.",
        "Here, the bonds of friendship prove stronger than fate.",
    ],

    dark: [
        "Not all stories have happy endings. This... is one of them.",
        "Darkness consumes this reality. The shadows grow ever longer.",
        "A grim fate awaits this universe. Such is the nature of infinite possibility.",
        "In this timeline, the light fades. Heroes fall.",
        "Some paths lead only to sorrow. This is such a path.",
        "The cost of this divergence... immeasurable.",
        "Even I find this reality... difficult to witness.",
    ],

    chaotic: [
        "Reality itself unravels. The fundamental laws break down.",
        "Chaos reigns supreme. No timeline should exist in such turbulence.",
        "The fabric of existence tears at the seams. Dangerous.",
        "Order gives way to entropy. This universe spirals into madness.",
        "Even the constants of physics become variables in this chaotic realm.",
        "A reality at war with itself. Fascinating... and terrifying.",
    ],

    stable: [
        "Balance is achieved. This timeline flows as it should.",
        "A reality in harmony. The universe finds its equilibrium.",
        "Stability returns to the timeline. All is as it should be.",
        "The cosmic scales balance. Neither chaos nor rigid order.",
        "This universe hums with quiet certainty. A peaceful existence.",
    ],

    collapsing: [
        "This timeline cannot hold. It tears itself apart.",
        "An incursion threatens. Two realities cannot occupy the same space.",
        "The end approaches for this universe. Time runs short.",
        "Reality fractures beyond repair. This world is dying.",
        "Even I cannot save this timeline. It fades into the void.",
        "The TVA designates this: a collapsing branch. Inevitable.",
    ],
};

// Get a random quote from a category
export function getRandomQuote(category: QuoteCategory): string {
    const quotes = WATCHER_QUOTES[category];
    return quotes[Math.floor(Math.random() * quotes.length)];
}

// Get quote based on timeline outcome status
export function getOutcomeQuote(outcomeStatus: 'hopeful' | 'dark' | 'collapsing' | 'stable' | string): string {
    const category = WATCHER_QUOTES[outcomeStatus as QuoteCategory]
        ? (outcomeStatus as QuoteCategory)
        : 'stable';
    return getRandomQuote(category);
}

// Generate a sequence of quotes for a full narration
export function generateNarrationSequence(outcomeStatus: string): string[] {
    return [
        getRandomQuote('simulation_start'),
        getOutcomeQuote(outcomeStatus),
    ];
}
