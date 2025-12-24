'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useSoundEffect } from '../../contexts/AudioProvider';
import { CharacterId } from '../../lib/ai/knowledge-base';
import { findIntent, initModel } from '../../lib/ai/text-encoder';

interface Message {
    id: string;
    sender: 'user' | CharacterId;
    text: string;
    timestamp: number;
}

const CHARACTERS: { id: CharacterId, name: string, avatar: string, color: string }[] = [
    { id: 'tony', name: 'Tony Stark', avatar: '🦾', color: 'from-orange-500 to-red-600' },
    { id: 'cap', name: 'Steve Rogers', avatar: '🛡️', color: 'from-blue-600 to-red-500' },
    { id: 'thor', name: 'Thor Odinson', avatar: '⚡', color: 'from-yellow-500 to-yellow-600' },
];

export default function CharacterChat() {
    const { playClick, playHover } = useSoundEffect();
    const [selectedChar, setSelectedChar] = useState<CharacterId>('tony');
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isModelReady, setIsModelReady] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize AI Model
    useEffect(() => {
        initModel().then(() => setIsModelReady(true));
    }, []);

    // Initial greeting when character changes
    useEffect(() => {
        setMessages([{
            id: 'init',
            sender: selectedChar,
            text: getGreeting(selectedChar),
            timestamp: Date.now()
        }]);
    }, [selectedChar]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const getGreeting = (char: CharacterId) => {
        switch (char) {
            case 'tony': return "Stark here. Make it quick, I've got a universe to save.";
            case 'cap': return "Captain Rogers reporting. How can I help you, soldier?";
            case 'thor': return "Greetings, Midgardian! What tale shall we discuss?";
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || !isModelReady) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: inputValue,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);
        playClick();

        // AI Processing Delay (simulate thinking)
        setTimeout(async () => {
            try {
                // Find best matching intent using TF.js
                const { intent } = await findIntent(userMsg.text);
                const responseText = intent.responses[selectedChar];

                const aiMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    sender: selectedChar,
                    text: responseText,
                    timestamp: Date.now()
                };

                setMessages(prev => [...prev, aiMsg]);
                setIsTyping(false);
                playClick(); // Sound for receiving message
            } catch (error) {
                console.error("AI Error:", error);
                setIsTyping(false);
            }
        }, 1000 + Math.random() * 1000); // 1-2s delay
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    const activeCharData = CHARACTERS.find(c => c.id === selectedChar)!;

    return (
        <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Header / Character Selector */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-4">
                    {CHARACTERS.map(char => (
                        <button
                            key={char.id}
                            onClick={() => setSelectedChar(char.id)}
                            className={`relative p-2 rounded-xl transition-all ${selectedChar === char.id ? 'bg-white/10 ring-2 ring-tva-gold' : 'opacity-50 hover:opacity-100'}`}
                        >
                            <span className="text-2xl">{char.avatar}</span>
                            {selectedChar === char.id && (
                                <motion.div
                                    layoutId="active-char"
                                    className="absolute inset-0 border-2 border-tva-gold rounded-xl"
                                />
                            )}
                        </button>
                    ))}
                </div>
                <div className="text-right">
                    <h3 className="font-bold text-lg text-white">{activeCharData.name}</h3>
                    <div className="flex items-center justify-end gap-2 text-xs text-tva-gold">
                        <span className={`w-2 h-2 rounded-full ${isModelReady ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                        {isModelReady ? 'AI Online' : 'Initializing Neural Net...'}
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <AnimatePresence mode="popLayout">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] p-4 rounded-2xl ${msg.sender === 'user'
                                    ? 'bg-nexus-blue/20 border border-nexus-blue/30 text-white rounded-tr-sm'
                                    : `bg-gradient-to-br ${activeCharData.color} bg-opacity-20 border border-white/10 text-white rounded-tl-sm`
                                }`}>
                                <p className="leading-relaxed">{msg.text}</p>
                            </div>
                        </motion.div>
                    ))}
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-start"
                        >
                            <div className="bg-white/5 p-4 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-0" />
                                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-100" />
                                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-200" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-white/5">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Ask ${activeCharData.name} something...`}
                        disabled={!isModelReady}
                        className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-tva-gold/50 transition-colors disabled:opacity-50"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || !isModelReady}
                        className="bg-tva-gold/20 hover:bg-tva-gold/30 text-tva-gold border border-tva-gold/50 rounded-xl px-6 py-3 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
