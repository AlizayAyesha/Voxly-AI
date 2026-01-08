import clsx from 'clsx';
import React from 'react';
import css from './arrow-button.module.scss';

interface Props {
    className?: string;
    disabled?: boolean;
    type?: 'button' | 'submit';
    variant?: "prev" | "next";
    onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ArrowButton: React.FC<Props> = ({
    className,
    disabled,
    onClick,
    type,
    variant = "next"
}) => {
    return (
        <button 
            className={clsx(
                css.button,
                css['button_' + variant], 
                className
            )}
            type={type}
            onClick={onClick}
            disabled={disabled}
                aria-label={variant === 'prev' ? 'Previous' : 'Next'}
        >
                {/* visually-friendly label removed; show arrows */}
                <span className={css.icon}>{variant === 'prev' ? '<' : '>'}</span>
        </button>
    );
}