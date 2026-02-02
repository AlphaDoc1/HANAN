'use client';

import { useState } from 'react';
import { addSkill, updateSkill, deleteSkill } from '@/lib/db';
import styles from './Editor.module.css';

export default function SkillsEditor({ skills: initialSkills, onUpdate }: any) {
    const [skills, setSkills] = useState(initialSkills || []);
    const [showModal, setShowModal] = useState(false);
    const [editingSkill, setEditingSkill] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', category: '', proficiency_level: 3, is_visible: true });

    const handleAdd = () => {
        setEditingSkill(null);
        setFormData({ name: '', category: '', proficiency_level: 3, is_visible: true });
        setShowModal(true);
    };

    const handleEdit = (skill: any) => {
        setEditingSkill(skill);
        setFormData(skill);
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingSkill) {
            await updateSkill(editingSkill.id, formData);
        } else {
            await addSkill({ ...formData, order_index: skills.length });
        }

        setShowModal(false);
        onUpdate();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this skill?')) {
            await deleteSkill(id);
            onUpdate();
        }
    };

    const groupedSkills = skills.reduce((acc: any, skill: any) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
    }, {});

    return (
        <div className={styles.editor}>
            <div className={styles.editorHeader}>
                <h2>Skills Management</h2>
                <p>Add and organize your technical skills by category</p>
            </div>

            <button onClick={handleAdd} className="btn btn-primary addButton">
                + Add Skill
            </button>

            <div className={styles.itemsList}>
                {Object.entries(groupedSkills).map(([category, categorySkills]: any) => (
                    <div key={category} className={styles.itemCard}>
                        <h4>{category}</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                            {categorySkills.map((skill: any) => (
                                <div key={skill.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface)', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
                                    <span>{skill.name}</span>
                                    <button onClick={() => handleEdit(skill)} className={styles.iconButton} style={{ padding: '0.25rem 0.5rem' }}>✏️</button>
                                    <button onClick={() => handleDelete(skill.id)} className={styles.iconButton} style={{ padding: '0.25rem 0.5rem' }}>🗑️</button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className={styles.modal} onClick={() => setShowModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>{editingSkill ? 'Edit Skill' : 'Add Skill'}</h3>
                            <button onClick={() => setShowModal(false)} className={styles.closeButton}>×</button>
                        </div>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label className="label">Skill Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="input"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className="label">Category *</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                    className="input"
                                    placeholder="e.g., Frontend, Backend, Tools"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className="label">Proficiency (1-5)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={formData.proficiency_level}
                                    onChange={(e) => setFormData({ ...formData, proficiency_level: parseInt(e.target.value) })}
                                    className="input"
                                />
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
