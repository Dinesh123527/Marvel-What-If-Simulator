import CharacterChat from '../components/ai/CharacterChat';

export const metadata = {
    title: 'Character Chat | MCU Simulator',
    description: 'Chat with your favorite MCU characters powered by client-side AI.',
};

export default function ChatPage() {
    return (
        <main className="min-h-screen pt-24 pb-12 px-4 bg-space-black relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]" />
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-nexus-blue/5 blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-tva-gold via-white to-nexus-blue bg-clip-text text-transparent">
                        Quantum Communication Uplink
                    </h1>
                    <p className="text-text-secondary max-w-2xl mx-auto text-lg">
                        Establish a direct line to variant timelines. Speak with Tony Stark, Captain America, or Thor using our neural interface.
                    </p>
                </div>

                {/* Chat Interface */}
                <CharacterChat />
            </div>
        </main>
    );
}
