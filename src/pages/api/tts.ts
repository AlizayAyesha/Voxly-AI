import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Language to voice mapping for better TTS quality
const languageVoices: Record<string, string> = {
    Spanish: 'alloy',
    Urdu: 'alloy',
    Arabic: 'alloy',
    French: 'alloy',
    German: 'alloy',
    Chinese: 'alloy',
    English: 'alloy',
};

// Ensure audio directory exists
const audioDir = path.join(process.cwd(), 'public', 'audio');
if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

interface TTSRequest {
    text: string;
    language: string;
}

interface TTSResponse {
    audio_url?: string;
    error?: string;
}

// Map language to OpenAI TTS model
function getVoiceForLanguage(language: string): string {
    return languageVoices[language] || 'alloy';
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TTSResponse>
) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { text, language } = req.body as TTSRequest;

        // Validate required fields
        if (!text || typeof text !== 'string') {
            return res.status(400).json({ error: 'text is required and must be a string' });
        }

        if (!language || typeof language !== 'string') {
            return res.status(400).json({ error: 'language is required' });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(7);
        const filename = `tts-${timestamp}-${randomId}.mp3`;
        const filepath = path.join(audioDir, filename);

        // Generate speech using OpenAI TTS
        const mp3 = await openai.audio.speech.create({
            model: 'tts-1',
            voice: getVoiceForLanguage(language),
            input: text,
        });

        // Save audio file
        const arrayBuffer = await mp3.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        fs.writeFileSync(filepath, uint8Array);

        // Return the public URL
        const audioUrl = `/audio/${filename}`;

        res.status(200).json({
            audio_url: audioUrl
        });

    } catch (error: unknown) {
        console.error('OpenAI TTS Error:', error);
        
        res.status(500).json({
            error: 'Failed to generate audio',
            audio_url: ''
        });
    }
}

