import JarvisVoiceTrainer from '../components/ai/JarvisVoiceTrainer';

export const metadata = {
    title: 'Voice Calibration | MCU Simulator',
    description: 'Calibrate J.A.R.V.I.S. voice recognition for hands-free control.',
};

export default function JarvisSetupPage() {
    return (
        <main className="min-h-screen pt-24 pb-12 px-4 bg-space-black relative overflow-hidden flex items-center justify-center">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-[radial-gradient(circle_at_70%_30%,rgba(6,182,212,0.1),transparent_70%)]" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-quantum-purple/5 blur-[100px]" />
            </div>

            <div className="relative z-10 w-full max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-white to-cyan-400 bg-clip-text text-transparent mb-4">
                        Voice Protocol Initialization
                    </h1>
                    <p className="text-text-secondary text-lg">
                        Train J.A.R.V.I.S. to recognize your voice. This data is processed securely on your device.
                    </p>
                </div>

                <JarvisVoiceTrainer />
            </div>
        </main>
    );
}
