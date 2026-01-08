import React, { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { withTranslation } from 'app/providers/withTranslation';
import { Footer } from 'widgets/footer';
import { Header } from 'widgets/header';
import MainLayout from 'widgets/layouts/main-layout';
import { Menu } from 'widgets/menu';
import { useTranslation } from 'next-i18next';
import css from './faq.module.scss';

// Icons
const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChevronDownIcon = (props: any) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"/>
    </svg>
);

const QuestionIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
);

const GeneralIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
);

const RocketIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    </svg>
);

const TechIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
);

const SupportIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
);

const ArrowRightIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12 5 19 12 12 19"/>
    </svg>
);

interface Question {
    id: string;
    question: string;
    answer: string;
}

interface Category {
    key: string;
    title: string;
    questions: Question[];
}

const FaqPage: NextPage = () => {
    const { t } = useTranslation('voxly-help-faq');
    const [searchQuery, setSearchQuery] = useState('');
    const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>({});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const categories = t('categories', { returnObjects: true }) as any[];
    const notFound = t('notFound', { returnObjects: true }) as { title: string; description: string; contactButton: string };

    const getCategoryIcon = (key: string) => {
        switch (key) {
            case 'general':
                return <GeneralIcon />;
            case 'getting-started':
                return <RocketIcon />;
            case 'technical':
                return <TechIcon />;
            default:
                return <QuestionIcon />;
        }
    };

    const toggleQuestion = (categoryKey: string, questionId: string) => {
        const key = `${categoryKey}-${questionId}`;
        setOpenQuestions(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const isQuestionOpen = (categoryKey: string, questionId: string) => {
        return openQuestions[`${categoryKey}-${questionId}`] || false;
    };

    const filterQuestions = (questions: Question[], query: string) => {
        if (!query) return questions;
        const lowerQuery = query.toLowerCase();
        return questions.filter(
            q => q.question.toLowerCase().includes(lowerQuery) || 
                q.answer.toLowerCase().includes(lowerQuery)
        );
    };

    const filterCategories = (categories: Category[], query: string) => {
        if (!query) return categories;
        return categories.map(category => ({
            ...category,
            questions: filterQuestions(category.questions, query)
        })).filter(category => category.questions.length > 0);
    };

    const filteredCategories = filterCategories(categories, searchQuery);
    const hasResults = filteredCategories.some(cat => cat.questions.length > 0);

    return (
        <MainLayout
            description={t('meta.description')}
            title={t('meta.title')}
        >
            <Menu />
            <Header />
            <div className={css.container}>
                <div className={css.pageWrapper}>
                    {/* Sidebar Navigation */}
                    <aside className={css.sidebar}>
                        <nav>
                            <span className={css.sidebarTitle}>Contents</span>
                            <ul className={css.navList}>
                                {categories.map((category: { key: string; title: string }) => (
                                    <li key={category.key} className={css.navItem}>
                                        <Link href={`#${category.key}`} className={css.navLink}>
                                            {getCategoryIcon(category.key)}
                                            {category.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className={css.mainContent}>
                        {/* Hero */}
                        <section className={css.hero}>
                            <h1 className={css.title}>{t('hero.title')}</h1>
                            <p className={css.subtitle}>{t('hero.subtitle')}</p>
                        </section>

                        {/* Search Box */}
                        <div className={css.searchBox}>
                            <div className={css.searchBoxInputWrapper}>
                                <SearchIcon />
                                <input
                                    type="text"
                                    className={css.searchBoxInput}
                                    placeholder="Search for answers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Categories */}
                        {searchQuery && !hasResults ? (
                            <div className={css.noResults}>
                                <h3 className={css.noResultsTitle}>No results found</h3>
                                <p className={css.noResultsDescription}>
                                    Try different keywords or browse the categories below
                                </p>
                            </div>
                        ) : (
                            <div className={css.categories}>
                                {filteredCategories.map((category: Category) => (
                                    <div key={category.key} className={css.category} id={category.key}>
                                        <h2 className={css.categoryTitle}>
                                            <span className={css.categoryTitleIcon}>
                                                {getCategoryIcon(category.key)}
                                            </span>
                                            {category.title}
                                        </h2>
                                        <div className={css.questions}>
                                            {category.questions.map((q: Question) => (
                                                <div 
                                                    key={q.id} 
                                                    className={`${css.questionItem} ${isQuestionOpen(category.key, q.id) ? css.open : ''}`}
                                                >
                                                    <button 
                                                        className={css.questionHeader}
                                                        onClick={() => toggleQuestion(category.key, q.id)}
                                                        aria-expanded={isQuestionOpen(category.key, q.id)}
                                                    >
                                                        <span className={css.question}>{q.question}</span>
                                                        <ChevronDownIcon className={css.toggleIcon} />
                                                    </button>
                                                    <div className={css.answer}>
                                                        <p className={css.answerContent}>{q.answer}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Not Found / Contact */}
                        <div className={css.notFound}>
                            <h3 className={css.notFoundTitle}>{notFound.title}</h3>
                            <p className={css.notFoundDescription}>{notFound.description}</p>
                            <a href="/contact" className={css.contactButton}>
                                <SupportIcon />
                                {notFound.contactButton}
                            </a>
                        </div>

                        {/* Next Steps */}
                        <div className={css.nextSteps}>
                            <Link href="/voxly-help/getting-started" className={css.nextStepLink}>
                                <ArrowRightIcon />
                                {t('nextSteps.gettingStarted')}
                            </Link>
                            <Link href="/voxly-help/features" className={css.nextStepLink}>
                                <ArrowRightIcon />
                                {t('nextSteps.exploreFeatures')}
                            </Link>
                        </div>
                    </main>
                </div>
            </div>
            <Footer />
        </MainLayout>
    );
};

export default FaqPage;

export const getServerSideProps: GetServerSideProps = withTranslation(
    async () => ({ props: {} }),
    ['voxly-help-faq']
);
