'use client';

import { useState } from 'react';
import { addProject, updateProject, deleteProject } from '@/lib/db';
import { uploadFile, deleteFile, STORAGE_BUCKETS } from '@/lib/supabase';
import styles from './Editor.module.css';
import Image from 'next/image';
import ImageUploader from './ImageUploader';

interface ProjectsEditorProps {
    projects: any[];
    onUpdate: () => void;
}

export default function ProjectsEditor({ projects, onUpdate }: ProjectsEditorProps) {
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        long_description: '',
        tech_stack: [] as string[],
        image_url: '',
        demo_url: '',
        github_url: '',
        is_featured: false,
        is_visible: true
    });

    const handleAdd = () => {
        setEditingItem(null);
        setFormData({
            title: '',
            description: '',
            long_description: '',
            tech_stack: [],
            image_url: '',
            demo_url: '',
            github_url: '',
            is_featured: false,
            is_visible: true
        });
        setShowModal(true);
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setFormData({
            ...item,
            tech_stack: item.tech_stack || []
        });
        setShowModal(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const fileName = `project-${Date.now()}.${file.name.split('.').pop()}`;

        // Upload new image
        const { url, error } = await uploadFile(STORAGE_BUCKETS.PROJECT_IMAGES, fileName, file);

        if (error) {
            console.error('Upload Error Details:', error);
            alert(`Failed to upload image: ${error.message}`);
            setUploading(false);
            return;
        }

        // Delete old image if exists
        if (formData.image_url) {
            const oldPath = formData.image_url.split('/').pop();
            if (oldPath) {
                await deleteFile(STORAGE_BUCKETS.PROJECT_IMAGES, oldPath);
            }
        }

        setFormData({ ...formData, image_url: url || '' });
        setUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            await updateProject(editingItem.id, formData);
        } else {
            await addProject({ ...formData, order_index: projects.length });
        }
        setShowModal(false);
        onUpdate();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this project?')) {
            const project = projects.find(p => p.id === id);
            if (project?.image_url) {
                const path = project.image_url.split('/').pop();
                if (path) await deleteFile(STORAGE_BUCKETS.PROJECT_IMAGES, path);
            }
            await deleteProject(id);
            onUpdate();
        }
    };

    const handleTechStringChange = (value: string) => {
        const techs = value.split(',').map(s => s.trim()).filter(s => s !== '');
        setFormData({ ...formData, tech_stack: techs });
    };

    return (
        <div className={styles.editor}>
            <div className={styles.editorHeader}>
                <h2>Projects Management</h2>
                <p>Showcase your best work and projects</p>
            </div>

            <button onClick={handleAdd} className="btn btn-primary addButton">
                + Add Project
            </button>

            <div className={styles.itemsList} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {projects.map((item) => (
                    <div key={item.id} className={styles.itemCard}>
                        {item.image_url && (
                            <div style={{ position: 'relative', height: '150px', marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
                                <Image
                                    src={item.image_url}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        )}
                        <div className={styles.itemHeader}>
                            <div>
                                <h4 className={styles.itemTitle}>{item.title}</h4>
                                <p className={styles.itemMeta}>{item.tech_stack?.slice(0, 3).join(', ')}</p>
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
                            <h3>{editingItem ? 'Edit Project' : 'Add Project'}</h3>
                            <button onClick={() => setShowModal(false)} className={styles.closeButton}>×</button>
                        </div>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label className="label">Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="input"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className="label">Description *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    className="textarea"
                                    rows={2}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className="label">Tech Stack (comma separated) *</label>
                                <input
                                    type="text"
                                    value={formData.tech_stack.join(', ')}
                                    onChange={(e) => handleTechStringChange(e.target.value)}
                                    placeholder="React, TypeScript, Supabase"
                                    className="input"
                                />
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className="label">Demo URL</label>
                                    <input
                                        type="url"
                                        value={formData.demo_url || ''}
                                        onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                                        className="input"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className="label">GitHub URL</label>
                                    <input
                                        type="url"
                                        value={formData.github_url || ''}
                                        onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                                        className="input"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className="label">Project Image</label>
                                <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', background: 'var(--surface)' }}>
                                    <ImageUploader
                                        storageBucket={STORAGE_BUCKETS.PROJECT_IMAGES}
                                        currentImageUrl={formData.image_url}
                                        onSave={async (file, settings) => {
                                            setUploading(true);
                                            try {
                                                const fileName = `project-${Date.now()}.jpg`;
                                                const { url, error } = await uploadFile(STORAGE_BUCKETS.PROJECT_IMAGES, fileName, file);

                                                if (error) throw error;

                                                // Clean up old image
                                                if (formData.image_url && !formData.image_url.includes('placehold.co')) {
                                                    const oldPath = formData.image_url.split('/').pop();
                                                    if (oldPath) await deleteFile(STORAGE_BUCKETS.PROJECT_IMAGES, oldPath);
                                                }

                                                setFormData(prev => ({ ...prev, image_url: url || '' }));
                                            } catch (err: any) {
                                                console.error(err);
                                                alert('Upload failed: ' + err.message);
                                            } finally {
                                                setUploading(false);
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup} style={{ flexDirection: 'row', gap: '0.5rem', alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    id="is_featured"
                                    checked={formData.is_featured}
                                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                />
                                <label htmlFor="is_featured" className="label" style={{ marginBottom: 0 }}>Featured Project</label>
                            </div>

                            <div className={styles.formActions}>
                                <button type="submit" className="btn btn-primary" disabled={uploading}>Save Project</button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
