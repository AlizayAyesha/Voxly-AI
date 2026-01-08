import React from 'react';
import styles from './voice-toggle.module.scss';

export type VoiceGender = 'male' | 'female';

interface VoiceToggleProps {
    value?: boolean;
    onChange?: (value: boolean) => void;
    className?: string;
}

export const VoiceToggle: React.FC<VoiceToggleProps> = ({
    value = false,
    onChange,
    className
}) => {
    return (
        <button
            className={`${styles.toggle} ${value ? styles.enabled : ''} ${className || ''}`}
            onClick={() => onChange?.(!value)}
        >
            <span className={styles.track}>
                <span className={styles.thumb} />
            </span>
            <span className={styles.label}>
                {value ? 'Voice On' : 'Voice Off'}
            </span>
        </button>
    );
};

export default VoiceToggle;

