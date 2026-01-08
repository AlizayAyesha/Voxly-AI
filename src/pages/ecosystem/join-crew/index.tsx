import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { withTranslation } from 'app/providers/withTranslation';
import { useTranslation } from 'next-i18next';
import { Menu } from 'widgets/menu';
import { Header } from 'widgets/header';
import { Footer } from 'widgets/footer';
import MainLayout from 'widgets/layouts/main-layout';
import css from './join-crew.module.scss';

interface FormData {
    name: string;
    email: string;
    discord: string;
    twitter: string;
    languages: string;
    experience: string;
    motivation: string;
    referral: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    discord?: string;
    languages?: string;
    motivation?: string;
}

const JoinCrew: React.FC = () => {
    const { t } = useTranslation('ecosystem');
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        discord: '',
        twitter: '',
        languages: '',
        experience: '',
        motivation: '',
        referral: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = t('joinCrew.errors.nameRequired');
        } else if (formData.name.trim().length < 2) {
            newErrors.name = t('joinCrew.errors.nameMinLength');
        }

        if (!formData.email.trim()) {
            newErrors.email = t('joinCrew.errors.emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('joinCrew.errors.emailInvalid');
        }

        if (!formData.discord.trim()) {
            newErrors.discord = t('joinCrew.errors.discordRequired');
        }

        if (!formData.languages.trim()) {
            newErrors.languages = t('joinCrew.errors.languagesRequired');
        }

        if (!formData.motivation.trim()) {
            newErrors.motivation = t('joinCrew.errors.motivationRequired');
        } else if (formData.motivation.trim().length < 20) {
            newErrors.motivation = t('joinCrew.errors.motivationMinLength');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // In a real implementation, you would send this data to your backend
        console.log('Form submitted:', formData);

        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    const handleReset = () => {
        setFormData({
            name: '',
            email: '',
            discord: '',
            twitter: '',
            languages: '',
            experience: '',
            motivation: '',
            referral: ''
        });
        setErrors({});
        setIsSubmitted(false);
    };

    if (isSubmitted) {
        return (
            <MainLayout
                title="Application Submitted – Voxly"
                description={t('joinCrew.successMetaDescription')}
                className={css.root}
            >
                <Menu />
                <Header fixed />
                
                <div className={css.container}>
                    <div className={css.successCard}>
                        <div className={css.successIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="16 10 11 15 8 12" />
                            </svg>
                        </div>
                        
                        <h1 className={css.successTitle}>{t('joinCrew.successTitle')}</h1>
                        <p className={css.successMessage}>{t('joinCrew.successMessage')}</p>
                        
                        <div className={css.successDetails}>
                            <p>{t('joinCrew.successDetails')}</p>
                        </div>

                        <button className={css.submitButton} onClick={handleReset}>
                            {t('joinCrew.submitAnother')}
                        </button>
                        
                        <button className={css.backButton} onClick={() => router.push('/ecosystem')}>
                            {t('joinCrew.backToEcosystem')}
                        </button>
                    </div>
                </div>
                
                <Footer />
            </MainLayout>
        );
    }

    return (
        <MainLayout
            title="Join the Crew – Voxly"
            description={t('joinCrew.metaDescription')}
            className={css.root}
        >
            <Menu />
            <Header fixed />
            
            <div className={css.container}>
                <div className={css.header}>
                    <h1 className={css.title}>{t('joinCrew.title')}</h1>
                    <p className={css.subtitle}>{t('joinCrew.subtitle')}</p>
                </div>

                <form className={css.form} onSubmit={handleSubmit}>
                    <div className={css.section}>
                        <h2 className={css.sectionTitle}>{t('joinCrew.personalInfo')}</h2>
                        
                        <div className={css.formGroup}>
                            <label className={css.label} htmlFor="name">
                                {t('joinCrew.form.name')} <span className={css.required}>*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className={`${css.input} ${errors.name ? css.inputError : ''}`}
                                placeholder={t('joinCrew.form.namePlaceholder')}
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && <p className={css.error}>{errors.name}</p>}
                        </div>

                        <div className={css.formGroup}>
                            <label className={css.label} htmlFor="email">
                                {t('joinCrew.form.email')} <span className={css.required}>*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={`${css.input} ${errors.email ? css.inputError : ''}`}
                                placeholder={t('joinCrew.form.emailPlaceholder')}
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <p className={css.error}>{errors.email}</p>}
                        </div>
                    </div>

                    <div className={css.section}>
                        <h2 className={css.sectionTitle}>{t('joinCrew.socialInfo')}</h2>
                        
                        <div className={css.formGroup}>
                            <label className={css.label} htmlFor="discord">
                                {t('joinCrew.form.discord')} <span className={css.required}>*</span>
                            </label>
                            <input
                                type="text"
                                id="discord"
                                name="discord"
                                className={`${css.input} ${errors.discord ? css.inputError : ''}`}
                                placeholder={t('joinCrew.form.discordPlaceholder')}
                                value={formData.discord}
                                onChange={handleChange}
                            />
                            {errors.discord && <p className={css.error}>{errors.discord}</p>}
                        </div>

                        <div className={css.formGroup}>
                            <label className={css.label} htmlFor="twitter">
                                {t('joinCrew.form.twitter')}
                            </label>
                            <input
                                type="text"
                                id="twitter"
                                name="twitter"
                                className={css.input}
                                placeholder={t('joinCrew.form.twitterPlaceholder')}
                                value={formData.twitter}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={css.section}>
                        <h2 className={css.sectionTitle}>{t('joinCrew.languageInfo')}</h2>
                        
                        <div className={css.formGroup}>
                            <label className={css.label} htmlFor="languages">
                                {t('joinCrew.form.languages')} <span className={css.required}>*</span>
                            </label>
                            <input
                                type="text"
                                id="languages"
                                name="languages"
                                className={`${css.input} ${errors.languages ? css.inputError : ''}`}
                                placeholder={t('joinCrew.form.languagesPlaceholder')}
                                value={formData.languages}
                                onChange={handleChange}
                            />
                            {errors.languages && <p className={css.error}>{errors.languages}</p>}
                        </div>

                        <div className={css.formGroup}>
                            <label className={css.label} htmlFor="experience">
                                {t('joinCrew.form.experience')}
                            </label>
                            <textarea
                                id="experience"
                                name="experience"
                                className={css.textarea}
                                placeholder={t('joinCrew.form.experiencePlaceholder')}
                                value={formData.experience}
                                onChange={handleChange}
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className={css.section}>
                        <h2 className={css.sectionTitle}>{t('joinCrew.motivationInfo')}</h2>
                        
                        <div className={css.formGroup}>
                            <label className={css.label} htmlFor="motivation">
                                {t('joinCrew.form.motivation')} <span className={css.required}>*</span>
                            </label>
                            <textarea
                                id="motivation"
                                name="motivation"
                                className={`${css.textarea} ${errors.motivation ? css.inputError : ''}`}
                                placeholder={t('joinCrew.form.motivationPlaceholder')}
                                value={formData.motivation}
                                onChange={handleChange}
                                rows={4}
                            />
                            {errors.motivation && <p className={css.error}>{errors.motivation}</p>}
                        </div>

                        <div className={css.formGroup}>
                            <label className={css.label} htmlFor="referral">
                                {t('joinCrew.form.referral')}
                            </label>
                            <select
                                id="referral"
                                name="referral"
                                className={css.select}
                                value={formData.referral}
                                onChange={handleChange}
                            >
                                <option value="" disabled>{t('joinCrew.form.referralPlaceholder')}</option>
                                <option value="twitter">{t('joinCrew.referralOptions.twitter')}</option>
                                <option value="discord">{t('joinCrew.referralOptions.discord')}</option>
                                <option value="friend">{t('joinCrew.referralOptions.friend')}</option>
                                <option value="search">{t('joinCrew.referralOptions.search')}</option>
                                <option value="other">{t('joinCrew.referralOptions.other')}</option>
                            </select>
                        </div>
                    </div>

                    <div className={css.actions}>
                        <button
                            type="submit"
                            className={css.submitButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className={css.spinner} />
                                    {t('joinCrew.submitting')}
                                </>
                            ) : (
                                t('joinCrew.submit')
                            )}
                        </button>
                    </div>
                </form>
            </div>
            
            <Footer />
        </MainLayout>
    );
};

export default JoinCrew;

export const getServerSideProps: GetServerSideProps = withTranslation(
    async () => {
        return {
            props: {}
        };
    },
    ['ecosystem', 'common', 'header', 'footer']
);

