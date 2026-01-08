import React, { useRef, useEffect } from 'react';
import clsx from 'clsx';
import css from './chat-panel.module.scss';

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
    const containerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [subtitles, currentSubtitle]);

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className={clsx(css.chatPanel, className)}>
            <div className={css.messagesContainer} ref={containerRef}>
                {subtitles.length === 0 && !currentSubtitle && (
                    <div className={css.emptyState}>
                        <div className={css.emptyIcon}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                        </div>
                        <p className={css.emptyText}>
                            Start a conversation to begin practicing!
                        </p>
                    </div>
                )}

                {subtitles.map((subtitle) => (
                    <div 
                        key={subtitle.id}
                        className={clsx(
                            css.messageWrapper,
                            css[subtitle.speaker]
                        )}
                    >
                        <div className={css.messageBubble}>
                            {subtitle.language && (
                                <span className={css.languageLabel}>
                                    {subtitle.language}
                                </span>
                            )}
                            <p className={css.messageText}>{subtitle.text}</p>
                            <span className={css.timestamp}>
                                {formatTime(subtitle.timestamp)}
                            </span>
                        </div>
                    </div>
                ))}

                {currentSubtitle && (
                    <div className={clsx(css.messageWrapper, css.agent)}>
                        <div className={clsx(css.messageBubble, css.typing)}>
                            <div className={css.typingIndicator}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {isAgentSpeaking && currentSubtitle && (
                <div className={css.liveSubtitle}>
                    <div className={css.liveLabel}>
                        <span className={css.liveDot}></span>
                        LIVE
                    </div>
                    <p className={css.liveText}>{currentSubtitle}</p>
                </div>
            )}
        </div>
    );
};

export default ChatPanel;

