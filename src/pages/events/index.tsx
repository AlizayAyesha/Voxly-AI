import React from 'react';
import { GetServerSideProps } from 'next';
import { withTranslation } from 'app/providers/withTranslation';
import { useTranslation } from 'next-i18next';
import { Menu } from 'widgets/menu';
import { Header } from 'widgets/header';
import { Footer } from 'widgets/footer';
import MainLayout from 'widgets/layouts/main-layout';
import css from './events.module.scss';

interface EventItem {
    id: number;
    title: string;
    type: 'graduates' | 'beginner' | 'qa' | 'swags';
    location: string;
    month: string;
    price: number;
    isFree: boolean;
}

const upcomingEvents: EventItem[] = [
    {
        id: 1,
        title: "Congratulating Graduates Ceremony",
        type: 'graduates',
        location: "Virtual",
        month: "January",
        price: 5,
        isFree: false
    },
    {
        id: 2,
        title: "Beginner's Guide to Language Learning",
        type: 'beginner',
        location: "California",
        month: "February",
        price: 5,
        isFree: false
    },
    {
        id: 3,
        title: "Experience Q&A & Opportunities",
        type: 'qa',
        location: "Los Angeles",
        month: "March",
        price: 0,
        isFree: true
    },
    {
        id: 4,
        title: "Win Swags Contest",
        type: 'swags',
        location: "Virginia",
        month: "April",
        price: 5,
        isFree: false
    },
    {
        id: 5,
        title: "Virtual Meetup: Graduates Celebration",
        type: 'graduates',
        location: "Virtual",
        month: "May",
        price: 0,
        isFree: true
    },
    {
        id: 6,
        title: "Advanced Q&A Session",
        type: 'qa',
        location: "California",
        month: "June",
        price: 5,
        isFree: false
    }
];

const Events: React.FC = () => {
    const { t } = useTranslation('events');
    
    return (
        <MainLayout
            title="Events – Voxly"
            description={t('text')}
            className={css.root}
        >
            <Menu />
            <Header fixed />
            
            <div className={css.hero}>
                <div className="container">
                    <span className={css.suptitle}>{t('suptitle')}</span>
                    <h1 className={css.title}>{t('title')}</h1>
                    <p className={css.text}>{t('text')}</p>
                </div>
            </div>

            <section className={css.schedule}>
                <div className="container">
                    <div className={css.scheduleHeader}>
                        <h2 className={css.scheduleTitle}>
                            <span>{t('eventSchedule')}</span>
                        </h2>
                    </div>

                    <div className={css.comingSoon}>
                        <div className={css.comingSoonIcon}>📅</div>
                        <h3 className={css.comingSoonTitle}>{t('comingSoon')}</h3>
                        <p className={css.comingSoonSubtitle}>{t('comingSoonSubtitle')}</p>
                    </div>

                    <div className={css.eventsGrid}>
                        {upcomingEvents.map((event) => (
                            <div key={event.id} className={css.eventCard}>
                                <div className={css.eventType}>
                                    {t(`eventTypes.${event.type}`)}
                                </div>
                                <h3 className={css.eventTitle}>{event.title}</h3>
                                <div className={css.eventDetails}>
                                    <div className={css.eventDetail}>
                                        <span className={css.detailLabel}>{t('location')}</span>
                                        <span className={css.detailValue}>{t(`locations.${event.location.toLowerCase().replace(' ', '')}`)}</span>
                                    </div>
                                    <div className={css.eventDetail}>
                                        <span className={css.detailLabel}>{t('month')}</span>
                                        <span className={css.detailValue}>{event.month}</span>
                                    </div>
                                </div>
                                <div className={css.eventFooter}>
                                    <div className={css.price}>
                                        {event.isFree ? (
                                            <span className={css.free}>{t('freeEvent')}</span>
                                        ) : (
                                            <span className={css.priceValue}>${event.price}</span>
                                        )}
                                    </div>
                                    <button className={css.bookButton}>
                                        {t('registerNow')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </MainLayout>
    );
}

export default Events;

export const getServerSideProps: GetServerSideProps = withTranslation(
    async () => {
        return {
            props: {}
        };
    },
    ['events']
);
