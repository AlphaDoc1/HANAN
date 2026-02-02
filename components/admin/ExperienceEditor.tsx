'use client';

import { useState } from 'react';
import { addExperience, updateExperience, deleteExperience } from '@/lib/db';
import styles from './Editor.module.css';

interface ExperienceEditorProps {
    experience: any[];
    onUpdate: () => void;
}

export default function ExperienceEditor({ experience, onUpdate }: ExperienceEditorProps) {
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState({
        company: '',
        position: '',
        location: '',
        start_date: '',
        end_date: '',
        description: '',
        achievements: [] as string[],
        technologies: [] as string[],
        is_visible: true
    });

    const handleAdd = () => {
        setEditingItem(null);
        setFormData({
            company: '',
            position: '',
            location: '',
            start_date: '',
            end_date: '',
            description: '',
            achievements: [],
            technologies: [],
            is_visible: true
        });
        setShowModal(true);
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setFormData({
            ...item,
            start_date: item.start_date || '',
            end_date: item.end_date || '',
            achievements: item.achievements || [],
            technologies: item.technologies || []
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            await updateExperience(editingItem.id, formData);
        } else {
            await addExperience(formData);
        }
        setShowModal(false);
        onUpdate();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this experience?')) {
            await deleteExperience(id);
            onUpdate();
        }
    };

    const handleAddAchievement = () => {
        setFormData({ ...formData, achievements: [...formData.achievements, ''] });
    };

    const handleUpdateAchievement = (index: number, value: string) => {
        const newAchievements = [...formData.achievements];
        newAchievements[index] = value;
        setFormData({ ...formData, achievements: newAchievements });
    };

    const handleRemoveAchievement = (index: number) => {
        setFormData({
            ...formData,
            achievements: formData.achievements.filter((_, i) => i !== index)
        });
    };

    return (
        <div className={styles.editor}>
            <div className={styles.editorHeader}>
                <h2>Experience Management</h2>
                <p>Manage your professional career history</p>
            </div>

            <button onClick={handleAdd} className="btn btn-primary addButton">
                + Add Experience
            </button>

            <div className={styles.itemsList}>
                {experience.map((item) => (
                    <div key={item.id} className={styles.itemCard}>
                        <div className={styles.itemHeader}>
                            <div>
                                <h4 className={styles.itemTitle}>{item.position}</h4>
                                <p className={styles.itemSubtitle}>{item.company} | {item.location}</p>
                                <p className={styles.itemMeta}>
                                    {new Date(item.start_date).toLocaleDateString()} - {item.end_date ? new Date(item.end_date).toLocaleDateString() : 'Present'}
                                </p>
                            </div>
                            <div className={styles.itemActions}>
                                <button onClick={() => handleEdit(item)} className={styles.iconButton}>✏️</button>
                                <button onClick={() => handleDelete(item.id)} className={styles.iconButton}>🗑️</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className={styles.modal} onClick={() => setShowModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>{editingItem ? 'Edit Experience' : 'Add Experience'}</h3>
                            <button onClick={() => setShowModal(false)} className={styles.closeButton}>×</button>
                        </div>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className="label">Company *</label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        required
                                        className="input"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className="label">Position *</label>
                                    <input
                                        type="text"
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        required
                                        className="input"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className="label">Location</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="input"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className="label">Start Date *</label>
                                    <input
                                        type="date"
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                        required
                                        className="input"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className="label">End Date (leave empty if current)</label>
                                    <input
                                        type="date"
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                        className="input"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className="label">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="textarea"
                                    rows={3}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className="label">Achievements</label>
                                {formData.achievements.map((achievement, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <input
                                            type="text"
                                            value={achievement}
                                            onChange={(e) => handleUpdateAchievement(index, e.target.value)}
                                            className="input"
                                            placeholder="Bullet point..."
                                        />
                                        <button type="button" onClick={() => handleRemoveAchievement(index)} className={styles.iconButton}>✕</button>
                                    </div>
                                ))}
                                <button type="button" onClick={handleAddAchievement} className="btn btn-secondary btn-sm" style={{ alignSelf: 'start' }}>
                                    + Add Point
                                </button>
                            </div>

                            <div className={styles.formActions}>
                                <button type="submit" className="btn btn-primary">Save</button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
