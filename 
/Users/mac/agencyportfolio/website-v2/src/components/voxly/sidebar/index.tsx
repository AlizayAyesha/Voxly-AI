import React, { useState } from 'react';
import clsx from 'clsx';
import css from './sidebar.module.scss';

export type TabType = 'history' | 'vocabulary' | 'quiz';

interface SidebarProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    vocabularyTips: string[];
    chatHistory: Array<{ role: string; content: string; timestamp: Date }>;
    stats: {
        dailyStreak: number;
        wordsLearned: number;
        conversationsCompleted: number;
        progress: number;
    };
    onOpenQuiz: () => void;
    className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
    activeTab,
    onTabChange,
    vocabularyTips,
    chatHistory,
    stats,
    onOpenQuiz,
    className
}) => {
    const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
        {
            id: 'history',
            label: 'History',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            )
        },
        {
            id: 'vocabulary',
            label: 'Vocabulary',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
            )
        },
        {
            id: 'quiz',
            label: 'Quiz',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
            )
        }
    ];

    return (
        <div className={clsx(css.sidebar, className)}>
            {/* Stats Section */}
            <div className={css.statsSection}>
                <div className={css.statsHeader}>
                    <span className={css.statsTitle}>Your Progress</span>
                    {stats.dailyStreak > 0 && (
                        <div className={css.streakBadge}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                            {stats.dailyStreak} day streak
                        </div>
                    )}
                </div>
                
                <div className={css.statsGrid}>
                    <div className={css.statItem}>
                        <div className={css.statIcon}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                <path d="M6 12v5c3 3 9 3 12 0v-5" />
                            </svg>
                        </div>
                        <div className={css.statContent}>
                            <span className={css.statValue}>{stats.wordsLearned}</span>
                            <span className={css.statLabel}>Words Learned</span>
                        </div>
                    </div>

                    <div className={css.statItem}>
                        <div className={css.statIcon}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <div className={css.statContent}>
                            <span className={css.statValue}>{stats.conversationsCompleted}</span>
                            <span className={css.statLabel}>Conversations</span>
                        </div>
                    </div>
                </div>

                <div className={css.progressSection}>
                    <div className={css.progressHeader}>
                        <span>Daily Goal</span>
                        <span>{stats.progress}%</span>
                    </div>
                    <div className={css.progressBar}>
                        <div 
                            className={css.progressFill} 
                            style={{ width: `${stats.progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className={css.tabsContainer}>
                <div className={css.tabs}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={clsx(css.tab, activeTab === tab.id && css.active)}
                            onClick={() => onTabChange(tab.id)}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className={css.tabContent}>
                    {activeTab === 'history' && (
                        <div className={css.historyTab}>
                            {chatHistory.length === 0 ? (
                                <div className={css.emptyState}>
                                    <p>No conversation history yet</p>
                                </div>
                            ) : (
                                <div className={css.historyList}>
                                    {chatHistory.map((msg, idx) => (
                                        <div 
                                            key={idx}
                                            className={clsx(css.historyItem, css[msg.role])}
                                        >
                                            <span className={css.historyRole}>
                                                {msg.role === 'user' ? 'You' : 'Voxly'}
                                            </span>
                                            <p className={css.historyContent}>
                                                {msg.content.substring(0, 100)}
                                                {msg.content.length > 100 && '...'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'vocabulary' && (
                        <div className={css.vocabularyTab}>
                            {vocabularyTips.length === 0 ? (
                                <div className={css.emptyState}>
                                    <p>Words you struggle with will appear here</p>
                                </div>
                            ) : (
                                <div className={css.vocabularyList}>
                                    {vocabularyTips.map((word, idx) => (
                                        <div key={idx} className={css.vocabItem}>
                                            <span className={css.vocabWord}>{word}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'quiz' && (
                        <div className={css.quizTab}>
                            <div className={css.quizCard}>
                                <div className={css.quizIcon}>
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                        <line x1="12" y1="17" x2="12.01" y2="17" />
                                    </svg>
                                </div>
                                <h4>Test Your Knowledge!</h4>
                                <p>Take a quick quiz based on your recent conversation to reinforce what you've learned.</p>
                                <button className={css.quizButton} onClick={onOpenQuiz}>
                                    Start Quiz
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

