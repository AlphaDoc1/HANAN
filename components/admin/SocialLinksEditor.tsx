'use client';

import { useState } from 'react';
import { addSocialLink, updateSocialLink, deleteSocialLink } from '@/lib/db';
import styles from './Editor.module.css';

export default function SocialLinksEditor({ socialLinks: initial, onUpdate }: any) {
    const [links, setLinks] = useState(initial || []);
    const [showModal, setShowModal] = useState(false);
    const [editingLink, setEditingLink] = useState<any>(null);
    const [formData, setFormData] = useState({ platform: '', url: '', icon_name: '', is_visible: true });

    const handleAdd = () => {
        setEditingLink(null);
        setFormData({ platform: '', url: '', icon_name: '', is_visible: true });
        setShowModal(true);
    };

    const handleEdit = (link: any) => {
        setEditingLink(link);
        setFormData(link);
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingLink) {
            await updateSocialLink(editingLink.id, formData);
        } else {
            await addSocialLink({ ...formData, order_index: links.length });
        }

        setShowModal(false);
        onUpdate();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this link?')) {
            await deleteSocialLink(id);
            onUpdate();
        }
    };

    return (
        <div className={styles.editor}>
            <div className={styles.editorHeader}>
                <h2>Social Links</h2>
                <p>Manage your social media and professional profiles</p>
            </div>

            <button onClick={handleAdd} className="btn btn-primary addButton">
                + Add Link
            </button>

            <div className={styles.itemsList}>
                {links.map((link: any) => (
                    <div key={link.id} className={styles.itemCard}>
                        <div className={styles.itemHeader}>
                            <div>
                                <h4 className={styles.itemTitle}>{link.platform}</h4>
                                <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem', color: 'var(--accent)' }}>
                                    {link.url}
                                </a>
                            </div>
                            <div className={styles.itemActions}>
                                <button onClick={() => handleEdit(link)} className={styles.iconButton}>✏️</button>
                                <button onClick={() => handleDelete(link.id)} className={styles.iconButton}>🗑️</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className={styles.modal} onClick={() => setShowModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>{editingLink ? 'Edit Link' : 'Add Link'}</h3>
                            <button onClick={() => setShowModal(false)} className={styles.closeButton}>×</button>
                        </div>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label className="label">Platform *</label>
                                <input
                                    type="text"
                                    value={formData.platform}
                                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                    required
                                    className="input"
                                    placeholder="e.g., LinkedIn, GitHub"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className="label">URL *</label>
                                <input
                                    type="url"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    required
                                    className="input"
                                    placeholder="https://..."
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
