import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { withTranslation } from 'app/providers/withTranslation';
import { Header } from 'widgets/header';
import MainLayout from 'widgets/layouts/main-layout';
import { Menu } from 'widgets/menu';
import css from './dashboard.module.scss';
import { useTranslation } from 'next-i18next';

interface ActivityItem {
    id: number;
    icon: string;
    text: string;
    lang: string;
    time: string;
}

interface Language {
    flag: string;
    name: string;
    level: string;
    progress: number;
}

interface Achievement {
    id: number;
    icon: string;
    title: string;
}

interface QuickAction {
    icon: string;
    title: string;
    desc: string;
    primary: boolean;
    action: () => void;
}

const Dashboard: NextPage = () => {
    const { t } = useTranslation('dashboard');
    const router = useRouter();

    const stats = [
        { icon: '🎤', value: t('stats.speakingMinutesValue'), label: t('stats.speakingMinutes') },
        { icon: '🌍', value: t('stats.languagesLearningValue'), label: t('stats.languagesLearning') },
        { icon: '🔥', value: t('stats.streakValue'), label: t('stats.streak') },
        { icon: '⭐', value: t('stats.fluencyScoreValue'), label: t('stats.fluencyScore') },
    ];

    const activities: ActivityItem[] = [
        { id: 1, icon: '📚', text: t('activity.item1'), lang: t('activity.item1Lang'), time: t('activity.item1Time') },
        { id: 2, icon: '💬', text: t('activity.item2'), lang: t('activity.item2Lang'), time: t('activity.item2Time') },
        { id: 3, icon: '🎯', text: t('activity.item3'), lang: t('activity.item3Lang'), time: t('activity.item3Time') },
    ];

    const languages: Language[] = [
        { flag: '🇪🇸', name: t('languagesInProgress.spanish'), level: t('languagesInProgress.spanishLevel'), progress: 72 },
        { flag: '🇫🇷', name: t('languagesInProgress.french'), level: t('languagesInProgress.frenchLevel'), progress: 38 },
        { flag: '🇩🇪', name: t('languagesInProgress.german'), level: t('languagesInProgress.germanLevel'), progress: 21 },
    ];

    const achievements: Achievement[] = [
        { id: 1, icon: '🏆', title: t('achievements.spanishBasics') },
        { id: 2, icon: '⭐', title: t('achievements.streak') },
        { id: 3, icon: '🎯', title: t('achievements.firstConversation') },
    ];

    const quickActions: QuickAction[] = [
        { 
            icon: '🎤', 
            title: t('quickActions.startTalking'), 
            desc: t('quickActions.startTalkingDesc'),
            primary: true,
            action: () => router.push('/start-talking')
        },
        { 
            icon: '🧠', 
            title: t('quickActions.takeQuiz'), 
            desc: t('quickActions.takeQuizDesc'),
            primary: false,
            action: () => router.push('/start-talking')
        },
        { 
            icon: '📊', 
            title: t('quickActions.viewProgress'), 
            desc: t('quickActions.viewProgressDesc'),
            primary: false,
            action: () => {}
        },
        { 
            icon: '🏆', 
            title: t('quickActions.certifications'), 
            desc: t('quickActions.certificationsDesc'),
            primary: false,
            action: () => {}
        },
    ];

    return (
        <div className={css.container}>
            <Menu />
            <Header />
            <div className={css.content}>
                {/* Hero Section */}
                <div className={css.hero}>
                    <h1 className={css.heroTitle}>{t('hero.title')}</h1>
                    <p className={css.heroSubtitle}>{t('hero.subtitle')}</p>
                    <button 
                        className={css.ctaButton}
                        onClick={() => router.push('/start-talking')}
                    >
                        <span className={css.ctaIcon}>🎤</span>
                        {t('hero.cta')}
                    </button>
                </div>

                {/* Stats Grid */}
                <div className={css.statsGrid}>
                    {stats.map((stat, index) => (
                        <div key={index} className={css.statCard}>
                            <div className={css.statIcon}>{stat.icon}</div>
                            <span className={css.statValue}>{stat.value}</span>
                            <span className={css.statLabel}>{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Dashboard Grid */}
                <div className={css.dashboardGrid}>
                    {/* Main Content - Left Side */}
                    <div className={css.mainContent}>
                        {/* Quick Actions */}
                        <div className={css.section}>
                            <h2 className={css.sectionTitle}>
                                <span className={css.sectionIcon}>⚡</span>
                                {t('quickActions.title')}
                            </h2>
                            <div className={css.quickActions}>
                                {quickActions.map((action, index) => (
                                    <button
                                        key={index}
                                        className={`${css.actionButton} ${action.primary ? css.actionPrimary : css.actionSecondary}`}
                                        onClick={action.action}
                                    >
                                        <div className={css.actionIcon}>{action.icon}</div>
                                        <div className={css.actionText}>
                                            <span className={css.actionTitle}>{action.title}</span>
                                            <span className={css.actionDesc}>{action.desc}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className={css.section}>
                            <h2 className={css.sectionTitle}>
                                <span className={css.sectionIcon}>📋</span>
                                {t('activity.title')}
                            </h2>
                            <ul className={css.activityList}>
                                {activities.map((activity) => (
                                    <li key={activity.id} className={css.activityItem}>
                                        <div className={css.activityIcon}>{activity.icon}</div>
                                        <div className={css.activityDetails}>
                                            <p className={css.activityText}>{activity.text}</p>
                                            <div className={css.activityMeta}>
                                                <span className={css.activityLang}>{activity.lang}</span>
                                                <span className={css.activityTime}>{activity.time}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Sidebar Content - Right Side */}
                    <div className={css.sidebarContent}>
                        {/* Languages in Progress */}
                        <div className={css.section}>
                            <h2 className={css.sectionTitle}>
                                <span className={css.sectionIcon}>🌍</span>
                                {t('languagesInProgress.title')}
                            </h2>
                            <div className={css.languagesList}>
                                {languages.map((lang, index) => (
                                    <div key={index} className={css.languageCard}>
                                        <div className={css.languageFlag}>{lang.flag}</div>
                                        <div className={css.languageInfo}>
                                            <div className={css.languageName}>
                                                <span className={css.languageTitle}>{lang.name}</span>
                                                <span className={css.languageLevel}>{lang.level}</span>
                                            </div>
                                            <div className={css.languageProgressBar}>
                                                <div 
                                                    className={css.languageProgressFill} 
                                                    style={{ width: `${lang.progress}%` }}
                                                />
                                            </div>
                                            <div className={css.languageProgressText}>{lang.progress}%</div>
                                        </div>
                                        <button 
                                            className={css.languageCta}
                                            onClick={() => router.push('/start-talking')}
                                        >
                                            {t('languagesInProgress.continuePractice')}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Weekly Progress */}
                        <div className={css.section}>
                            <h2 className={css.sectionTitle}>
                                <span className={css.sectionIcon}>📈</span>
                                {t('weeklyProgress.title')}
                            </h2>
                            <div className={css.progressContainer}>
                                <div className={css.progressHeader}>
                                    <span className={css.progressTitle}>{t('weeklyProgress.daysActive')}</span>
                                    <span className={css.progressDays}>{t('weeklyProgress.daysActive')}</span>
                                </div>
                                <div className={css.progressBar}>
                                    <div 
                                        className={css.progressFill}
                                        style={{ width: '71%' }}
                                    />
                                </div>
                                <p className={css.progressEncouragement}>{t('weeklyProgress.continue')}</p>
                            </div>
                        </div>

                        {/* Achievements */}
                        <div className={css.section}>
                            <h2 className={css.sectionTitle}>
                                <span className={css.sectionIcon}>🏆</span>
                                {t('achievements.title')}
                            </h2>
                            <div className={css.achievementsGrid}>
                                {achievements.map((achievement) => (
                                    <div key={achievement.id} className={css.achievementCard}>
                                        <div className={css.achievementIcon}>{achievement.icon}</div>
                                        <span className={css.achievementTitle}>{achievement.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className={css.bottomCta}>
                    <div className={css.bottomCtaContent}>
                        <h3 className={css.bottomCtaTitle}>{t('bottomCta.title')}</h3>
                        <p className={css.bottomCtaSubtitle}>{t('bottomCta.subtitle')}</p>
                        <button 
                            className={css.bottomCtaButton}
                            onClick={() => router.push('/start-talking')}
                        >
                            <span className={css.ctaIcon}>🎤</span>
                            {t('bottomCta.button')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = withTranslation(
    async () => {
        return {
            props: {}
        }
    },
    ['dashboard']
)

