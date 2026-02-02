'use client';

import { useState } from 'react';
import { updateSiteSetting } from '@/lib/db';
import styles from './Editor.module.css';

interface SettingsEditorProps {
    settings: Record<string, any>;
    onUpdate: () => void;
}

export default function SettingsEditor({ settings, onUpdate }: SettingsEditorProps) {
    const [sectionsOrder, setSectionsOrder] = useState<string[]>(
        settings.sections_order || ['hero', 'about', 'skills', 'experience', 'projects', 'education', 'contact']
    );
    const [saving, setSaving] = useState(false);

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const newOrder = [...sectionsOrder];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newOrder.length) return;

        [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
        setSectionsOrder(newOrder);
    };

    const handleSave = async () => {
        setSaving(true);
        await updateSiteSetting('sections_order', sectionsOrder, 'json');
        onUpdate();
        setSaving(false);
    };

    return (
        <div className={styles.editor}>
            <div className={styles.editorHeader}>
                <h2>Site Settings</h2>
                <p>Configure global site behavior and section ordering</p>
            </div>

            <div className={styles.formGroup}>
                <label className="label">Section Ordering (Drag & Drop replacement)</label>
                <p className={styles.helpText}>Adjust the order in which sections appear on your homepage</p>

                <div className={styles.itemsList}>
                    {sectionsOrder.map((section, index) => (
                        <div key={section} className={styles.itemCard} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{section}</span>
                            </div>
                            <div className={styles.itemActions}>
                                <button
                                    type="button"
                                    onClick={() => moveSection(index, 'up')}
                                    disabled={index === 0}
                                    className={styles.iconButton}
                                >
                                    ↑
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveSection(index, 'down')}
                                    disabled={index === sectionsOrder.length - 1}
                                    className={styles.iconButton}
                                >
                                    ↓
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.formActions} style={{ marginTop: '2rem' }}>
                <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Site Settings'}
                </button>
            </div>
        </div>
    );
}
