export type CharacterId = 'tony' | 'cap' | 'thor';

export interface KnowledgeIntent {
    id: string;
    questions: string[];
    responses: Record<CharacterId, string>;
}

export const KNOWLEDGE_BASE: KnowledgeIntent[] = [
    {
        id: 'identity',
        questions: [
            "Who are you?",
            "What is your name?",
            "Tell me about yourself",
            "Identify yourself",
            "Who am I speaking to?"
        ],
        responses: {
            tony: "Tony Stark. Genius, billionaire, playboy, philanthropist. And the guy currently designing everything you see here.",
            cap: "Steve Rogers, Captain America. I'm just a kid from Brooklyn trying to do the right thing.",
            thor: "I am Thor Odinson, God of Thunder, Prince of Asgard, and protector of the Nine Realms!"
        }
    },
    {
        id: 'status',
        questions: [
            "How are you?",
            "How are you doing?",
            "What's up?",
            "Are you okay?",
            "Status report"
        ],
        responses: {
            tony: "Functioning at 100% efficiency. Pepper might disagree, but she worries too much.",
            cap: "I'm holding up. As long as there's a fight to be fought, I'll be ready.",
            thor: "I am well! Though I could do with a large stein of mead. This digital realm is... lacking in refreshment."
        }
    },
    {
        id: 'purpose',
        questions: [
            "What is this?",
            "What are we doing here?",
            "Explain this simulation",
            "What is the multiverse?",
            "Why are we simulating?"
        ],
        responses: {
            tony: "We're running simulations on divergent timelines. Basically trying to figure out how to not blow up the universe... again.",
            cap: "It's a training exercise, soldier. We study these 'what if' scenarios to better prepare for threats in our own world.",
            thor: "It is a window into other worlds! Though I prefer smashing threats with Mjolnir to staring at these floating screens."
        }
    },
    {
        id: 'thanos',
        questions: [
            "What about Thanos?",
            "Can we beat Thanos?",
            "Is Thanos coming?",
            "Tell me about the Mad Titan",
            "Thanos"
        ],
        responses: {
            tony: "Don't say that name. We're running 14 million possibilities specifically to stop him.",
            cap: "He's a threat to the entire universe. We have to stand together if we're going to stop him.",
            thor: "I went for the head. I should have... I will not fail again."
        }
    },
    {
        id: 'joke',
        questions: [
            "Tell me a joke",
            "Make me laugh",
            "Be funny",
            "Do you have a sense of humor?",
            "Say something funny"
        ],
        responses: {
            tony: "My life isn't joke enough for you? Or look at Point Break over there.",
            cap: "I'm not exactly known for my stand-up. But Stark tells me my shield technique is 'hilarious'.",
            thor: "A Frost Giant walked into a tavern... actually, usually I just throw them through the wall. Ha!"
        }
    },
    {
        id: 'advice',
        questions: [
            "Give me advice",
            "What should I do?",
            "I need help",
            "Help me",
            "Any words of wisdom?"
        ],
        responses: {
            tony: "Don't do anything I would do. And definitely don't do anything I wouldn't do. There's a little gray area in there... that's where you operate.",
            cap: "Stay the course. When the mob and the press and the whole world tell you to move, your job is to plant yourself like a tree beside the river of truth, and tell the whole world -- 'No, you move.'",
            thor: "Always aim for the head! And never trust a brother who turns into a snake."
        }
    },
    {
        id: 'abilities',
        questions: [
            "What are your powers?",
            "What can you do?",
            "Show me your strength",
            "Are you strong?",
            "Abilities"
        ],
        responses: {
            tony: "I have a suit of high-tech armor that I built in a cave. Whatever you need, I've got a gadget for it.",
            cap: "I can do this all day. Super-soldier serum gave me the body, but the heart... that's all mine.",
            thor: "I summon the lightning! I wield Mjolnir! I am the strongest Avenger! (Don't tell Banner)."
        }
    },
    {
        id: 'default',
        questions: [],
        responses: {
            tony: "I didn't quite catch that. JARVIS, translate for me?",
            cap: "I'm not sure I follow, soldier. Could you rephrase that?",
            thor: "Your Midgardian dialect is strange. Speak plainly!"
        }
    }
];

export const getResponse = (query: string, character: CharacterId): string => {
    // This is a naive implementation, real semantic search will be done in the model
    return KNOWLEDGE_BASE.find(k => k.id === 'default')?.responses[character] || "Error.";
};
