import React from 'react';
import styles from './chat-panel.module.scss';

export interface Subtitle {
    id: number;
    text: string;
    speaker: 'agent' | 'user';
    language?: string;
    timestamp: Date;
    isTyping?: boolean;
}

interface ChatPanelProps {
    subtitles: Subtitle[];
    currentSubtitle?: string;
    isAgentSpeaking: boolean;
    className?: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
    subtitles,
    currentSubtitle,
    isAgentSpeaking,
    className
}) => {
    return (
        <div className={`${styles.chatPanel} ${className || ''}`}>
            <div className={styles.messagesContainer}>
                {subtitles.map((subtitle) => (
                    <div 
                        key={subtitle.id}
                        className={`${styles.messageWrapper} ${styles[subtitle.speaker]}`}
                    >
                        <div className={styles.messageBubble}>
                            {subtitle.language && (
                                <span className={styles.languageLabel}>
                                    {subtitle.language}
                                </span>
                            )}
                            <p className={styles.messageText}>{subtitle.text}</p>
                        </div>
                    </div>
                ))}
                {currentSubtitle && (
                    <div className={`${styles.messageWrapper} ${styles.agent}`}>
                        <div className={styles.messageBubble}>
                            <p className={styles.messageText}>{currentSubtitle}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPanel;

