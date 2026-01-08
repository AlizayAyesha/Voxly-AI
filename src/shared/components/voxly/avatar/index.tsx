import React from 'react';
import styles from './avatar.module.scss';

interface VoxlyAvatarProps {
    isSpeaking?: boolean;
    className?: string;
}

export const VoxlyAvatar: React.FC<VoxlyAvatarProps> = ({
    isSpeaking = false,
    className
}) => {
    return (
        <div className={`${styles.avatar} ${isSpeaking ? styles.speaking : ''} ${className || ''}`}>
            <div className={styles.avatarContainer}>
                {/* Main avatar circle */}
                <div className={styles.mainCircle}>
                    {/* Inner gradient */}
                    <div className={styles.innerGlow} />
                    
                    {/* Face elements */}
                    <div className={styles.face}>
                        {/* Eyes */}
                        <div className={styles.eyes}>
                            <div className={`${styles.eye} ${styles.leftEye}`}>
                                <div className={styles.pupil} />
                            </div>
                            <div className={`${styles.eye} ${styles.rightEye}`}>
                                <div className={styles.pupil} />
                            </div>
                        </div>
                        
                        {/* Mouth - animates when speaking */}
                        <div className={`${styles.mouth} ${isSpeaking ? styles.talking : ''}`}>
                            <svg viewBox="0 0 40 20" className={styles.mouthSvg}>
                                <path 
                                    d="M 5 15 Q 20 25 35 15" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
                
                {/* Speaking waves */}
                {isSpeaking && (
                    <>
                        <div className={`${styles.wave} ${styles.wave1}`} />
                        <div className={`${styles.wave} ${styles.wave2}`} />
                        <div className={`${styles.wave} ${styles.wave3}`} />
                    </>
                )}
            </div>
            
            {/* Status indicator */}
            <div className={styles.status}>
                <span className={`${styles.statusDot} ${isSpeaking ? styles.pulse : ''}`} />
                <span className={styles.statusText}>
                    {isSpeaking ? 'Speaking...' : 'Ready'}
                </span>
            </div>
        </div>
    );
};

export default VoxlyAvatar;

