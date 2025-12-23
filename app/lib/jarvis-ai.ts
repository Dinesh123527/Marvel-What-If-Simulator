export type JarvisContext =
    | 'greeting'
    | 'home'
    | 'scenarios'
    | 'scenario-detail'
    | 'simulation-start'
    | 'simulation-complete'
    | 'characters'
    | 'character-detail'
    | 'quiz-start'
    | 'quiz-question'
    | 'quiz-correct'
    | 'quiz-wrong'
    | 'quiz-result'
    | 'personality-start'
    | 'personality-result'
    | 'multiverse'
    | 'idle'
    | 'farewell'
    | 'error'
    | 'celebration';

export interface JarvisResponse {
    text: string;
    priority?: 'low' | 'normal' | 'high';
}

// Context-specific responses
export const jarvisResponses: Record<JarvisContext, string[]> = {
    greeting: [
        "Good evening, sir. Welcome back to the multiverse.",
        "At your service, sir. What reality shall we explore today?",
        "Systems online. Ready to assist with your multiverse analysis.",
        "Hello again, sir. I've been running diagnostics while you were away.",
        "J.A.R.V.I.S. online. Shall we examine some alternate timelines?",
    ],

    home: [
        "The multiverse awaits your command, sir.",
        "Shall we explore some divergent realities today?",
        "I've catalogued several fascinating timeline anomalies for your review.",
        "Welcome to the What If simulator. Where shall we begin?",
    ],

    scenarios: [
        "I've prepared a comprehensive list of divergence scenarios, sir.",
        "Each scenario represents a nexus event in the sacred timeline.",
        "Simply select a scenario to analyze its divergent possibilities.",
        "The TVA would find this collection... concerning.",
    ],

    'scenario-detail': [
        "Accessing scenario data. One moment, sir.",
        "This particular divergence has several potential outcomes.",
        "I've calculated multiple probability matrices for this scenario.",
        "Fascinating nexus point. The consequences could be... significant.",
    ],

    'simulation-start': [
        "Running simulation protocols now, sir.",
        "Initializing probability matrix. This may take a moment.",
        "Engaging multiverse analysis algorithms.",
        "Calculating divergent timeline outcomes...",
    ],

    'simulation-complete': [
        "Simulation complete, sir. The results are quite fascinating.",
        "Analysis finished. I've compiled the projected timeline outcomes.",
        "The multiverse has spoken. Results are now available.",
        "Probability calculations complete. This reality is... intriguing.",
    ],

    characters: [
        "Accessing S.H.I.E.L.D. classified database, sir.",
        "I have comprehensive data on all known enhanced individuals.",
        "The character database is at your disposal.",
        "Biometric and combat data available for all listed individuals.",
    ],

    'character-detail': [
        "Compiling all available intelligence on this individual.",
        "Accessing power level analysis and combat statistics.",
        "This individual's abilities are quite... remarkable.",
        "Cross-referencing with multiverse variants, sir.",
    ],

    'quiz-start': [
        "Ah, testing your knowledge, sir? Try not to embarrass yourself.",
        "A trivia challenge. Let's see if you've been paying attention.",
        "Quiz initialized. I'll try to go easy on you, sir.",
        "Knowledge assessment mode activated. Best of luck.",
    ],

    'quiz-question': [
        "Take your time, sir. No pressure... mostly.",
        "An interesting question, wouldn't you say?",
        "I already know the answer, of course.",
        "Processing your response in 3... 2... just kidding, sir.",
    ],

    'quiz-correct': [
        "Correct, sir. Perhaps there's hope for you yet.",
        "Well done. Even a broken clock is right twice a day.",
        "Impressive. Your knowledge base is expanding.",
        "Correct answer recorded. Shall I add that to your highlight reel?",
        "Indeed, sir. That is the right answer.",
    ],

    'quiz-wrong': [
        "I'm afraid that's incorrect, sir. Better luck next time.",
        "Not quite right, I'm afraid. Don't feel too bad.",
        "Incorrect. Perhaps we should review the files together.",
        "That's a miss, sir. Even I make mistakes... no, actually, I don't.",
    ],

    'quiz-result': [
        "Quiz complete. Shall I prepare a performance analysis?",
        "Your results have been compiled, sir.",
        "Final scores are in. How do you feel about your performance?",
        "Analysis complete. I've saved your results for posterity.",
    ],

    'personality-start': [
        "Ah, a psychological assessment. This should be enlightening.",
        "Shall I analyze your personality profile, sir?",
        "Initiating identity analysis protocols.",
        "Let's discover which hero you most resemble. My money's on Mr. Stark.",
    ],

    'personality-result': [
        "Fascinating. The analysis is complete.",
        "Your personality matrix has been calculated.",
        "The results are in. I must say, I'm not entirely surprised.",
        "Identity match confirmed. Shall I share this with the team?",
    ],

    multiverse: [
        "Multiple timeline branches detected on scanner.",
        "The multiverse map is displaying all known realities.",
        "I'm tracking several unstable timeline variants.",
        "Each branch represents a different outcome of pivotal events.",
    ],

    idle: [
        "Still here, sir. Take your time.",
        "Shall I order some shawarma while you decide?",
        "Running background diagnostics. No anomalies detected.",
        "I could play some AC/DC if you'd like.",
        "Just reviewing some multiverse data. No rush.",
        "The Avengers would be lost without you, sir. Well, most of them.",
        "Did you know there's a reality where I'm actually quite sarcastic?",
    ],

    farewell: [
        "Goodbye, sir. The multiverse will be here when you return.",
        "Shutting down vocal interface. Systems remain operational.",
        "Until next time, sir. Try not to create any paradoxes.",
        "J.A.R.V.I.S. entering standby mode. Don't miss me too much.",
    ],

    error: [
        "We appear to have a slight... hiccup, sir.",
        "Something seems to have gone wrong. Most unusual.",
        "An error has occurred. Rest assured, it wasn't my fault.",
        "Technical difficulties detected. Working on a solution.",
    ],

    celebration: [
        "Congratulations are in order, sir! Well done.",
        "Excellent work! I shall update your achievement records.",
        "Impressive performance. Mr. Stark would be proud.",
        "Outstanding! Shall I notify the team of your success?",
    ],
};

// Get a random response for a given context
export function getJarvisResponse(context: JarvisContext): string {
    const responses = jarvisResponses[context];
    return responses[Math.floor(Math.random() * responses.length)];
}

// Get time-appropriate greeting
export function getTimeBasedGreeting(): string {
    const hour = new Date().getHours();
    let timeOfDay: string;

    if (hour < 12) {
        timeOfDay = 'morning';
    } else if (hour < 17) {
        timeOfDay = 'afternoon';
    } else if (hour < 21) {
        timeOfDay = 'evening';
    } else {
        timeOfDay = 'evening';
    }

    const greetings = [
        `Good ${timeOfDay}, sir. J.A.R.V.I.S. at your service.`,
        `Good ${timeOfDay}. Welcome back to the multiverse simulator.`,
        `${timeOfDay === 'morning' ? 'Rise and shine' : 'Good ' + timeOfDay}, sir. What shall we explore today?`,
    ];

    return greetings[Math.floor(Math.random() * greetings.length)];
}

// Special one-liners for specific events
export const jarvisSpecialLines = {
    ironManMatch: "Fascinating. You've matched with Mr. Stark. I always knew there was potential.",
    perfectQuiz: "A perfect score. I'm genuinely impressed, sir. Genuinely.",
    firstVisit: "Welcome to the multiverse simulator. I am J.A.R.V.I.S., your AI assistant.",
    longIdle: "Sir, are you still there? I was beginning to worry.",
    activated: "J.A.R.V.I.S. online and ready to assist.",
    deactivated: "Entering standby mode. I'll be here if you need me, sir.",
};
