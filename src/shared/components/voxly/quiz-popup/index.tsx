import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import css from './quiz-popup.module.scss';

export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

interface QuizPopupProps {
    isOpen: boolean;
    onClose: () => void;
    questions: QuizQuestion[];
    onComplete: (score: number, total: number) => void;
}

export const QuizPopup: React.FC<QuizPopupProps> = ({
    isOpen,
    onClose,
    questions,
    onComplete
}) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setCurrentQuestion(0);
            setSelectedAnswer(null);
            setShowExplanation(false);
            setScore(0);
            setIsComplete(false);
        }
    }, [isOpen]);

    const handleAnswerSelect = (index: number) => {
        if (showExplanation) return;
        if (!questions || questions.length === 0) return;
        
        setSelectedAnswer(index);
        setShowExplanation(true);

        if (index === questions[currentQuestion].correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            setIsComplete(true);
            onComplete(score, questions.length);
        }
    };

    const handleClose = () => {
        onClose();
    };

    if (!isOpen) return null;

    // Guard against empty questions array
    if (!questions || questions.length === 0) {
        return (
            <div className={css.overlay}>
                <div className={css.backdrop} onClick={handleClose} />
                <div className={css.popup}>
                    <p>No quiz questions available.</p>
                    <button className={css.closeButton} onClick={handleClose}>
                        Close
                    </button>
                </div>
            </div>
        );
    }

    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className={css.overlay}>
            <div className={css.backdrop} onClick={handleClose} />
            
            <div className={css.popup}>
                <button className={css.closeButton} onClick={handleClose}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {!isComplete ? (
                    <>
                        {/* Progress Bar */}
                        <div className={css.progress}>
                            <div className={css.progressBar}>
                                <div className={css.progressFill} style={{ width: `${progress}%` }} />
                            </div>
                            <span className={css.progressText}>
                                Question {currentQuestion + 1} of {questions.length}
                            </span>
                        </div>

                        {/* Question */}
                        <div className={css.questionSection}>
                            <h3 className={css.question}>{question.question}</h3>
                        </div>

                        {/* Options */}
                        <div className={css.options}>
                            {question.options.map((option, index) => (
                                <button
                                    key={index}
                                    className={clsx(
                                        css.option,
                                        selectedAnswer === index && css.selected,
                                        showExplanation && index === question.correctAnswer && css.correct,
                                        showExplanation && selectedAnswer === index && index !== question.correctAnswer && css.incorrect
                                    )}
                                    onClick={() => handleAnswerSelect(index)}
                                    disabled={showExplanation}
                                >
                                    <span className={css.optionLetter}>
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <span className={css.optionText}>{option}</span>
                                    {showExplanation && index === question.correctAnswer && (
                                        <span className={css.answerIcon}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                            </svg>
                                        </span>
                                    )}
                                    {showExplanation && selectedAnswer === index && index !== question.correctAnswer && (
                                        <span className={css.answerIcon}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                            </svg>
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Explanation */}
                        {showExplanation && (
                            <div className={css.explanation}>
                                <p>{question.explanation}</p>
                                <button className={css.nextButton} onClick={handleNext}>
                                    {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    /* Results */
                    <div className={css.results}>
                        <div className={css.resultsIcon}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                <line x1="9" y1="9" x2="9.01" y2="9" />
                                <line x1="15" y1="9" x2="15.01" y2="9" />
                            </svg>
                        </div>
                        <h2 className={css.resultsTitle}>Quiz Complete!</h2>
                        <div className={css.score}>
                            <span className={css.scoreValue}>{score}</span>
                            <span className={css.scoreTotal}>/ {questions.length}</span>
                        </div>
                        <p className={css.resultsMessage}>
                            {score === questions.length
                                ? "Perfect score! You're doing amazing!"
                                : score >= questions.length / 2
                                ? "Good job! Keep practicing!"
                                : "Keep learning, you'll improve!"}
                        </p>
                        <button className={css.doneButton} onClick={handleClose}>
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizPopup;

