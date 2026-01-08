import React from 'react';
import { useDebouncedCallback } from 'use-debounce'
import { useTranslation } from 'next-i18next';
import { TaikoSelect } from 'shared/components/taiko-select';
import { Input } from 'shared/ui/input';
import Sprite from 'shared/ui/sprite';
import { useEcosystemFilters } from 'widgets/07-ecosystem-screens/provider';
import css from './controls.module.scss';
import { languages, popularLanguages } from 'shared/lib/i18n/languages';

const ALL = "ALL";

const types = [
    { name: "All Inroll Languages", value: ALL },
    ...popularLanguages.map((code) => {
        const lang = languages.find((l) => l.code === code);
        return { name: lang?.nativeName || lang?.name || code, value: code };
    }),
];

const opt2 = [
    { name: "All Languages Availble", value: ALL },
    ...popularLanguages.map((code) => {
        const lang = languages.find((l) => l.code === code);
        return { name: lang?.nativeName || lang?.name || code, value: code };
    }),
];


export const Controls: React.FC = () => {
    const { filters, setFilter } = useEcosystemFilters();
    const { t } = useTranslation('ecosystem');

    const onChangeSearch = useDebouncedCallback((v: string) => setFilter('search', v), 500)

    return (
        <section className={css.controls}>
            <div className="container">
                <div className={css.wrapper}>
                    <Input
                        className={{
                            root: css.search,
                            field: css.search_field,
                            input: css.search_input
                        }}
                        controls={
                            <Sprite.Default
                                className={css.search_icon}
                                icon="magnifier"
                            />
                        }
                        defaultValue={filters.search}
                        onKeyDown={ev => {
                            if (ev.key === 'Enter') {
                                setFilter('search', ev.currentTarget.value)
                            }
                        }}
                        onChange={(ev) => onChangeSearch(ev.currentTarget.value)}
                        placeholder={t('searchProjects')}
                    />

                    <div className={css.selects}>
                        <TaikoSelect
                            value={
                                filters.type
                                    ? { name: filters.type, value: filters.type }
                                    : types[1] // Set 'Mainnet' as the default selected option
                            }
                            onChange={(data) =>
                                setFilter(
                                    'type',
                                    data?.value === ALL
                                        ? null
                                        : data?.name || null
                                )
                            }
                            options={types}
                            variant="select"
                        />
                        <TaikoSelect
                            value={
                                filters.category
                                    ? { name: filters.category, value: filters.category }
                                    : opt2[0]
                            }
                            onChange={(data) => setFilter(
                                'category',
                                data?.value === ALL
                                    ? null
                                    : data?.value || null
                            )}
                            options={opt2}
                            variant="select"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}