import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { withTranslation } from 'app/providers/withTranslation';
import { Footer } from 'widgets/footer';
import { Header } from 'widgets/header';
import MainLayout from 'widgets/layouts/main-layout';
import { Menu } from 'widgets/menu';
import { useTranslation } from 'next-i18next';
import { VoxlyAvatar } from '../../shared/components/voxly/avatar';
import { ChatPanel, Subtitle } from '../../shared/components/voxly/chat-panel';
import { VoxlySidebar, TabType } from '../../shared/components/voxly/sidebar';
import { MicButton } from '../../shared/components/voxly/mic-button';
import { VoiceToggle } from '../../shared/components/voxly/voice-toggle';
import { QuizPopup, QuizQuestion } from '../../shared/components/voxly/quiz-popup';
import { LanguageSelectorVoxly } from '../../shared/components/voxly/language-selector-voxly';
import css from './start-talking.module.scss';

// Language data
const languageData: Record<string, { name: string; code: string; nativeName: string }> = {
    es: { name: 'Spanish', code: 'es', nativeName: 'Español' },
    fr: { name: 'French', code: 'fr', nativeName: 'Français' },
    de: { name: 'German', code: 'de', nativeName: 'Deutsch' },
    it: { name: 'Italian', code: 'it', nativeName: 'Italiano' },
    pt: { name: 'Portuguese', code: 'pt', nativeName: 'Português' },
    zh: { name: 'Chinese', code: 'zh', nativeName: '中文' },
    ja: { name: 'Japanese', code: 'ja', nativeName: '日本語' },
    ko: { name: 'Korean', code: 'ko', nativeName: '한국어' },
    ru: { name: 'Russian', code: 'ru', nativeName: 'Русский' },
    ar: { name: 'Arabic', code: 'ar', nativeName: 'العربية' },
    hi: { name: 'Hindi', code: 'hi', nativeName: 'हिन्दी' },
    en: { name: 'English', code: 'en', nativeName: 'English' },
};

interface ConversationMessage {
    role: 'user' | 'assistant';
    content: string;
}

const StartTalking: NextPage = () => {
    const { t } = useTranslation('start-talking');
    
    // State
    const [isConversationActive, setIsConversationActive] = useState(false);
    const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
    const [currentLanguage, setCurrentLanguage] = useState('es');
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
    const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
    const [vocabularyTips, setVocabularyTips] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<TabType>('history');
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
    const [currentSubtitle, setCurrentSubtitle] = useState('');
    
    // Stats
    const [stats, setStats] = useState({
        dailyStreak: 3,
        wordsLearned: 156,
        conversationsCompleted: 24,
        progress: 65
    });

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Greeting messages for different languages
    const getGreeting = useCallback((lang: string) => {
        const greetings: Record<string, string> = {
            es: "¡Hola! I'm your Voxly conversation partner. Let's practice Spanish together!",
            fr: "Bonjour! I'm your Voxly conversation partner. Let's practice French together!",
            de: "Guten Tag! I'm your Voxly conversation partner. Let's practice German together!",
            it: "Ciao! I'm your Voxly conversation partner. Let's practice Italian together!",
            pt: "Olá! I'm your Voxly conversation partner. Let's practice Portuguese together!",
            zh: "Nǐ hǎo! I'm your Voxly conversation partner. Let's practice Chinese together!",
            ja: "Konnichiwa! I'm your Voxly conversation partner. Let's practice Japanese together!",
            ko: "Annyeonghaseyo! I'm your Voxly conversation partner. Let's practice Korean together!",
            ru: "Privet! I'm your Voxly conversation partner. Let's practice Russian together!",
            ar: "Marhaba! I'm your Voxly conversation partner. Let's practice Arabic together!",
            hi: "Namaste! I'm your Voxly conversation partner. Let's practice Hindi together!",
            en: "Hello! I'm your Voxly conversation partner. Let's practice English together!",
        };
        return greetings[lang] || greetings['en'];
    }, []);

    // Auto-scroll to bottom when new subtitles added
    useEffect(() => {
        const container = document.querySelector(`.${css.chatContainer}`);
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [subtitles, currentSubtitle]);

    // Call the Talk API
    const callTalkAPI = async (userInput: string) => {
        try {
            const response = await fetch('/api/talk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_input: userInput,
                    conversation_history: conversationHistory,
                    language: languageData[currentLanguage]?.name || 'Spanish',
                }),
            });

            if (!response.ok) throw new Error('API request failed');
            return await response.json();
        } catch (error) {
            console.error('Error calling talk API:', error);
            throw error;
        }
    };

    // Call the TTS API
    const callTTSAPI = async (text: string) => {
        try {
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, language: currentLanguage }),
            });

            if (!response.ok) throw new Error('TTS API request failed');
            return await response.json();
        } catch (error) {
            console.error('Error calling TTS API:', error);
            throw error;
        }
    };

    // Play audio
    const playAudio = (url: string) => {
        if (audioRef.current) {
            audioRef.current.src = url;
            audioRef.current.play().catch(console.error);
        }
    };

    // Handle audio play/pause for avatar animation
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlay = () => setIsAgentSpeaking(true);
        const handlePause = () => setIsAgentSpeaking(false);
        const handleEnded = () => setIsAgentSpeaking(false);

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    // Add agent subtitle
    const addAgentSubtitle = (text: string) => {
        const newSubtitle: Subtitle = {
            id: Date.now(),
            text,
            speaker: 'agent',
            language: languageData[currentLanguage]?.nativeName,
            timestamp: new Date()
        };
        setSubtitles(prev => [...prev, newSubtitle]);
        setCurrentSubtitle(text);
    };

    // Add user subtitle
    const addUserSubtitle = (text: string) => {
        const newSubtitle: Subtitle = {
            id: Date.now(),
            text,
            speaker: 'user',
            language: languageData[currentLanguage]?.nativeName,
            timestamp: new Date()
        };
        setSubtitles(prev => [...prev, newSubtitle]);
    };

    // Start conversation
    const handleStartConversation = async () => {
        setIsConversationActive(true);
        setSubtitles([]);
        setConversationHistory([]);
        setVocabularyTips([]);
        
        const greeting = getGreeting(currentLanguage);
        addAgentSubtitle(greeting);
        
        setConversationHistory([{ role: 'assistant', content: greeting }]);
        setIsLoading(true);
        
        try {
            const ttsData = await callTTSAPI(greeting);
            if (ttsData.audio_url) {
                playAudio(ttsData.audio_url);
            }
        } catch (error) {
            console.error('Error playing greeting audio:', error);
        }
        
        setIsLoading(false);
    };

    // Stop conversation
    const handleStopConversation = () => {
        setIsConversationActive(false);
        setIsAgentSpeaking(false);
        setIsRecording(false);
        setConversationHistory([]);
        setSubtitles([]);
        setCurrentSubtitle('');
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    // Start recording
    const handleStartRecording = async () => {
        setIsRecording(true);
    };

    // Stop recording
    const handleStopRecording = () => {
        setIsRecording(false);
    };

    // Simulate user interaction (for demo)
    const simulateUserInteraction = async () => {
        if (!isConversationActive || isLoading) return;

        const practicePhrases: Record<string, string[]> = {
            es: ['Buenos días', 'Me gustaria aprender español', 'Dónde está la biblioteca', 'Necesito ayuda'],
            fr: ['Bonjour', 'Je voudrais apprendre le français', 'Où est la bibliothèque', "J'ai besoin d'aide"],
            de: ['Guten Tag', 'Ich möchte Deutsch lernen', 'Wo ist die Bibliothek', 'Ich brauche Hilfe'],
            it: ['Buongiorno', 'Vorrei imparare l\'italiano', 'Dov\'è la biblioteca', 'Ho bisogno di aiuto'],
            pt: ['Bom dia', 'Eu gostaria de aprender português', 'Onde está a biblioteca', 'Preciso de ajuda'],
            zh: ['你好', '我想学中文', '图书馆在哪里？', '我需要帮助'],
            ja: ['こんにちは', '日本語を習いたいです', '図書館はどこですか', '助けてください'],
            ko: ['안녕하세요', '한국어를 배우고 싶습니다', '도서관이 어디예요', '도움주세요'],
        };

        const phrases = practicePhrases[currentLanguage] || practicePhrases['es'];
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

        setIsLoading(true);
        addUserSubtitle(randomPhrase);
        
        const updatedHistory: ConversationMessage[] = [
            ...conversationHistory,
            { role: 'user', content: randomPhrase }
        ];
        setConversationHistory(updatedHistory);

        setTimeout(async () => {
            try {
                const talkData = await callTalkAPI(randomPhrase);
                
                if (talkData.agent_text) {
                    addAgentSubtitle(talkData.agent_text);
                    
                    const newHistory: ConversationMessage[] = [
                        ...updatedHistory,
                        { role: 'assistant', content: talkData.agent_text }
                    ];
                    setConversationHistory(newHistory);

                    const ttsData = await callTTSAPI(talkData.agent_text);
                    if (ttsData.audio_url) {
                        playAudio(ttsData.audio_url);
                    }
                    
                    generateQuizQuestions(talkData.agent_text);
                }
            } catch (error) {
                console.error('Error in conversation:', error);
                addAgentSubtitle("I'm sorry, something went wrong. Please try again.");
            }
            setIsLoading(false);
        }, 1500);
    };

    // Generate quiz questions
    const generateQuizQuestions = (agentText: string) => {
        const sampleQuestions: QuizQuestion[] = [
            {
                id: 1,
                question: `What does this phrase mean in English: "${agentText.substring(0, 30)}..."?`,
                options: ['Greeting', 'Question', 'Farewell', 'Thank you'],
                correctAnswer: 0,
                explanation: 'This is a greeting phrase used to start a conversation.'
            },
            {
                id: 2,
                question: 'Select the correct translation for "Hello"',
                options: ['Adiós', 'Hola', 'Gracias', 'Por favor'],
                correctAnswer: 1,
                explanation: '"Hola" means "Hello" in Spanish.'
            },
            {
                id: 3,
                question: 'How would you say "Good morning" in Spanish?',
                options: ['Buenas noches', 'Buenos días', 'Buenas tardes', 'Hola'],
                correctAnswer: 1,
                explanation: '"Buenos días" means "Good morning" in Spanish.'
            }
        ];
        setQuizQuestions(sampleQuestions);
    };

    // Handle quiz completion
    const handleQuizComplete = (score: number, total: number) => {
        console.log(`Quiz completed: ${score}/${total}`);
        setStats(prev => ({
            ...prev,
            wordsLearned: prev.wordsLearned + Math.floor(score * 2),
            progress: Math.min(100, prev.progress + Math.floor((score / total) * 20))
        }));
    };

    return (
        <MainLayout
            description={t('meta.description')}
            title={t('meta.title')}
        >
            <Menu />
            <Header />
            <audio ref={audioRef} />
            
            <div className={css.container}>
                <div className={css.mainContent}>
                    {/* Left Panel - Chat & Conversation */}
                    <div className={css.chatPanel}>
                        {/* Header */}
                        <div className={css.chatHeader}>
                            <h1 className={css.pageTitle}>{t('title')}</h1>
                            <p className={css.pageSubtitle}>{t('subtitle')}</p>
                            
                            {/* Language Selector */}
                            <div className={css.languageArea}>
                                <LanguageSelectorVoxly
                                    value={currentLanguage}
                                    onChange={setCurrentLanguage}
                                    disabled={isConversationActive}
                                />
                                
                                <VoiceToggle
                                    value={isVoiceEnabled}
                                    onChange={setIsVoiceEnabled}
                                />
                            </div>
                        </div>

                        {/* Avatar Section */}
                        <div className={css.avatarSection}>
                            <VoxlyAvatar isSpeaking={isAgentSpeaking} />
                        </div>

                        {/* Chat Container */}
                        <div className={css.chatContainer}>
                            <ChatPanel
                                subtitles={subtitles}
                                currentSubtitle={currentSubtitle}
                                isAgentSpeaking={isAgentSpeaking}
                            />
                        </div>

                        {/* Controls */}
                        <div className={css.controls}>
                            {!isConversationActive ? (
                                <button
                                    className={css.startButton}
                                    onClick={handleStartConversation}
                                    disabled={isLoading}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                                    </svg>
                                    {isLoading ? t('listening') : t('startButton')}
                                </button>
                            ) : (
                                <div className={css.activeControls}>
                                    <MicButton
                                        isRecording={isRecording}
                                        isLoading={isLoading}
                                        onStartRecording={handleStartRecording}
                                        onStopRecording={handleStopRecording}
                                        onClick={simulateUserInteraction}
                                    />
                                    
                                    <button
                                        className={css.stopButton}
                                        onClick={handleStopConversation}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M6 6h12v12H6z"/>
                                        </svg>
                                        {t('stopButton')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel - Sidebar */}
                    <div className={css.sidebarPanel}>
                        <VoxlySidebar
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            vocabularyTips={vocabularyTips}
                            chatHistory={conversationHistory.map(msg => ({
                                ...msg,
                                timestamp: new Date()
                            }))}
                            stats={stats}
                            onOpenQuiz={() => setShowQuiz(true)}
                        />
                    </div>
                </div>
            </div>

            <Footer />

            {/* Quiz Popup */}
            <QuizPopup
                isOpen={showQuiz}
                onClose={() => setShowQuiz(false)}
                questions={quizQuestions}
                onComplete={handleQuizComplete}
            />
        </MainLayout>
    );
};

export default StartTalking;

export const getServerSideProps: GetServerSideProps = withTranslation(
    async () => ({ props: {} }),
    ['start-talking']
);

