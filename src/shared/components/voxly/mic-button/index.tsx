import React from 'react';
import styles from './mic-button.module.scss';

interface MicButtonProps {
    isListening?: boolean;
    isProcessing?: boolean;
    isRecording?: boolean;
    isLoading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    onStartRecording?: () => void;
    onStopRecording?: () => void;
    className?: string;
}

export const MicButton: React.FC<MicButtonProps> = ({
    isListening = false,
    isProcessing = false,
    isRecording = false,
    isLoading = false,
    disabled = false,
    onClick,
    onStartRecording,
    onStopRecording,
    className
}) => {
    // Determine button state - prefer specific states over general ones
    const isActive = isRecording || isListening;
    const isBusy = isProcessing || isLoading;
    
    const handleClick = () => {
        if (isActive) {
            onStopRecording?.();
        } else {
            onStartRecording?.();
        }
        onClick?.();
    };
    
    return (
        <div className={`${styles.container} ${className || ''}`}>
            <button
                className={`
                    ${styles.button}
                    ${isActive ? styles.listening : ''}
                    ${isBusy ? styles.processing : ''}
                    ${disabled ? styles.disabled : ''}
                `}
                onClick={handleClick}
                disabled={disabled || isBusy}
            >
                {isBusy ? (
                    <div className={styles.spinner} />
                ) : (
                    <svg 
                        width="28" 
                        height="28" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                    >
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                        <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                )}
                {isActive && <div className={styles.wave} />}
            </button>
            <span className={styles.label}>
                {isBusy ? 'Processing...' : isActive ? 'Listening...' : 'Tap to speak'}
            </span>
        </div>
    );
};

export default MicButton;

