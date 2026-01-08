import React from 'react';
import clsx from 'clsx';
import css from './avatar.module.scss';

interface AvatarProps {
    isSpeaking: boolean;
    className?: string;
}

export const VoxlyAvatar: React.FC<AvatarProps> = ({ isSpeaking, className }) => {
    return (
        <div className={clsx(css.avatarWrapper, isSpeaking && css.speaking, className)}>
            <div className={css.avatarContainer}>
                <img 
                    src="/img/logo.svg" 
                    alt="Voxly" 
                    className={css.avatar}
                />
                <div className={css.glow} />
            </div>
            {isSpeaking && (
                <div className={css.speakingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            )}
            <div className={css.statusBadge}>
                <span className={css.statusDot}></span>
                AI Online
            </div>
        </div>
    );
};

export default VoxlyAvatar;

