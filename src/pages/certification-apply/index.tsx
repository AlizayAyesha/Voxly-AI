import React, { useState, useRef } from 'react';
import { GetServerSideProps } from 'next';
import { withTranslation } from 'app/providers/withTranslation';
import { useTranslation } from 'next-i18next';
import { Menu } from 'widgets/menu';
import { Header } from 'widgets/header';
import { Footer } from 'widgets/footer';
import MainLayout from 'widgets/layouts/main-layout';
import css from './certification-apply.module.scss';

// Test questions database
const testQuestions = {
  english: [
    {
      id: 1,
      question: "Choose the correct past tense: 'Yesterday, I ___ to the store.'",
      options: ["go", "gone", "went", "going"],
      correct: 2
    },
    {
      id: 2,
      question: "Which is the correct plural form?",
      options: ["Childs", "Children", "Childrens", "Childes"],
      correct: 1
    },
    {
      id: 3,
      question: "Select the correct article: '___ apple ___ day keeps the doctor away.'",
      options: ["An, a", "A, an", "The, a", "An, the"],
      correct: 0
    },
    {
      id: 4,
      question: "What is the opposite of 'ancient'?",
      options: ["Modern", "Old", "New", "Historic"],
      correct: 0
    },
    {
      id: 5,
      question: "Complete the phrase: 'Piece of ___'",
      options: ["Bread", "Cake", "Cookie", "Pie"],
      correct: 0
    },
    {
      id: 6,
      question: "Which sentence is grammatically correct?",
      options: [
        "She don't like apples.",
        "She doesn't like apples.",
        "She not like apples.",
        "She no like apples."
      ],
      correct: 1
    },
    {
      id: 7,
      question: "What is a synonym for 'happy'?",
      options: ["Sad", "Joyful", "Angry", "Tired"],
      correct: 1
    },
    {
      id: 8,
      question: "Choose the correct preposition: 'I'm interested ___ learning new things.'",
      options: ["in", "at", "on", "for"],
      correct: 0
    }
  ],
  spanish: [
    {
      id: 1,
      question: "¿Cómo se dice 'Hello' en español?",
      options: ["Adiós", "Hola", "Gracias", "Por favor"],
      correct: 1
    },
    {
      id: 2,
      question: "Completa: 'Yo ___ español.'",
      options: ["hablo", "hablas", "habla", "hablamos"],
      correct: 0
    },
    {
      id: 3,
      question: "¿Cuál es el masculino de 'hermosa'?",
      options: ["Hermoso", "Bonito", "Lindo", "Bello"],
      correct: 0
    },
    {
      id: 4,
      question: "Selecciona el verbo correcto: 'Ella ___ en la casa.'",
      options: ["vive", "vives", "vivir", "vivo"],
      correct: 0
    },
    {
      id: 5,
      question: "¿Qué significa 'library' en español?",
      options: ["Librería", "Biblioteca", "Museo", "Escuela"],
      correct: 1
    },
    {
      id: 6,
      question: "Completa: 'Los niños ___ al parque.'",
      options: ["van", "van a", "van al", "van a la"],
      correct: 2
    },
    {
      id: 7,
      question: "¿Cuál es el plural de 'país'?",
      options: ["Países", "Paíss", "Paises", "Paísos"],
      correct: 0
    },
    {
      id: 8,
      question: "Selecciona la opción correcta: '___ tiempo es bueno hoy.'",
      options: ["El", "La", "Un", "Una"],
      correct: 0
    }
  ],
  french: [
    {
      id: 1,
      question: "Comment dit-on 'Hello' en français?",
      options: ["Au revoir", "Bonjour", "Merci", "Bonjour"],
      correct: 1
    },
    {
      id: 2,
      question: "Complétez: 'Je ___ français.'",
      options: ["parles", "parle", "parlent", "parler"],
      correct: 1
    },
    {
      id: 3,
      question: "Quel est le féminin de 'grand'?",
      options: ["Grande", "Grands", "Grandes", "Grand"],
      correct: 0
    },
    {
      id: 4,
      question: "Choisissez l'article correct: '___ livre est sur la table.'",
      options: ["Le", "La", "Les", "Un"],
      correct: 0
    },
    {
      id: 5,
      question: "Que signifie 'library' en français?",
      options: ["Librairie", "Bibliothèque", "Librairie", "Bibliothèque"],
      correct: 1
    },
    {
      id: 6,
      question: "Complétez: 'Ils ___ au cinéma.'",
      options: ["vont", "vas", "allons", "aller"],
      correct: 0
    },
    {
      id: 7,
      question: "Quel est le pluriel de 'cheval'?",
      options: ["Chevals", "Chevaux", "Cheveaux", "Chevaus"],
      correct: 1
    },
    {
      id: 8,
      question: "Sélectionnez la phrase correcte:",
      options: [
        "J'ai mangé le pain",
        "J'ai mangé la pain",
        "J'ai mangé du pain",
        "J'ai mangé un pain"
      ],
      correct: 2
    }
  ],
  german: [
    {
      id: 1,
      question: "Wie sagt man 'Hello' auf Deutsch?",
      options: ["Tschüss", "Hallo", "Guten Tag", "Auf Wiedersehen"],
      correct: 1
    },
    {
      id: 2,
      question: "Ergänzen: 'Ich ___ Deutsch.'",
      options: ["spreche", "sprichst", "spricht", "sprechen"],
      correct: 0
    },
    {
      id: 3,
      question: "Was ist das Gegenteil von 'klein'?",
      options: ["Groß", "Alt", "Lang", "Neu"],
      correct: 0
    },
    {
      id: 4,
      question: "Wählen Sie den richtigen Artikel: '___ Mann ist nett.'",
      options: ["Der", "Die", "Das", "Den"],
      correct: 0
    },
    {
      id: 5,
      question: "Was bedeutet 'library' auf Deutsch?",
      options: ["Buchladen", "Bibliothek", "Bücherei", "Bibliothek"],
      correct: 1
    },
    {
      id: 6,
      question: "Ergänzen: 'Sie ___ jeden Tag.'",
      options: ["lest", "liest", "lesen", "lesen"],
      correct: 1
    },
    {
      id: 7,
      question: "Was ist der Plural von 'Kind'?",
      options: ["Kinds", "Kinder", "Kindres", "Kindes"],
      correct: 1
    },
    {
      id: 8,
      question: "Wählen Sie die richtige Präposition: 'Ich gehe ___ Supermarkt.'",
      options: ["in den", "zu der", "auf das", "im"],
      correct: 0
    }
  ],
  mandarin: [
    {
      id: 1,
      question: "'你好' means:",
      options: ["Goodbye", "Hello", "Thank you", "Sorry"],
      correct: 1
    },
    {
      id: 2,
      question: "'谢谢' means:",
      options: ["Hello", "Yes", "Thank you", "No"],
      correct: 2
    },
    {
      id: 3,
      question: "What is the correct pinyin for '谢谢'?",
      options: ["Nǐ hǎo", "Xiè xiè", "Zài jiàn", "Duì bù qǐ"],
      correct: 1
    },
    {
      id: 4,
      question: "'再见' means:",
      options: ["Good morning", "Goodbye", "Good night", "Thank you"],
      correct: 1
    },
    {
      id: 5,
      question: "Which tone is 'ma' with question mark?",
      options: ["First tone", "Second tone", "Third tone", "Fourth tone"],
      correct: 3
    },
    {
      id: 6,
      question: "'对不起' means:",
      options: ["Thank you", "Hello", "Sorry", "Goodbye"],
      correct: 2
    },
    {
      id: 7,
      question: "What does '朋友' mean?",
      options: ["Family", "Teacher", "Friend", "Student"],
      correct: 2
    },
    {
      id: 8,
      question: "'我喜欢学习中文' means:",
      options: [
        "I like to study Chinese",
        "I am learning Chinese",
        "I speak Chinese",
        "I want Chinese food"
      ],
      correct: 0
    }
  ],
  japanese: [
    {
      id: 1,
      question: "'こんにちは' means:",
      options: ["Goodbye", "Good night", "Hello", "Thank you"],
      correct: 2
    },
    {
      id: 2,
      question: "'ありがとう' means:",
      options: ["Hello", "Yes", "Thank you", "Sorry"],
      correct: 2
    },
    {
      id: 3,
      question: "What is 'さようなら'?",
      options: ["Hello", "Thank you", "Goodbye", "Excuse me"],
      correct: 2
    },
    {
      id: 4,
      question: "Which is the correct reading for '日本'?",
      options: ["Nichi-hon", "Nippon", "Ni-hon", "Nihon"],
      correct: 1
    },
    {
      id: 5,
      question: "'对不起' in Japanese is:",
      options: ["すみません", "ありがとう", "こんにちは", "さようなら"],
      correct: 0
    },
    {
      id: 6,
      question: "What does ' 친구' mean in Japanese hiragana?",
      options: ["ともだち", "せんせい", "がくせい", "はいしゃ"],
      correct: 0
    },
    {
      id: 7,
      question: "Which particle marks the topic?",
      options: ["は (wa)", "が (ga)", "に (ni)", "で (de)"],
      correct: 0
    },
    {
      id: 8,
      question: "'私は学生です' means:",
      options: [
        "I am a teacher",
        "I am a student",
        "He is a student",
        "She is a student"
      ],
      correct: 1
    }
  ],
  korean: [
    {
      id: 1,
      question: "'안녕하세요' means:",
      options: ["Goodbye", "Hello", "Thank you", "Sorry"],
      correct: 1
    },
    {
      id: 2,
      question: "'감사합니다' means:",
      options: ["Hello", "Yes", "Thank you", "No"],
      correct: 2
    },
    {
      id: 3,
      question: "What is '잘 가'?",
      options: ["Hello", "Goodbye", "Thank you", "Sorry"],
      correct: 1
    },
    {
      id: 4,
      question: "Which is correct for 'I am Korean'?",
      options: [
        "저는 한국입니다",
        "저는 한국이에요",
        "저는 한국입니다",
        "저는 한국입니다"
      ],
      correct: 1
    },
    {
      id: 5,
      question: "'미안합니다' means:",
      options: ["Thank you", "Hello", "Sorry", "Goodbye"],
      correct: 2
    },
    {
      id: 6,
      question: "What does ' 친구' mean?",
      options: ["Family", "Friend", "Teacher", "Student"],
      correct: 1
    },
    {
      id: 7,
      question: "Which is the politeness level marker?",
      options: ["아/어", "입니다", "이에요", "Both B and C"],
      correct: 3
    },
    {
      id: 8,
      question: "'한국어를 공부합니다' means:",
      options: [
        "I study Korean",
        "I speak Korean",
        "I am Korean",
        "I like Korean"
      ],
      correct: 0
    }
  ],
  portuguese: [
    {
      id: 1,
      question: "Como se diz 'Hello' em português?",
      options: ["Tchau", "Olá", "Por favor", "Obrigado"],
      correct: 1
    },
    {
      id: 2,
      question: "Complete: 'Eu ___ português.'",
      options: ["falo", "falas", "fala", "falamos"],
      correct: 0
    },
    {
      id: 3,
      question: "Qual é o contrário de 'grande'?",
      options: ["Novo", "Alto", "Pequeno", "Velho"],
      correct: 2
    },
    {
      id: 4,
      question: "Escolha o artigo correto: '___ livro está na mesa.'",
      options: ["O", "A", "Um", "Uma"],
      correct: 0
    },
    {
      id: 5,
      question: "O que significa 'library' em português?",
      options: ["Livraria", "Biblioteca", "Livraria", "Biblioteca"],
      correct: 1
    },
    {
      id: 6,
      question: "Complete: 'Eles ___ ao cinema.'",
      options: ["vão", "vas", "vamos", "vão a"],
      correct: 0
    },
    {
      id: 7,
      question: "Qual é o plural de 'país'?",
      options: ["Países", "Paísos", "Países", "Paísis"],
      correct: 0
    },
    {
      id: 8,
      question: "Qual frase está correta?",
      options: [
        "Eu tenho trinta anos",
        "Eu tenho trinta ano",
        "Eu tem trinta anos",
        "Eu tenho trinta anos"
      ],
      correct: 0
    }
  ],
  italian: [
    {
      id: 1,
      question: "Come si dice 'Hello' in italiano?",
      options: ["Arrivederci", "Ciao", "Grazie", "Prego"],
      correct: 1
    },
    {
      id: 2,
      question: "Completa: 'Io ___ italiano.'",
      options: ["parlo", "parli", "parla", "parlano"],
      correct: 0
    },
    {
      id: 3,
      question: "Qual è il contrario di 'grande'?",
      options: ["Nuovo", "Alto", "Piccolo", "Vecchio"],
      correct: 2
    },
    {
      id: 4,
      question: "Scegli l'articolo corretto: '___ libro è sulla tavola.'",
      options: ["Il", "Lo", "La", "L'"],
      correct: 0
    },
    {
      id: 5,
      question: "Cosa significa 'library' in italiano?",
      options: ["Libreria", "Biblioteca", "Libreria", "Biblioteca"],
      correct: 1
    },
    {
      id: 6,
      question: "Completa: 'Noi ___ al cinema.'",
      options: ["andiamo", "vai", "vanno", "andate"],
      correct: 0
    },
    {
      id: 7,
      question: "Qual è il plurale di 'ragazzo'?",
      options: ["Ragazzos", "Ragazzi", "Ragazzo", "Ragazze"],
      correct: 1
    },
    {
      id: 8,
      question: "Quale frase è corretta?",
      options: [
        "Ho fame",
        "Io ho fame",
        "Ho la fame",
        "Io ho la fame"
      ],
      correct: 0
    }
  ],
  russian: [
    {
      id: 1,
      question: "Как сказать 'Hello' на русском?",
      options: ["Пока", "Привет", "Спасибо", "Извините"],
      correct: 1
    },
    {
      id: 2,
      question: "Заполните: 'Я ___ русский.'",
      options: ["говорю", "говоришь", "говорит", "говорим"],
      correct: 0
    },
    {
      id: 3,
      question: "Какое противоположное слово 'большой'?",
      options: ["Маленький", "Новый", "Длинный", "Старый"],
      correct: 0
    },
    {
      id: 4,
      question: "Выберите правильный падеж: 'Я вижу ___ (кошка).'",
      options: ["кошка", "кошку", "кошкой", "кошке"],
      correct: 1
    },
    {
      id: 5,
      question: "Что значит 'library' на русском?",
      options: ["Книжный магазин", "Библиотека", "Книжный магазин", "Библиотека"],
      correct: 1
    },
    {
      id: 6,
      question: "Заполните: 'Они ___ в парк.'",
      options: ["идут", "идёт", "иду", "идёшь"],
      correct: 0
    },
    {
      id: 7,
      question: "Какое множественное число слова 'дом'?",
      options: ["Дома", "Домов", "Домсы", "Домы"],
      correct: 0
    },
    {
      id: 8,
      question: "Какое предложение правильное?",
      options: [
        "Я люблю читать книги",
        "Я люблю читать книга",
        "Я люблю читать книги",
        "Я люблю читать книги"
      ],
      correct: 0
    }
  ]
};

type Step = 'form' | 'test' | 'results';

interface FormData {
  name: string;
  language: string;
}

interface Answer {
  questionId: number;
  selectedOption: number;
  isCorrect: boolean;
}

const CertificationApply: React.FC = () => {
  const { t } = useTranslation('certification-apply');
  const [step, setStep] = useState<Step>('form');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    language: ''
  });
  const [errors, setErrors] = useState<{ name?: string; language?: string }>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [score, setScore] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const languages = Object.keys(testQuestions);
  const questions = formData.language ? testQuestions[formData.language as keyof typeof testQuestions] : [];
  const totalQuestions = questions.length;
  const passingScore = 50;

  const validateForm = (): boolean => {
    const newErrors: { name?: string; language?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = t('errors.nameRequired');
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('errors.nameMinLength');
    }

    if (!formData.language) {
      newErrors.language = t('errors.languageRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStartTest = () => {
    if (validateForm()) {
      setStep('test');
      setCurrentQuestion(0);
      setAnswers([]);
      setScore(0);
    }
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const question = questions[currentQuestion];
    const isCorrect = optionIndex === question.correct;

    setAnswers(prev => {
      const existingIndex = prev.findIndex(a => a.questionId === question.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { questionId: question.id, selectedOption: optionIndex, isCorrect };
        return updated;
      }
      return [...prev, { questionId: question.id, selectedOption: optionIndex, isCorrect }];
    });
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleFinishTest = () => {
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const calculatedScore = Math.round((correctAnswers / totalQuestions) * 100);
    setScore(calculatedScore);
    setStep('results');
  };

  const handleRetake = () => {
    setStep('form');
    setFormData({ name: '', language: '' });
    setCurrentQuestion(0);
    setAnswers([]);
    setScore(0);
  };

  const handleDownloadCertificate = () => {
    // In a real implementation, you would use html2canvas and jsPDF
    // For now, we'll create a downloadable HTML file
    const certificateContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Voxly Certification - ${formData.name}</title>
        <style>
          body { 
            margin: 0; 
            padding: 40px; 
            font-family: Arial, sans-serif; 
            background: linear-gradient(135deg, #0B101B 0%, #1a1f2e 50%, #0B101B 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .certificate {
            width: 800px;
            height: 600px;
            background: linear-gradient(135deg, #0B101B 0%, #1a1f2e 50%, #0B101B 100%);
            border: 8px solid #6C63FF;
            padding: 60px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: #ffffff;
            position: relative;
          }
          .certificate::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            border: 2px solid rgba(108, 99, 255, 0.3);
          }
          .badge {
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, #6C63FF 0%, #8b84ff 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 32px;
            font-size: 40px;
          }
          .title {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 32px;
            text-transform: uppercase;
            letter-spacing: 4px;
            color: #6C63FF;
          }
          .presented { font-size: 14px; color: rgba(255,255,255,0.6); margin-bottom: 8px; }
          .name { font-size: 42px; font-weight: bold; margin-bottom: 24px; padding: 0 40px; border-bottom: 2px solid rgba(108, 99, 255, 0.3); }
          .text { font-size: 16px; color: rgba(255,255,255,0.8); margin-bottom: 8px; }
          .language { font-size: 28px; font-weight: bold; color: #6C63FF; margin-bottom: 24px; }
          .score { font-size: 18px; color: rgba(255,255,255,0.6); margin-bottom: 32px; }
          .footer { display: flex; justify-content: space-between; width: 100%; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); }
          .date, .brand { text-align: center; }
          .date-label { font-size: 12px; color: rgba(255,255,255,0.5); text-transform: uppercase; }
          .date-value { font-size: 16px; color: rgba(255,255,255,0.9); }
          .brand-name { font-size: 24px; font-weight: bold; color: #6C63FF; }
          .verified { font-size: 12px; color: rgba(255,255,255,0.5); text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="badge">🏆</div>
          <div class="title">Certificate of Completion</div>
          <div class="presented">This is to certify that</div>
          <div class="name">${formData.name}</div>
          <div class="text">has successfully completed the</div>
          <div class="language">${t(`languages.${formData.language}`)} Language Proficiency Test</div>
          <div class="score">with a score of <strong>${score}%</strong></div>
          <div class="footer">
            <div class="date">
              <div class="date-label">Date</div>
              <div class="date-value">${new Date().toLocaleDateString()}</div>
            </div>
            <div class="brand">
              <div class="brand-name">Voxly</div>
              <div class="verified">Verified Certification</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([certificateContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Voxly_Certificate_${formData.name.replace(/\s+/g, '_')}_${formData.language}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentQuestionData = questions[currentQuestion];
  const currentAnswer = answers.find(a => a.questionId === currentQuestionData?.id);
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const passed = score >= passingScore;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={css.certification}>
      <Menu />
      <Header />
      
      <div className={css.container}>
        <div className={css.header}>
          <h1 className={css.title}>{t('title')}</h1>
          <p className={css.subtitle}>{t('subtitle')}</p>
        </div>

        {step === 'form' && (
          <div className={css.formSection}>
            <div className={css.formGroup}>
              <label className={css.label}>{t('form.nameLabel')}</label>
              <input
                type="text"
                className={css.input}
                placeholder={t('form.namePlaceholder')}
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
              {errors.name && <p className={css.error}>{errors.name}</p>}
            </div>

            <div className={css.formGroup}>
              <label className={css.label}>{t('form.languageLabel')}</label>
              <select
                className={css.select}
                value={formData.language}
                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
              >
                <option value="" disabled>{t('form.languagePlaceholder')}</option>
                {languages.map(lang => (
                  <option key={lang} value={lang} className={css.option}>
                    {t(`languages.${lang}`)}
                  </option>
                ))}
              </select>
              {errors.language && <p className={css.error}>{errors.language}</p>}
            </div>

            <button className={css.button} onClick={handleStartTest}>
              {t('form.startTest')}
            </button>
          </div>
        )}

        {step === 'test' && questions.length > 0 && (
          <div className={css.testSection}>
            <div className={css.testHeader}>
              <div className={css.testInfo}>
                <span className={css.testMeta}>{t('test.question')} {currentQuestion + 1} {t('test.of')} {totalQuestions}</span>
              </div>
              <div className={css.testInfo}>
                <span className={css.testMeta}>{t('test.passingScore')}</span>
              </div>
            </div>

            <div className={css.progressBar}>
              <div className={css.progressFill} style={{ width: `${progress}%` }} />
            </div>

            <div className={css.questionCard}>
              <p className={css.questionNumber}>{t('test.question')} {currentQuestion + 1}</p>
              <h3 className={css.questionText}>{currentQuestionData.question}</h3>

              <div className={css.options}>
                {currentQuestionData.options.map((option, index) => (
                  <div
                    key={index}
                    className={`${css.option} ${currentAnswer?.selectedOption === index ? css.selected : ''}`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <div className={css.optionRadio} />
                    <span className={css.optionText}>{option}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={css.testActions}>
              <button
                className={css.testButton}
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                {t('test.previous')}
              </button>
              
              {currentQuestion < totalQuestions - 1 ? (
                <button
                  className={`${css.testButton} ${css.primary}`}
                  onClick={handleNext}
                >
                  {t('test.next')}
                </button>
              ) : (
                <button
                  className={`${css.testButton} ${css.primary}`}
                  onClick={handleFinishTest}
                >
                  {t('test.finish')}
                </button>
              )}
            </div>
          </div>
        )}

        {step === 'results' && (
          <div className={css.resultsSection}>
            <div className={`${css.resultsIcon} ${passed ? css.passed : css.failed}`}>
              {passed ? '✓' : '✕'}
            </div>
            
            <h2 className={`${css.resultsTitle} ${passed ? css.passed : css.failed}`}>
              {passed ? t('results.passed') : t('results.failed')}
            </h2>
            
            <p className={css.resultsMessage}>
              {passed ? t('results.passMessage') : t('results.failMessage')}
            </p>

            <div className={css.scoreDisplay}>
              <div className={css.scoreValue}>{score}%</div>
              <div className={css.scoreLabel}>{t('results.score')}</div>
            </div>

            <div className={css.resultsActions}>
              <button className={css.testButton} onClick={handleRetake}>
                {t('results.retake')}
              </button>
              
              {passed && (
                <button className={css.certificateButton} onClick={handleDownloadCertificate}>
                  📜 {t('results.downloadCertificate')}
                </button>
              )}
            </div>

            {passed && (
              <div className={css.certificateWrapper}>
                <div className={css.certificate} ref={certificateRef}>
                  <div className={css.certificateBadge}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="6" />
                      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                    </svg>
                  </div>
                  
                  <h3 className={css.certificateTitle}>{t('certificate.title')}</h3>
                  
                  <p className={css.certificatePresented}>{t('certificate.presentedTo')}</p>
                  <h2 className={css.certificateName}>{formData.name}</h2>
                  
                  <p className={css.certificateText}>{t('certificate.hasCompleted')}</p>
                  <h3 className={css.certificateLanguage}>
                    {t(`languages.${formData.language}`)} {t('certificate.languageTest')}
                  </h3>
                  
                  <p className={css.certificateScore}>
                    {t('certificate.withScore')} <span>{score}%</span>
                  </p>
                  
                  <div className={css.certificateFooter}>
                    <div className={css.certificateDate}>
                      <p className={css.certificateDateLabel}>{t('certificate.date')}</p>
                      <p className={css.certificateDateValue}>{formatDate(new Date())}</p>
                    </div>
                    
                    <div className={css.certificateBrand}>
                      <p className={css.certificateBrandName}>{t('certificate.voxly')}</p>
                      <p className={css.certificateVerified}>{t('certificate.verified')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CertificationApply;

export const getServerSideProps: GetServerSideProps = withTranslation(
  async () => {
    return {
      props: {}
    };
  },
  ['certification-apply', 'common', 'header', 'footer']
);

