'use client';

import { useState } from 'react';
import { addCertification, updateCertification, deleteCertification } from '@/lib/db';
import { uploadFile, deleteFile, STORAGE_BUCKETS } from '@/lib/supabase';
import styles from './Editor.module.css';
import ImageUploader from './ImageUploader';

interface CertificationsEditorProps {
    certifications: any[];
    onUpdate: () => void;
}

export default function CertificationsEditor({ certifications = [], onUpdate }: CertificationsEditorProps) {
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        institution: '',
        issuer: '',
        date: '',
        url: '',
        image_url: '',
        is_visible: true
    });

    const handleAdd = () => {
        setEditingItem(null);
        setFormData({
            name: '',
            institution: '',
            issuer: '',
            date: '',
            url: '',
            image_url: '',
            is_visible: true
        });
        setShowModal(true);
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setFormData(item);
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await updateCertification(editingItem.id, formData);
            } else {
                await addCertification({ ...formData, order_index: certifications.length });
            }
            setShowModal(false);
            onUpdate();
        } catch (error) {
            console.error(error);
            alert('Failed to save certification');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this certification?')) {
            const cert = certifications.find(c => c.id === id);
            if (cert?.image_url) {
                const path = cert.image_url.split('/').pop();
                if (path) await deleteFile(STORAGE_BUCKETS.PROJECT_IMAGES, path); // Re-use project bucket or create new
            }
            await deleteCertification(id);
            onUpdate();
        }
    };

    return (
        <div className={styles.editor}>
            <div className={styles.editorHeader}>
                <h2>Certifications</h2>
                <button onClick={handleAdd} className="btn btn-primary">+ Add Certification</button>
            </div>

            <div className={styles.itemsList} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {(certifications || []).map((item) => (
                    <div key={item.id} className={styles.itemCard}>
                        {item.image_url && (
                            <div style={{ height: '140px', overflow: 'hidden', borderRadius: '8px', marginBottom: '1rem' }}>
                                <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}
                        <h4 className={styles.itemTitle}>{item.name}</h4>
                        <p className={styles.itemMeta}>{item.institution} • {item.date}</p>
                        <div className={styles.itemActions}>
                            <button onClick={() => handleEdit(item)} className={styles.iconButton}>✏️</button>
                            <button onClick={() => handleDelete(item.id)} className={styles.iconButton}>🗑️</button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className={styles.modal} onClick={() => setShowModal(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h3>{editingItem ? 'Edit Certification' : 'Add Certification'}</h3>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label className="label">Name</label>
                                <input className="input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className="label">Institution / Issuer</label>
                                <input className="input" value={formData.institution} onChange={e => setFormData({ ...formData, institution: e.target.value })} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className="label">Date (YYYY-MM-DD)</label>
                                <input type="date" className="input" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className="label">Credential URL (Optional)</label>
                                <input type="url" className="input" value={formData.url || ''} onChange={e => setFormData({ ...formData, url: e.target.value })} />
                            </div>

                            <div className={styles.formGroup}>
                                <label className="label">Certificate Image</label>
                                <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', background: 'var(--surface)' }}>
                                    <ImageUploader
                                        storageBucket={STORAGE_BUCKETS.PROJECT_IMAGES} // Re-using bucket for simplicity
                                        currentImageUrl={formData.image_url}
                                        onSave={async (file, settings) => {
                                            setUploading(true);
                                            try {
                                                const fileName = `cert-${Date.now()}.jpg`;
                                                const { url, error } = await uploadFile(STORAGE_BUCKETS.PROJECT_IMAGES, fileName, file);
                                                if (error) throw error;
                                                setFormData(prev => ({ ...prev, image_url: url || '' }));
                                            } catch (e: any) {
                                                alert(e.message);
                                            } finally {
                                                setUploading(false);
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div className={styles.formActions}>
                                <button type="submit" className="btn btn-primary" disabled={uploading}>Save</button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
