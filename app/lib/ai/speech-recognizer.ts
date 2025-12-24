import type * as speechCommands from '@tensorflow-models/speech-commands';

let transferRecognizer: speechCommands.TransferSpeechCommandRecognizer | null = null;
let baseRecognizer: speechCommands.SpeechCommandRecognizer | null = null;

let speechCommandsModule: typeof speechCommands | null = null;

export const WORDS = ['_background_noise_', 'jarvis'];

export const initSpeechModel = async () => {
    if (typeof window === 'undefined') return;

    if (baseRecognizer) return;

    try {
        await import('@tensorflow/tfjs');
        speechCommandsModule = await import('@tensorflow-models/speech-commands');

        // Load the base model (pre-trained on common words)
        baseRecognizer = speechCommandsModule.create('BROWSER_FFT');
        await baseRecognizer.ensureModelLoaded();
        console.log("Base speech model loaded.");

        // Create a transfer learning recognizer (frozen base, trainable head)
        transferRecognizer = baseRecognizer.createTransfer('jarvis-model');
    } catch (e) {
        console.error("Failed to load speech model:", e);
    }
};

// Collect an example for a specific label (class)
// label: '_background_noise_' or 'jarvis'
export const collectExample = async (label: string) => {
    if (typeof window === 'undefined') return 0;

    if (!transferRecognizer) await initSpeechModel();
    if (!transferRecognizer) throw new Error("Model failed to init");

    // Collect 1 example
    await transferRecognizer.collectExample(label);
    console.log(`Collected example for: ${label}`);

    // Return count of examples for this label
    return transferRecognizer.countExamples()[label] || 0;
};

// Train the transfer model
export const trainModel = async (onEpochEnd?: (epoch: number, logs: any) => void) => {
    if (!transferRecognizer) throw new Error("No model to train");

    console.log("Starting training...");
    await transferRecognizer.train({
        epochs: 25,
        callback: {
            onEpochEnd: (epoch, logs) => {
                if (onEpochEnd) onEpochEnd(epoch, logs);
            }
        }
    });
    console.log("Training complete.");
};

// Start listening for the wake word
export const startListening = async (onCommand: (label: string, probability: number) => void) => {
    if (typeof window === 'undefined') return;
    if (!transferRecognizer) return;

    await transferRecognizer.listen(async result => {
        const scores = result.scores as Float32Array;
        if (!speechCommandsModule) return;

        const labels = transferRecognizer!.wordLabels();

        const maxScore = Math.max(...Array.from(scores));
        const index = scores.indexOf(maxScore);
        const label = labels[index];

        if (maxScore > 0.85) {
            onCommand(label, maxScore);
        }
    }, {
        probabilityThreshold: 0.75,
        overlapFactor: 0.5 // Process overlapping audio windows for faster reaction
    });
};

export const stopListening = async () => {
    if (transferRecognizer && transferRecognizer.isListening()) {
        await transferRecognizer.stopListening();
    }
};

export const saveModel = async () => {
    if (transferRecognizer) {
        await transferRecognizer.save('indexeddb://jarvis-model');
        console.log("Model saved.");
    }
};

export const loadModel = async () => {
    if (typeof window === 'undefined') return false;

    try {
        await initSpeechModel();
        if (transferRecognizer) {
            await transferRecognizer.load('indexeddb://jarvis-model');
            console.log("Model loaded from storage.");
            return true;
        }
    } catch (e) {
        console.log("No saved model found.");
        return false;
    }
    return false;
};
