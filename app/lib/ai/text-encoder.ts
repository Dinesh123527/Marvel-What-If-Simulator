import type * as use from '@tensorflow-models/universal-sentence-encoder';
import type * as tf from '@tensorflow/tfjs';
import { KNOWLEDGE_BASE, KnowledgeIntent } from './knowledge-base';

interface IntentEmbedding {
    intentId: string;
    embeddings: tf.Tensor2D;
}

let model: use.UniversalSentenceEncoder | null = null;
let intentEmbeddings: IntentEmbedding[] = [];
let isModelLoading = false;
let tfModule: typeof tf | null = null;
let useModule: typeof use | null = null;

export const initModel = async () => {
    if (typeof window === 'undefined') return;

    if (model || isModelLoading) return;

    try {
        isModelLoading = true;
        console.log("Loading Universal Sentence Encoder...");

        tfModule = await import('@tensorflow/tfjs');
        useModule = await import('@tensorflow-models/universal-sentence-encoder');

        model = await useModule!.load();
        console.log("Model loaded.");

        const allIntents: IntentEmbedding[] = [];

        for (const intent of KNOWLEDGE_BASE) {
            if (intent.questions.length > 0) {
                const embedding = await model.embed(intent.questions);
                // Cast to any to bypass strict type check for now
                allIntents.push({
                    intentId: intent.id,
                    embeddings: embedding as any
                });
            }
        }

        intentEmbeddings = allIntents;
        console.log("Embeddings computed.");
        isModelLoading = false;
    } catch (error) {
        console.error("Failed to load AI model:", error);
        isModelLoading = false;
    }
};

const cosineSimilarity = (a: tf.Tensor2D, b: tf.Tensor2D): tf.Tensor1D => {
    if (!tfModule) throw new Error("TF module not loaded");

    return tfModule.tidy(() => {
        const aNorm = tfModule!.norm(a, 2, 1).expandDims(1);
        const bNorm = tfModule!.norm(b, 2, 1).expandDims(1);
        const aNormalized = a.div(aNorm);
        const bNormalized = b.div(bNorm);
        return tfModule!.matMul(aNormalized, bNormalized, false, true).squeeze([0]);
    });
};

// Find Best Matching Intent
export const findIntent = async (query: string): Promise<{ intent: KnowledgeIntent, score: number }> => {
    if (!model || intentEmbeddings.length === 0) {
        await initModel(); // Try to init if not ready
        if (!model) return { intent: KNOWLEDGE_BASE.find(k => k.id === 'default')!, score: 0 };
    }

    // Embed the user query
    const queryEmbedding = await model!.embed([query]);

    let bestScore = -1;
    let bestIntentId = 'default';

    for (const item of intentEmbeddings) {
        const similarity = cosineSimilarity(queryEmbedding as any, item.embeddings);
        const maxScoreTensor = similarity.max();
        const maxScore = maxScoreTensor.dataSync()[0];

        similarity.dispose();
        maxScoreTensor.dispose();

        if (maxScore > bestScore) {
            bestScore = maxScore;
            bestIntentId = item.intentId;
        }
    }
    queryEmbedding.dispose();

    if (bestScore < 0.3) {
        return {
            intent: KNOWLEDGE_BASE.find(k => k.id === 'default')!,
            score: bestScore
        };
    }

    return {
        intent: KNOWLEDGE_BASE.find(k => k.id === bestIntentId)!,
        score: bestScore
    };
};
