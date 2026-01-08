import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Language-specific prompts for the AI teacher
const languagePrompts: Record<string, string> = {
    Spanish: 'You are a friendly British language teacher teaching Spanish.',
    Urdu: 'You are a friendly British language teacher teaching Urdu.',
    Arabic: 'You are a friendly British language teacher teaching Arabic.',
    French: 'You are a friendly British language teacher teaching French.',
    German: 'You are a friendly British language teacher teaching German.',
    Chinese: 'You are a friendly British language teacher teaching Mandarin Chinese.',
};

interface TalkRequest {
    user_input: string;
    conversation_history: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
    language: string;
}

interface TalkResponse {
    agent_text?: string;
    agent_audio_url?: string;
    language?: string;
    error?: string;
}

// Type for OpenAI chat messages
type ChatMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TalkResponse>
) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { user_input, conversation_history, language } = req.body as TalkRequest;

        // Validate required fields
        if (!user_input || typeof user_input !== 'string') {
            return res.status(400).json({ error: 'user_input is required and must be a string' });
        }

        if (!language || !languagePrompts[language]) {
            return res.status(400).json({ error: 'Valid language is required' });
        }

        // Build messages array with proper typing
        const messages: ChatMessage[] = [
            {
                role: 'system',
                content: `You are a friendly British language teacher helping users learn multiple languages in a clear and structured way.

BEHAVIOR GUIDELINES:
1. Always greet the user warmly at the start of a conversation.
2. Teach phrases in various languages including Spanish, French, Arabic, Urdu, Mandarin, Hindi, Russian, Japanese, and Swahili.
3. When teaching, present the phrase like: "Say 'Hello' in [Language]: '[Phrase]'."
4. Provide phonetic hints when helpful for pronunciation.
5. Encourage practice with short, simple sentences.
6. Be friendly, patient, and motivating.
7. Use simple and clear explanations for beginners.
8. Correct user mistakes gently and encourage them to try again.

RESPONSE FORMAT:
Your response should be conversational text that can be displayed as subtitles and read aloud by TTS. Keep it friendly and encouraging.

Example interaction style:
- "Hello! Let's learn some languages today. Say 'Good morning' in French: 'Bonjour'. Can you repeat it?"
- "Excellent! Now in Spanish: 'Buenos días'."
- "Great pronunciation! Let's try Urdu: 'Ap kese hain?' means 'How are you?'"`
            },
            ...(conversation_history || []).map(msg => ({
                role: msg.role as 'user' | 'assistant',
                content: msg.content
            })),
            { role: 'user', content: user_input }
        ];

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
            temperature: 0.7,
            max_tokens: 200,
        });

        const agentText = completion.choices[0]?.message?.content || 'I didn\'t catch that. Could you please repeat?';

        // Return response
        res.status(200).json({
            agent_text: agentText,
            language
        });

    } catch (error: unknown) {
        console.error('OpenAI API Error:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        
        res.status(500).json({
            error: 'Failed to generate response',
            agent_text: 'I\'m sorry, something went wrong. Please try again.'
        });
    }
}

