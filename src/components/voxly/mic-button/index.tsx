import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import css from './mic-button.module.scss';

interface MicButtonProps {
    isRecording: boolean;
    isLoading: boolean;
    onStartRecording: () => void;
    onStopRecording: () => void;
    disabled?: boolean;
    className?: string;
}

export const MicButton: React.FC<MicButtonProps> = ({
    isRecording,
    isLoading,
    onStartRecording,
    onStopRecording,
    disabled = false,
    className
}) => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const animationRef = useRef<number>();

    useEffect(() => {
        // Check for microphone permission on mount
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'microphone' as PermissionName })
                .then(permission => {
                    setHasPermission(permission.state === 'granted');
                })
                .catch(() => {
                    setHasPermission(null);
                });
        }
    }, []);

    const handleClick = () => {
        if (isRecording) {
            onStopRecording();
        } else {
            onStartRecording();
        }
    };

    return (
        <div className={clsx(css.micContainer, className)}>
            <button
                className={clsx(
                    css.micButton,
                    isRecording && css.recording,
                    isLoading && css.loading,
                    disabled && css.disabled
                )}
                onClick={handleClick}
                disabled={disabled || isLoading}
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
                <div className={css.buttonContent}>
                    {isLoading ? (
                        <div className={css.spinner}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    ) : isRecording ? (
                        <div className={css.stopIcon}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="6" y="6" width="12" height="12" rx="2" />
                            </svg>
                        </div>
                    ) : (
                        <div className={css.micIcon}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                <line x1="12" y1="19" x2="12" y2="23" />
                                <line x1="8" y1="23" x2="16" y2="23" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Waveform Animation */}
                <div className={css.waveformContainer}>
                    <div className={css.waveform}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                {/* Pulse Ring */}
                {isRecording && (
                    <div className={css.pulseRing} />
                )}
            </button>

            <p className={css.hint}>
                {isLoading ? (
                    'Processing...'
                ) : isRecording ? (
                    'Tap to stop'
                ) : (
                    'Tap to speak'
                )}
            </p>

            {hasPermission === false && (
                <p className={css.permissionWarning}>
                    Microphone access denied. Please enable it in settings.
                </p>
            )}
        </div>
    );
};

export default MicButton;

