import React, { useState } from 'react';
import styles from './sidebar.module.scss';

export type TabType = 'history' | 'vocabulary' | 'stats';

interface ConversationItem {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface SidebarStats {
    dailyStreak: number;
    wordsLearned: number;
    conversationsCompleted: number;
    progress: number;
}

interface SidebarProps {
    activeTab?: TabType;
    onTabChange?: (tab: TabType) => void;
    vocabularyTips?: string[];
    chatHistory?: ConversationItem[];
    stats?: SidebarStats;
    onOpenQuiz?: () => void;
    className?: string;
}

export const VoxlySidebar: React.FC<SidebarProps> = ({
    activeTab = 'history',
    onTabChange,
    vocabularyTips = [],
    chatHistory = [],
    stats,
    onOpenQuiz,
    className
}) => {
    const [localActiveTab, setLocalActiveTab] = useState<TabType>(activeTab);
    
    const currentTab = activeTab || localActiveTab;
    
    const handleTabChange = (tabId: TabType) => {
        if (activeTab === undefined) {
            setLocalActiveTab(tabId);
        }
        onTabChange?.(tabId);
    };
    
    // Use provided stats or show placeholder
    const displayStats = stats || {
        dailyStreak: 3,
        wordsLearned: 156,
        conversationsCompleted: 24,
        progress: 65
    };

    const tabs = [
        { id: 'history' as TabType, label: 'History' },
        { id: 'vocabulary' as TabType, label: 'Vocabulary' },
        { id: 'stats' as TabType, label: 'Stats' }
    ];
    
    return (
        <div className={`${styles.sidebar} ${className || ''}`}>
            <div className={styles.tabs}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`${styles.tab} ${currentTab === tab.id ? styles.active : ''}`}
                        onClick={() => handleTabChange(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            
            <div className={styles.content}>
                {currentTab === 'history' && (
                    <div className={styles.historyTab}>
                        {chatHistory.length > 0 ? (
                            <div className={styles.chatHistory}>
                                {chatHistory.map((msg, idx) => (
                                    <div key={idx} className={styles.historyItem}>
                                        <div className={styles.historyIcon}>
                                            {msg.role === 'user' ? '👤' : '🤖'}
                                        </div>
                                        <div className={styles.historyDetails}>
                                            <p className={styles.historyTitle}>
                                                {msg.role === 'user' ? 'You' : 'Agent'}
                                            </p>
                                            <p className={styles.historyMessage}>
                                                {msg.content.substring(0, 50)}...
                                            </p>
                                            <p className={styles.historyTime}>
                                                {msg.timestamp.toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <p>No conversations yet</p>
                                <p className={styles.emptyHint}>Start a conversation to see history</p>
                            </div>
                        )}
                    </div>
                )}
                
                {currentTab === 'vocabulary' && (
                    <div className={styles.vocabTab}>
                        {vocabularyTips.length > 0 ? (
                            vocabularyTips.map((tip, idx) => (
                                <div key={idx} className={styles.vocabTip}>
                                    <span className={styles.vocabTipIcon}>💡</span>
                                    <p>{tip}</p>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className={styles.vocabTip}>
                                    <span className={styles.vocabTipIcon}>💡</span>
                                    <p>New words will appear here as you learn!</p>
                                </div>
                                <div className={styles.vocabList}>
                                    <div className={styles.vocabItem}>
                                        <span className={styles.vocabWord}>Hola</span>
                                        <span className={styles.vocabMeaning}>Hello</span>
                                    </div>
                                    <div className={styles.vocabItem}>
                                        <span className={styles.vocabWord}>Gracias</span>
                                        <span className={styles.vocabMeaning}>Thank you</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
                
                {currentTab === 'stats' && (
                    <div className={styles.statsTab}>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{displayStats.dailyStreak}</span>
                            <span className={styles.statLabel}>Day Streak</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{displayStats.wordsLearned}</span>
                            <span className={styles.statLabel}>Words</span>
                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statValue}>{displayStats.conversationsCompleted}</span>
                            <span className={styles.statLabel}>Conversations</span>
                        </div>
                        <div className={styles.progressSection}>
                            <p className={styles.progressTitle}>Daily Goal</p>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: `${displayStats.progress}%` }}></div>
                            </div>
                            <p className={styles.progressText}>{displayStats.progress}% complete</p>
                        </div>
                    </div>
                )}
            </div>
            
            <div className={styles.quizSection}>
                <button className={styles.quizButton} onClick={onOpenQuiz}>
                    <span className={styles.quizIcon}>test</span>
                    Take a Quiz
                </button>
            </div>
        </div>
    );
};

export default VoxlySidebar;

