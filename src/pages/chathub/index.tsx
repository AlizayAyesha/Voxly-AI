import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { withTranslation } from 'app/providers/withTranslation';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { Header } from 'widgets/header';
import MainLayout from 'widgets/layouts/main-layout';
import { Menu } from 'widgets/menu';
import css from './chathub.module.scss';

// Supported languages for translation
const SUPPORTED_LANGUAGES = [
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
];

// Demo user data
interface User {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    status: 'online' | 'offline';
    lastSeen?: string;
    unread?: number;
    lastMessage?: string;
    lastMessageTime?: string;
    isAdded?: boolean;
    nativeLanguage?: string;
    learningLanguage?: string;
}

interface Message {
    id: string;
    content: string;
    originalContent?: string;
    sender: 'me' | 'user';
    timestamp: Date;
    translatedTo?: string;
}

interface ChatHubProps {}

const ChatHub: NextPage<ChatHubProps> = () => {
    const { t } = useTranslation('chathub');

    // Translation state
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [translatingMessage, setTranslatingMessage] = useState<string | null>(null);
    const [showLangSelector, setShowLangSelector] = useState(false);

    // Demo users data - Language learning partners
    const demoUsers: User[] = [
        {
            id: 'alex',
            name: 'Alex Johnson',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
            bio: t('demoUsers.alex.bio'),
            status: 'online',
            lastMessage: 'Hola! ¿Cómo va tu español hoy?',
            lastMessageTime: '2m',
            unread: 2,
            nativeLanguage: 'en',
            learningLanguage: 'es'
        },
        {
            id: 'sarah',
            name: 'Sarah Chen',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            bio: t('demoUsers.sarah.bio'),
            status: 'online',
            lastMessage: '今日の日本語の練習はしましたか？',
            lastMessageTime: '15m',
            nativeLanguage: 'en',
            learningLanguage: 'ja'
        },
        {
            id: 'mike',
            name: 'Mike Wilson',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
            bio: t('demoUsers.mike.bio'),
            status: 'offline',
            lastSeen: '2h',
            lastMessage: 'Bonjour! Ça va?',
            lastMessageTime: '1h',
            nativeLanguage: 'fr',
            learningLanguage: 'en'
        },
        {
            id: 'emma',
            name: 'Emma Davis',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
            bio: t('demoUsers.emma.bio'),
            status: 'online',
            lastMessage: 'Guten Tag! Wie geht\'s?',
            lastMessageTime: '3h',
            nativeLanguage: 'en',
            learningLanguage: 'de'
        },
        {
            id: 'james',
            name: 'James Brown',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
            bio: t('demoUsers.james.bio'),
            status: 'offline',
            lastSeen: '5m',
            lastMessage: '你好! 你今天怎么样?',
            lastMessageTime: '5h',
            nativeLanguage: 'en',
            learningLanguage: 'zh'
        },
        {
            id: 'lisa',
            name: 'Lisa Park',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
            bio: t('demoUsers.lisa.bio'),
            status: 'online',
            lastMessage: '안녕하세요! Korean study session?',
            lastMessageTime: '1d',
            nativeLanguage: 'en',
            learningLanguage: 'ko'
        }
    ];

    // Sample messages for each user - Language learning themed
    const sampleMessages: Record<string, string[]> = {
        alex: [
            "Hola! ¿Cómo va tu español hoy?",
            "Practiced 30 minutes this morning 🌟",
            "Remember, 'R' sounds like a cat purring! 🐱",
            "The new vocabulary list is really helpful 📝",
            "Coffee break after study session? ☕"
        ],
        sarah: [
            "今日の日本語の練習はしましたか？",
            "I finally understood that grammar point! 🎉",
            "Have you watched any Japanese dramas lately?",
            "I love how the kanji looks so elegant",
            "Let's do a language exchange next week ☕"
        ],
        mike: [
            "Bonjour! Ça va?",
            "Your French pronunciation is getting so good!",
            "We should practice with that new vocabulary list 📝",
            "The past tense conjugations are tricky!",
            "Thanks for the language practice tips!"
        ],
        emma: [
            "Guten Tag! Wie geht's?",
            "Ich habe gestern Deutsch gelernt 🇩🇪",
            "The compound words are tricky but fun! 📚",
            "Want me to share the German podcast I found?",
            "My favorite word is Schadenfreude 😄"
        ],
        james: [
            "你好! 你今天怎么样?",
            "Chinese tones are challenging but I'm improving!",
            "Wrote 20 new characters today ✍️",
            "The tea ceremony was fascinating 🍵",
            "Mandarin has so many beautiful expressions"
        ],
        lisa: [
            "안녕하세요! Korean study session?",
            "I learned 10 new words today! 🎊",
            "Check out this Korean learning app!",
            "Just reached Diamond rank in Korean! 🎮",
            "The Hangul writing system is so clever"
        ]
    };

    // State
    const [friends, setFriends] = useState<User[]>(demoUsers);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'friends' | 'groups'>('friends');
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [friendRequestSent, setFriendRequestSent] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [searchQueryModal, setSearchQueryModal] = useState('');

    // Settings state
    const [showSettings, setShowSettings] = useState(false);
    const [settingsSaved, setSettingsSaved] = useState(false);
    const [userProfile, setUserProfile] = useState({
        displayName: 'Demo User',
        bio: 'Language learning enthusiast 🇺🇸 | Learning Spanish & Japanese',
        nativeLanguage: 'en',
        learningLanguage: 'es',
        notifications: true,
        darkMode: false,
        autoTranslate: false
    });
    const [editedProfile, setEditedProfile] = useState({ ...userProfile });
    
    // Photo upload state
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarUrl, setAvatarUrl] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=User');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Apply dark mode to body
    useEffect(() => {
        if (userProfile.darkMode) {
            document.body.classList.add(css.darkMode);
        } else {
            document.body.classList.remove(css.darkMode);
        }
        
        // Cleanup on unmount
        return () => {
            document.body.classList.remove(css.darkMode);
        };
    }, [userProfile.darkMode]);

    // Auto-scroll to bottom when new messages added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Initialize chat when a user is selected
    useEffect(() => {
        if (selectedUser) {
            // Add some initial messages for demo
            const initialMessages: Message[] = [
                {
                    id: '1',
                    content: sampleMessages[selectedUser.id][0],
                    sender: 'user',
                    timestamp: new Date(Date.now() - 3600000)
                },
                {
                    id: '2',
                    content: sampleMessages[selectedUser.id][1],
                    sender: 'user',
                    timestamp: new Date(Date.now() - 1800000)
                }
            ];
            setMessages(initialMessages);

            // Clear unread for selected user
            setFriends(prev =>
                prev.map(friend =>
                    friend.id === selectedUser.id
                        ? { ...friend, unread: 0 }
                        : friend
                )
            );
        }
    }, [selectedUser]);

    // Filter friends based on search
    const filteredFriends = friends.filter(friend =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle send message
    const handleSendMessage = useCallback(() => {
        if (!inputValue.trim() || !selectedUser) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            content: inputValue,
            sender: 'me',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue('');

        // Simulate reply after a delay
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            const replyContent = sampleMessages[selectedUser.id][Math.floor(Math.random() * sampleMessages[selectedUser.id].length)];
            
            // Auto-translate if enabled
            let finalContent = replyContent;
            let translatedContent: string | undefined;
            
            if (userProfile.autoTranslate && selectedLanguage !== 'en') {
                finalContent = autoTranslateMessage(replyContent);
                translatedContent = finalContent;
            }
            
            const replyMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: finalContent,
                originalContent: userProfile.autoTranslate && selectedLanguage !== 'en' ? replyContent : undefined,
                sender: 'user',
                timestamp: new Date(),
                translatedTo: userProfile.autoTranslate && selectedLanguage !== 'en' ? selectedLanguage : undefined
            };
            setMessages(prev => [...prev, replyMessage]);
        }, 1500 + Math.random() * 2000);
    }, [inputValue, selectedUser, userProfile.autoTranslate, selectedLanguage]);

    // Handle add friend
    const handleAddFriend = (user: User) => {
        if (user.isAdded) return;

        setFriends(prev =>
            prev.map(friend =>
                friend.id === user.id
                    ? { ...friend, isAdded: true }
                    : friend
            )
        );

        setFriendRequestSent(user.id);
        setTimeout(() => setFriendRequestSent(null), 3000);
    };

    // Handle key press
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Format time
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Get user display status
    const getUserStatus = (user: User) => {
        if (user.status === 'online') return t('online');
        if (user.lastSeen) return `Last seen ${user.lastSeen}`;
        return t('offline');
    };

    // Filter users for modal search
    const modalFilteredUsers = demoUsers.filter(user =>
        user.name.toLowerCase().includes(searchQueryModal.toLowerCase()) &&
        !friends.find(f => f.id === user.id)?.isAdded
    );

    // Handle translate message
    const handleTranslate = (messageId: string, originalContent: string) => {
        setTranslatingMessage(messageId);
        
        // Simulate translation delay
        setTimeout(() => {
            const targetLang = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage);
            
            setMessages(prev => prev.map(msg => {
                if (msg.id === messageId) {
                    return {
                        ...msg,
                        originalContent: msg.content,
                        content: `[${targetLang?.flag} ${targetLang?.name}] ${originalContent}`,
                        translatedTo: selectedLanguage
                    };
                }
                return msg;
            }));
            setTranslatingMessage(null);
            setShowLangSelector(false);
        }, 500);
    };

    // Get language flag by code
    const getLangFlag = (code: string) => {
        return SUPPORTED_LANGUAGES.find(l => l.code === code)?.flag || '🌐';
    };

    // Handle photo upload
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create a local URL for preview
            const url = URL.createObjectURL(file);
            setAvatarUrl(url);
            setAvatarFile(file);
        }
    };

    const handleRemovePhoto = () => {
        setAvatarUrl('https://api.dicebear.com/7.x/avataaars/svg?seed=User');
        setAvatarFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Auto-translate incoming messages
    const autoTranslateMessage = (messageContent: string): string => {
        const targetLang = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage);
        return `[${targetLang?.flag} ${targetLang?.name}] ${messageContent}`;
    };

    return (
        <MainLayout
            description={t('meta.description')}
            title={t('meta.title')}
        >
            <Menu />
            <Header />

            <div className={css.container}>
                <div className={css.mainContent}>
                    {/* Left Sidebar - Friends List */}
                    <div className={css.sidebar}>
                        <div className={css.sidebarHeader}>
                            <div className={css.searchRow}>
                                <div className={css.searchBox}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="m21 21-4.35-4.35" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder={t('searchPlaceholder')}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                <button
                                    className={css.settingsBtn}
                                    onClick={() => {
                                        setEditedProfile({ ...userProfile });
                                        setSettingsSaved(false);
                                        setShowSettings(true);
                                    }}
                                    title={t('settings.title')}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="3" />
                                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                    </svg>
                                </button>
                            </div>

                            <div className={css.tabs}>
                                <button
                                    className={clsx(activeTab === 'friends' && css.active)}
                                    onClick={() => setActiveTab('friends')}
                                >
                                    {t('friends')}
                                </button>
                                <button
                                    className={clsx(activeTab === 'groups' && css.active)}
                                    onClick={() => setActiveTab('groups')}
                                >
                                    {t('groups')}
                                </button>
                            </div>

                            <button
                                className={css.addFriendBtn}
                                onClick={() => setShowAddFriend(true)}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="8.5" cy="7" r="4" />
                                    <line x1="20" y1="8" x2="20" y2="14" />
                                    <line x1="23" y1="11" x2="17" y2="11" />
                                </svg>
                                {t('addFriend')}
                            </button>
                        </div>

                        <div className={css.friendsList}>
                            {filteredFriends.length > 0 ? (
                                filteredFriends.map(friend => (
                                    <div
                                        key={friend.id}
                                        className={clsx(
                                            css.friendItem,
                                            selectedUser?.id === friend.id && css.active
                                        )}
                                        onClick={() => setSelectedUser(friend)}
                                    >
                                        <div className={css.avatarWrapper}>
                                            <img
                                                src={friend.avatar}
                                                alt={friend.name}
                                                className={css.avatar}
                                            />
                                            {friend.status === 'online' ? (
                                                <div className={css.onlineIndicator} />
                                            ) : (
                                                <div className={css.offlineIndicator} />
                                            )}
                                        </div>
                                        <div className={css.friendInfo}>
                                            <div className={css.friendName}>{friend.name}</div>
                                            <div className={css.friendStatus}>
                                                {friend.lastMessage || friend.bio}
                                            </div>
                                        </div>
                                        <div className={css.friendMeta}>
                                            {friend.lastMessageTime && (
                                                <div className={css.lastTime}>{friend.lastMessageTime}</div>
                                            )}
                                            {friend.unread ? (
                                                <div className={css.unreadBadge}>{friend.unread}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={css.noFriends}>
                                    <p>{t('noFriends')}</p>
                                    <p className={css.emptyHint}>{t('addFirstFriend')}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className={css.chatArea}>
                        {selectedUser ? (
                            <>
                                <div className={css.chatHeader}>
                                    <img
                                        src={selectedUser.avatar}
                                        alt={selectedUser.name}
                                        className={css.chatAvatar}
                                    />
                                    <div className={css.chatUserInfo}>
                                        <div className={css.chatUserName}>{selectedUser.name}</div>
                                        <div className={clsx(
                                            css.chatUserStatus,
                                            selectedUser.status === 'offline' && css.offline
                                        )}>
                                            {getUserStatus(selectedUser)}
                                        </div>
                                    </div>
                                    <div className={css.languageSelector}>
                                        <button 
                                            className={css.langSelectorBtn}
                                            onClick={() => setShowLangSelector(!showLangSelector)}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10"/>
                                                <line x1="2" y1="12" x2="22" y2="12"/>
                                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                                            </svg>
                                            {getLangFlag(selectedLanguage)} 
                                            <span className={css.langName}>
                                                {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name}
                                            </span>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="6 9 12 15 18 9"/>
                                            </svg>
                                        </button>
                                        {showLangSelector && (
                                            <div className={css.langDropdown}>
                                                {SUPPORTED_LANGUAGES.map(lang => (
                                                    <button
                                                        key={lang.code}
                                                        className={clsx(
                                                            css.langOption,
                                                            selectedLanguage === lang.code && css.active
                                                        )}
                                                        onClick={() => {
                                                            setSelectedLanguage(lang.code);
                                                            setShowLangSelector(false);
                                                        }}
                                                    >
                                                        <span className={css.langFlag}>{lang.flag}</span>
                                                        <span className={css.langLabel}>{lang.name}</span>
                                                        {selectedLanguage === lang.code && (
                                                            <svg className={css.checkIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <polyline points="20 6 9 17 4 12"/>
                                                            </svg>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={css.chatMessages}>
                                    {messages.map((message, index) => {
                                        // Check if message is from same sender as previous
                                        const isFirstInGroup = index === 0 ||
                                            messages[index - 1].sender !== message.sender;

                                        return (
                                            <div
                                                key={message.id}
                                                className={clsx(
                                                    css.messageGroup,
                                                    message.sender === 'me' ? css.sent : css.received
                                                )}
                                            >
                                                {isFirstInGroup && (
                                                    <div className={css.messageWrapper}>
                                                        <div className={css.messageBubble}>
                                                            {message.translatedTo ? (
                                                                <div className={css.translatedMessage}>
                                                                    <span className={css.originalMessage}>
                                                                        {message.originalContent}
                                                                    </span>
                                                                    <span className={css.translationDivider}>
                                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                            <path d="M12 3v18M3 12h18"/>
                                                                        </svg>
                                                                    </span>
                                                                    <span className={css.translatedText}>
                                                                        {message.content}
                                                                    </span>
                                                                    <span className={css.translationBadge}>
                                                                        {SUPPORTED_LANGUAGES.find(l => l.code === message.translatedTo)?.flag} {SUPPORTED_LANGUAGES.find(l => l.code === message.translatedTo)?.name}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                message.content
                                                            )}
                                                        </div>
                                                        <button
                                                            className={css.translateBtn}
                                                            onClick={() => handleTranslate(message.id, message.content)}
                                                            title="Translate message"
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <circle cx="12" cy="12" r="10"/>
                                                                <line x1="2" y1="12" x2="22" y2="12"/>
                                                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                                {isFirstInGroup && (
                                                    <div className={css.messageTime}>
                                                        {formatTime(message.timestamp)}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {isTyping && (
                                        <div className={css.typingIndicator}>
                                            <span />
                                            <span />
                                            <span />
                                        </div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>

                                <div className={css.chatInput}>
                                    <button className={css.attachmentBtn}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                        </svg>
                                    </button>
                                    <div className={css.inputWrapper}>
                                        <input
                                            type="text"
                                            placeholder={t('typeMessage')}
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                        />
                                    </div>
                                    <button
                                        className={css.sendButton}
                                        onClick={handleSendMessage}
                                        disabled={!inputValue.trim()}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="22" y1="2" x2="11" y2="13" />
                                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                        </svg>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className={css.noConversation}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                                <p>{t('noConversation')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Friend Modal */}
            {showAddFriend && (
                <div className={css.modalOverlay} onClick={() => setShowAddFriend(false)}>
                    <div className={css.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={css.modalHeader}>
                            <h2>{t('addFriendModal.title')}</h2>
                            <button
                                className={css.closeBtn}
                                onClick={() => setShowAddFriend(false)}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        {friendRequestSent && (
                            <div style={{ padding: '0 24px' }}>
                                <div className={css.successMessage}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    {t('addFriendModal.success')}
                                </div>
                            </div>
                        )}

                        <div className={css.modalSearch}>
                            <input
                                type="text"
                                placeholder={t('addFriendModal.searchPlaceholder')}
                                value={searchQueryModal}
                                onChange={(e) => setSearchQueryModal(e.target.value)}
                            />
                        </div>

                        <div className={css.modalContent}>
                            {modalFilteredUsers.map(user => {
                                const isFriend = friends.find(f => f.id === user.id)?.isAdded;

                                return (
                                    <div key={user.id} className={css.userSearchItem}>
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className={css.userSearchAvatar}
                                        />
                                        <div className={css.userSearchInfo}>
                                            <div className={css.name}>{user.name}</div>
                                            <div className={css.bio}>{user.bio}</div>
                                        </div>
                                        <button
                                            className={clsx(
                                                css.addUserBtn,
                                                isFriend && css.added
                                            )}
                                            onClick={() => handleAddFriend(user)}
                                            disabled={isFriend}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="12" y1="5" x2="12" y2="19" />
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                            {isFriend ? t('addFriendModal.alreadyFriends') : t('addFriendModal.add')}
                                        </button>
                                    </div>
                                );
                            })}

                            {modalFilteredUsers.length === 0 && (
                                <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                                    No users found
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {showSettings && (
                <div className={css.modalOverlay} onClick={() => setShowSettings(false)}>
                    <div className={css.settingsModal} onClick={(e) => e.stopPropagation()}>
                        <div className={css.modalHeader}>
                            <div className={css.settingsModalHeader}>
                                <div className={css.headerIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="3" />
                                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                    </svg>
                                </div>
                                <h2>{t('settings.title')}</h2>
                            </div>
                            <button
                                className={css.closeBtn}
                                onClick={() => setShowSettings(false)}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        {settingsSaved && (
                            <div className={css.successMessage}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                {t('settings.saved')}
                            </div>
                        )}

                        <div className={css.settingsContent}>
                            {/* Profile Section */}
                            <div className={css.settingsSection}>
                                <h3 className={css.sectionTitle}>{t('settings.profileSection')}</h3>

                                <div className={css.avatarUploadContainer}>
                                    <img
                                        src={avatarUrl}
                                        alt="Profile"
                                        className={css.avatarPreviewLarge}
                                    />
                                    <div className={css.uploadButtons}>
                                        <button
                                            className={css.uploadBtn}
                                            onClick={triggerFileInput}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                                <circle cx="12" cy="13" r="4" />
                                            </svg>
                                            {t('settings.avatar')}
                                        </button>
                                        {avatarUrl !== 'https://api.dicebear.com/7.x/avataaars/svg?seed=User' && (
                                            <button
                                                className={css.removeBtn}
                                                onClick={handleRemovePhoto}
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                </svg>
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className={css.fileInput}
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                    />
                                </div>

                                <div className={css.formGroup}>
                                    <label>{t('settings.displayName')}</label>
                                    <input
                                        type="text"
                                        value={editedProfile.displayName}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, displayName: e.target.value })}
                                        placeholder={t('settings.displayNamePlaceholder')}
                                    />
                                </div>

                                <div className={css.formGroup}>
                                    <label>{t('settings.bio')}</label>
                                    <textarea
                                        value={editedProfile.bio}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                                        placeholder={t('settings.bioPlaceholder')}
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {/* Languages Section */}
                            <div className={css.settingsSection}>
                                <h3 className={css.sectionTitle}>{t('settings.languagesSection')}</h3>

                                <div className={css.formGroup}>
                                    <label>{t('settings.nativeLanguage')}</label>
                                    <select
                                        value={editedProfile.nativeLanguage}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, nativeLanguage: e.target.value })}
                                    >
                                        {SUPPORTED_LANGUAGES.map(lang => (
                                            <option key={lang.code} value={lang.code}>
                                                {lang.flag} {lang.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className={css.formGroup}>
                                    <label>{t('settings.learningLanguage')}</label>
                                    <select
                                        value={editedProfile.learningLanguage}
                                        onChange={(e) => setEditedProfile({ ...editedProfile, learningLanguage: e.target.value })}
                                    >
                                        {SUPPORTED_LANGUAGES.map(lang => (
                                            <option key={lang.code} value={lang.code}>
                                                {lang.flag} {lang.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Preferences Section */}
                            <div className={css.settingsSection}>
                                <h3 className={css.sectionTitle}>{t('settings.preferencesSection')}</h3>

                                <div className={css.toggleGroup}>
                                    <div className={css.toggleInfo}>
                                        <span className={css.toggleLabel}>{t('settings.notifications')}</span>
                                        <span className={css.toggleDesc}>{t('settings.notificationsDesc')}</span>
                                    </div>
                                    <button
                                        className={clsx(css.toggle, editedProfile.notifications && css.active)}
                                        onClick={() => setEditedProfile({ ...editedProfile, notifications: !editedProfile.notifications })}
                                    >
                                        <span className={css.toggleKnob} />
                                    </button>
                                </div>

                                <div className={css.toggleGroup}>
                                    <div className={css.toggleInfo}>
                                        <span className={css.toggleLabel}>{t('settings.darkMode')}</span>
                                        <span className={css.toggleDesc}>{t('settings.darkModeDesc')}</span>
                                    </div>
                                    <button
                                        className={clsx(css.toggle, editedProfile.darkMode && css.active)}
                                        onClick={() => setEditedProfile({ ...editedProfile, darkMode: !editedProfile.darkMode })}
                                    >
                                        <span className={css.toggleKnob} />
                                    </button>
                                </div>

                                <div className={css.toggleGroup}>
                                    <div className={css.toggleInfo}>
                                        <span className={css.toggleLabel}>{t('settings.autoTranslate')}</span>
                                        <span className={css.toggleDesc}>{t('settings.autoTranslateDesc')}</span>
                                    </div>
                                    <button
                                        className={clsx(css.toggle, editedProfile.autoTranslate && css.active)}
                                        onClick={() => setEditedProfile({ ...editedProfile, autoTranslate: !editedProfile.autoTranslate })}
                                    >
                                        <span className={css.toggleKnob} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className={css.modalFooter}>
                            <button
                                className={css.cancelBtn}
                                onClick={() => setShowSettings(false)}
                            >
                                {t('settings.cancel')}
                            </button>
                            <button
                                className={css.saveBtn}
                                onClick={() => {
                                    setUserProfile(editedProfile);
                                    setSettingsSaved(true);
                                    setTimeout(() => setSettingsSaved(false), 3000);
                                }}
                            >
                                {t('settings.save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default ChatHub;

interface ChatHubServerSideProps {
    props: Record<string, unknown>;
}

export const getServerSideProps: GetServerSideProps<ChatHubServerSideProps> = withTranslation(
    async () => ({ props: {} }),
    ['chathub']
);

