import React, { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { withTranslation } from 'app/providers/withTranslation';
import { useTranslation } from 'next-i18next';
import { Header } from 'widgets/header';
import css from './auth.module.scss';

type AuthMode = 'signIn' | 'signUp';

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

const Auth: NextPage = () => {
    const { t } = useTranslation('auth');
    const [mode, setMode] = useState<AuthMode>('signIn');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        let isValid = true;

        if (mode === 'signUp') {
            if (!formData.name.trim()) {
                newErrors.name = t('validation.required');
                isValid = false;
            }
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = t('validation.required');
                isValid = false;
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = t('validation.passwordMatch');
                isValid = false;
            }
        }

        if (!formData.email.trim()) {
            newErrors.email = t('validation.required');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('validation.invalidEmail');
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = t('validation.required');
            isValid = false;
        } else if (formData.password.length < 8) {
            newErrors.password = t('validation.passwordMin');
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (mode === 'signUp') {
                setSuccess(t('success.signUpComplete'));
                // Reset form after successful signup
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                });
            } else {
                // For demo purposes, just show success
                setSuccess(t('success.signUpComplete'));
            }
        } catch (err) {
            setError(mode === 'signUp' ? t('errors.signUpFailed') : t('errors.signInFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setMode(prev => prev === 'signIn' ? 'signUp' : 'signIn');
        setError(null);
        setSuccess(null);
        setErrors({});
    };

    const handleSocialLogin = (provider: string) => {
        console.log(`Social login with ${provider}`);
        // Implement social login logic here
    };

    return (
        <div className={css.container}>
            <div className={css.header}>
                <Header />
            </div>
            <div className={css.wrapper}>
                <div className={css.card}>
                    {/* Header */}
                    <div className={css.header}>
                        <h1 className={css.title}>
                            {success ? t('success.complete') : (mode === 'signIn' ? t('signIn.title') : t('signUp.title'))}
                        </h1>
                        <p className={css.subtitle}>
                            {success || t('subtitle')}
                        </p>
                    </div>

                    {success ? (
                        /* Success State */
                        <div className={css.successMessage}>
                            <div className={css.successIcon}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M9 12l2 2 4-4" />
                                </svg>
                            </div>
                            <h2 className={css.successTitle}>{t('success.complete')}</h2>
                            <p className={css.successText}>{success}</p>
                        </div>
                    ) : (
                        /* Form */
                        <form className={css.form} onSubmit={handleSubmit}>
                            {/* Sign Up: Name Field */}
                            {mode === 'signUp' && (
                                <div className={css.field}>
                                    <label className={css.label} htmlFor="name">
                                        {t('signUp.name')}
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className={`${css.input} ${errors.name ? css.inputError : ''}`}
                                        placeholder={t('signUp.name')}
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                    />
                                    {errors.name && <span className={css.error}>{errors.name}</span>}
                                </div>
                            )}

                            {/* Email Field */}
                            <div className={css.field}>
                                <label className={css.label} htmlFor="email">
                                    {mode === 'signIn' ? t('signIn.email') : t('signUp.email')}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className={`${css.input} ${errors.email ? css.inputError : ''}`}
                                    placeholder="email@example.com"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                />
                                {errors.email && <span className={css.error}>{errors.email}</span>}
                            </div>

                            {/* Password Field */}
                            <div className={css.field}>
                                <label className={css.label} htmlFor="password">
                                    {mode === 'signIn' ? t('signIn.password') : t('signUp.password')}
                                </label>
                                <div className={css.passwordWrapper}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        className={`${css.input} ${errors.password ? css.inputError : ''}`}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className={css.togglePassword}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && <span className={css.error}>{errors.password}</span>}
                                {mode === 'signIn' && (
                                    <Link href="/forgot-password" className={css.forgotPassword}>
                                        {t('signIn.forgotPassword')}
                                    </Link>
                                )}
                            </div>

                            {/* Sign Up: Confirm Password Field */}
                            {mode === 'signUp' && (
                                <div className={css.field}>
                                    <label className={css.label} htmlFor="confirmPassword">
                                        {t('signUp.confirmPassword')}
                                    </label>
                                    <div className={css.passwordWrapper}>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            className={`${css.input} ${errors.confirmPassword ? css.inputError : ''}`}
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className={css.togglePassword}
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                    <line x1="1" y1="1" x2="23" y2="23" />
                                                </svg>
                                            ) : (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <span className={css.error}>{errors.confirmPassword}</span>}
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div style={{ 
                                    padding: '0.75rem', 
                                    background: 'rgba(255, 71, 87, 0.1)', 
                                    border: '1px solid rgba(255, 71, 87, 0.3)',
                                    borderRadius: '12px',
                                    color: '#ff4757',
                                    fontFamily: 'PublicSans',
                                    fontSize: '0.9rem',
                                    textAlign: 'center'
                                }}>
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button 
                                type="submit" 
                                className={css.submitButton}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                                            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                                            <path d="M12 2a10 10 0 0 1 10 10" />
                                        </svg>
                                        {mode === 'signIn' ? 'Signing in...' : 'Creating account...'}
                                    </span>
                                ) : (
                                    mode === 'signIn' ? t('signIn.button') : t('signUp.button')
                                )}
                            </button>

                            {/* Terms (Sign Up only) */}
                            {mode === 'signUp' && (
                                <p className={css.terms}>
                                    {t('signUp.agreeTerms')}
                                    <a href="#" className={css.termsLink}>{t('signUp.termsOfService')}</a>
                                    {` ${t('signUp.and')} `}
                                    <a href="#" className={css.termsLink}>{t('signUp.privacyPolicy')}</a>
                                </p>
                            )}

                            {/* Social Divider */}
                            <div className={css.divider}>
                                <span className={css.dividerText}>{t('divider')}</span>
                            </div>

                            {/* Social Buttons */}
                            <div className={css.socialButtons}>
                                <button 
                                    type="button"
                                    className={css.socialButton}
                                    onClick={() => handleSocialLogin('google')}
                                >
                                    <svg className={css.socialIcon} viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    {t('socialButtons.google')}
                                </button>
                                <button 
                                    type="button"
                                    className={css.socialButton}
                                    onClick={() => handleSocialLogin('github')}
                                >
                                    <svg className={css.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                    {t('socialButtons.github')}
                                </button>
                                <button 
                                    type="button"
                                    className={css.socialButton}
                                    onClick={() => handleSocialLogin('discord')}
                                >
                                    <svg className={css.socialIcon} viewBox="0 0 24 24" fill="#5865F2">
                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                                    </svg>
                                    {t('socialButtons.discord')}
                                </button>
                            </div>

                            {/* Toggle Mode */}
                            <div className={css.toggle}>
                                <span className={css.toggleText}>
                                    {mode === 'signIn' ? t('signIn.noAccount') : t('signUp.hasAccount')}
                                    <button
                                        type="button"
                                        className={css.toggleLink}
                                        onClick={toggleMode}
                                    >
                                        {mode === 'signIn' ? t('toggle.toSignUp') : t('toggle.toSignIn')}
                                    </button>
                                </span>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <style jsx global>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Auth;

export const getServerSideProps: GetServerSideProps = withTranslation(
    async () => ({ props: {} }),
    ['auth']
);

