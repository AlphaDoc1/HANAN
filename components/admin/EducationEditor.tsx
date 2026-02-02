'use client';

import { useState } from 'react';
import { addEducation, updateEducation, deleteEducation } from '@/lib/db';
import styles from './Editor.module.css';

interface EducationEditorProps {
    education: any[];
    onUpdate: () => void;
}

export default function EducationEditor({ education, onUpdate }: EducationEditorProps) {
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState({
        institution: '',
        degree: '',
        field_of_study: '',
        location: '',
        start_date: '',
        end_date: '',
        grade: '',
        description: '',
        is_visible: true
    });

    const handleAdd = () => {
        setEditingItem(null);
        setFormData({
            institution: '',
            degree: '',
            field_of_study: '',
            location: '',
            start_date: '',
            end_date: '',
            grade: '',
            description: '',
            is_visible: true
        });
        setShowModal(true);
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setFormData({
            ...item,
            start_date: item.start_date || '',
            end_date: item.end_date || ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            await updateEducation(editingItem.id, formData);
        } else {
            await addEducation({ ...formData, order_index: education.length });
        }
        setShowModal(false);
        onUpdate();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this education entry?')) {
            await deleteEducation(id);
            onUpdate();
        }
    };

    return (
        <div className={styles.editor}>
            <div className={styles.editorHeader}>
                <h2>Education Management</h2>
                <p>Manage your academic background and certificates</p>
            </div>

            <button onClick={handleAdd} className="btn btn-primary addButton">
                + Add Education
            </button>

            <div className={styles.itemsList}>
                {education.map((item) => (
                    <div key={item.id} className={styles.itemCard}>
                        <div className={styles.itemHeader}>
                            <div>
                                <h4 className={styles.itemTitle}>{item.degree}</h4>
                                <p className={styles.itemSubtitle}>{item.institution}</p>
                                <p className={styles.itemMeta}>
                                    {new Date(item.start_date).getFullYear()} - {item.end_date ? new Date(item.end_date).getFullYear() : 'Present'}
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
                            <h3>{editingItem ? 'Edit Education' : 'Add Education'}</h3>
                            <button onClick={() => setShowModal(false)} className={styles.closeButton}>×</button>
                        </div>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label className="label">Institution *</label>
                                <input
                                    type="text"
                                    value={formData.institution}
                                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                    required
                                    className="input"
                                />
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className="label">Degree *</label>
                                    <input
                                        type="text"
                                        value={formData.degree}
                                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                                        required
                                        className="input"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className="label">Field of Study</label>
                                    <input
                                        type="text"
                                        value={formData.field_of_study}
                                        onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                                        className="input"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGrid}>
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
                                    <label className="label">End Date</label>
                                    <input
                                        type="date"
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                        className="input"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className="label">Grade / GPA</label>
                                <input
                                    type="text"
                                    value={formData.grade}
                                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                    className="input"
                                    placeholder="e.g., 3.8/4.0"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className="label">Description / Achievements</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="textarea"
                                    rows={3}
                                />
                            </div>

                            <div className={styles.formActions}>
                                <button type="submit" className="btn btn-primary">Save Education</button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
