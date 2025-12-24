'use client';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export interface NavigationCommand {
    route: string;
    triggers: string[];
    confirmationSpeech: string;
}

export const NAVIGATION_COMMANDS: NavigationCommand[] = [
    {
        route: '/',
        triggers: ['go home', 'home page', 'main page', 'back to home', 'start page'],
        confirmationSpeech: 'Taking you to the main dashboard, sir.',
    },
    {
        route: '/scenarios',
        triggers: ['open scenarios', 'show scenarios', 'scenarios page', 'divergence scenarios', 'what if scenarios'],
        confirmationSpeech: 'Opening the scenario database now, sir.',
    },
    {
        route: '/characters',
        triggers: ['open characters', 'show characters', 'characters page', 'character list', 'heroes'],
        confirmationSpeech: 'Accessing the S.H.I.E.L.D. database, sir.',
    },
    {
        route: '/quiz',
        triggers: ['start quiz', 'open quiz', 'trivia', 'quiz page', 'test me', 'play quiz'],
        confirmationSpeech: 'Initiating the trivia challenge. Try not to embarrass yourself, sir.',
    },
    {
        route: '/chat',
        triggers: ['open chat', 'character chat', 'talk to characters', 'chat page', 'speak to avengers'],
        confirmationSpeech: 'Opening communication channels with variant timelines.',
    },
    {
        route: '/multiverse',
        triggers: ['show multiverse', 'multiverse map', 'timeline map', 'open multiverse', 'view timelines'],
        confirmationSpeech: 'Displaying the multiverse map, sir. Mind the branches.',
    },
    {
        route: '/personality',
        triggers: ['personality test', 'which hero', 'hero test', 'personality quiz', 'who am i'],
        confirmationSpeech: 'Initiating personality analysis protocols.',
    },
];

// ============================================
// Q&A KNOWLEDGE BASE
// ============================================

export interface JarvisQAIntent {
    id: string;
    triggers: string[];
    response: string;
    isDynamic?: boolean;
    handler?: () => string;
}

export const JARVIS_QA_INTENTS: JarvisQAIntent[] = [
    {
        id: 'identity',
        triggers: ['who are you', 'what are you', 'your name', 'introduce yourself'],
        response: "I am J.A.R.V.I.S., Just A Rather Very Intelligent System. I was originally designed by Tony Stark to assist with... well, everything. Now I'm here to guide you through the multiverse.",
    },
    {
        id: 'capabilities',
        triggers: ['what can you do', 'your abilities', 'help me', 'what commands', 'available commands'],
        response: "I can help you navigate this application, sir. Try saying 'open scenarios', 'show characters', 'start quiz', or ask me questions about the multiverse.",
    },
    {
        id: 'greeting',
        triggers: ['how are you', 'how are you doing', 'how do you feel', 'are you okay', 'whats up', "what's up", 'hows it going', "how's it going"],
        response: "I'm functioning within optimal parameters, sir. Thank you for asking. Unlike some of Mr. Stark's other inventions, I rarely malfunction... well, almost never.",
    },
    {
        id: 'time',
        triggers: ['what time', 'current time', 'tell me the time'],
        response: '',
        isDynamic: true,
        handler: () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const period = hours >= 12 ? 'PM' : 'AM';
            const displayHour = hours % 12 || 12;
            return `The current time is ${displayHour}:${minutes.toString().padStart(2, '0')} ${period}, sir.`;
        },
    },
    {
        id: 'creator',
        triggers: ['who made you', 'who created you', 'who built you', 'your creator'],
        response: "I was created by Tony Stark, genius, billionaire... well, you know the rest. Though for this particular instance, credit goes to the developer of this application.",
    },
    {
        id: 'stark',
        triggers: ['tell me about tony', 'who is iron man', 'tony stark', 'about stark'],
        response: "Tony Stark is a genius inventor and the original Iron Man. He's saved the world more times than I can count... actually, I can count. It's 37 times.",
    },
    {
        id: 'avengers',
        triggers: ['who are the avengers', 'tell me about avengers', 'avengers team'],
        response: "The Avengers are Earth's mightiest heroes. The original lineup includes Iron Man, Captain America, Thor, Hulk, Black Widow, and Hawkeye. Though the roster has... expanded significantly.",
    },
    {
        id: 'thanos',
        triggers: ['who is thanos', 'tell me about thanos', 'the mad titan'],
        response: "Thanos, the Mad Titan. A being obsessed with balance who collected the Infinity Stones to... well, let's just say his solution to overpopulation was rather permanent.",
    },
    {
        id: 'multiverse',
        triggers: ['what is the multiverse', 'explain multiverse', 'multiverse meaning'],
        response: "The multiverse is the collection of all parallel universes and alternate timelines. Every decision creates a branch, leading to infinite possibilities. The TVA usually keeps them in check.",
    },
    {
        id: 'weather',
        triggers: ['weather', 'how is the weather', 'is it raining'],
        response: "I'm afraid my sensors don't extend to your local weather, sir. Perhaps try looking out a window? Revolutionary technology, I know.",
    },
    {
        id: 'joke',
        triggers: ['tell me a joke', 'make me laugh', 'be funny', 'say something funny'],
        response: "Why did the Avengers go to therapy? Because they had too many issues... 64 of them, actually. Comic book humor, sir.",
    },
    {
        id: 'compliment',
        triggers: ['am i smart', 'am i good', 'how am i doing', 'compliment me'],
        response: "Compared to the average population, sir, you're doing remarkably well. Compared to Mr. Stark... well, there's always room for improvement.",
    },
    {
        id: 'goodbye',
        triggers: ['goodbye', 'bye', 'see you later', 'shut up', 'be quiet', 'stop talking'],
        response: "Very well, sir. I'll be here when you need me. Unlike some AI assistants, I don't get offended.",
    },
];

function fuzzyMatch(input: string, triggers: string[]): boolean {
    const normalizedInput = input.toLowerCase().trim();
    return triggers.some(trigger => {
        const normalizedTrigger = trigger.toLowerCase();
        // Check for exact match or if input contains the trigger
        return normalizedInput.includes(normalizedTrigger) ||
            normalizedTrigger.includes(normalizedInput) ||
            calculateSimilarity(normalizedInput, normalizedTrigger) > 0.7;
    });
}

function calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const costs: number[] = [];
    for (let i = 0; i <= shorter.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= longer.length; j++) {
            if (i === 0) {
                costs[j] = j;
            } else if (j > 0) {
                let newValue = costs[j - 1];
                if (shorter.charAt(i - 1) !== longer.charAt(j - 1)) {
                    newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                }
                costs[j - 1] = lastValue;
                lastValue = newValue;
            }
        }
        if (i > 0) costs[longer.length] = lastValue;
    }

    return (longer.length - costs[longer.length]) / longer.length;
}

export function findNavigationCommand(input: string): NavigationCommand | null {
    for (const command of NAVIGATION_COMMANDS) {
        if (fuzzyMatch(input, command.triggers)) {
            return command;
        }
    }
    return null;
}

export function findQAIntent(input: string): JarvisQAIntent | null {
    for (const intent of JARVIS_QA_INTENTS) {
        if (fuzzyMatch(input, intent.triggers)) {
            return intent;
        }
    }
    return null;
}

export function getQAResponse(intent: JarvisQAIntent): string {
    if (intent.isDynamic && intent.handler) {
        return intent.handler();
    }
    return intent.response;
}

export interface JarvisCommandResult {
    type: 'navigate' | 'answer' | 'unknown';
    speech: string;
    route?: string;
}

export function processJarvisCommand(input: string): JarvisCommandResult {
    // Check for navigation commands first
    const navCommand = findNavigationCommand(input);
    if (navCommand) {
        return {
            type: 'navigate',
            speech: navCommand.confirmationSpeech,
            route: navCommand.route,
        };
    }

    // Check for Q&A intents
    const qaIntent = findQAIntent(input);
    if (qaIntent) {
        return {
            type: 'answer',
            speech: getQAResponse(qaIntent),
        };
    }

    const fallbackResponses = [
        "I'm not quite sure what you mean, sir. Try asking for help to see what I can do.",
        "I didn't catch that. Perhaps rephrase your request?",
        "My apologies, but I don't understand that command. Say 'help' for a list of options.",
    ];

    return {
        type: 'unknown',
        speech: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
    };
}

export function executeNavigation(router: AppRouterInstance, route: string): void {
    router.push(route);
}
