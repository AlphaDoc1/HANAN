'use client';

import { useState } from 'react';
import { updateProfile } from '@/lib/db';
import { uploadFile, deleteFile, STORAGE_BUCKETS } from '@/lib/supabase';
import styles from './Editor.module.css';
import ImageUploader from './ImageUploader';

interface ProfileEditorProps {
    profile: any;
    onUpdate: () => void;
}

export default function ProfileEditor({ profile: initialProfile, onUpdate }: ProfileEditorProps) {
    const [profile, setProfile] = useState(initialProfile || {});
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const fileName = `profile-${Date.now()}.${file.name.split('.').pop()}`;

        // Upload new image
        const { url, error } = await uploadFile(STORAGE_BUCKETS.PROFILE_IMAGES, fileName, file);

        if (error) {
            setMessage('Failed to upload image');
            setUploading(false);
            return;
        }

        // Delete old image if exists
        if (profile.image_url) {
            const oldPath = profile.image_url.split('/').pop();
            if (oldPath) {
                await deleteFile(STORAGE_BUCKETS.PROFILE_IMAGES, oldPath);
            }
        }

        setProfile({ ...profile, image_url: url });
        setUploading(false);
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const fileName = `resume-${Date.now()}.pdf`;

        const { url, error } = await uploadFile(STORAGE_BUCKETS.RESUMES, fileName, file);

        if (error) {
            setMessage('Failed to upload resume');
            setUploading(false);
            return;
        }

        if (profile.resume_url) {
            const oldPath = profile.resume_url.split('/').pop();
            if (oldPath) {
                await deleteFile(STORAGE_BUCKETS.RESUMES, oldPath);
            }
        }

        setProfile({ ...profile, resume_url: url });
        setUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        const { error } = await updateProfile(profile);

        if (error) {
            setMessage('Failed to update profile');
        } else {
            setMessage('Profile updated successfully!');
            onUpdate();
        }

        setSaving(false);
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className={styles.editor}>
            <div className={styles.editorHeader}>
                <h2>Profile Settings</h2>
                <p>Manage your personal information and contact details</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className="label">Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={profile.name || ''}
                            onChange={handleChange}
                            required
                            className="input"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className="label">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={profile.title || ''}
                            onChange={handleChange}
                            className="input"
                            placeholder="e.g., Full Stack Developer"
                        />
                    </div>

                    <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                        <label className="label">Bio</label>
                        <textarea
                            name="bio"
                            value={profile.bio || ''}
                            onChange={handleChange}
                            className="textarea"
                            rows={4}
                            placeholder="Brief introduction about yourself..."
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className="label">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={profile.email || ''}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className="label">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={profile.phone || ''}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className="label">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={profile.location || ''}
                            onChange={handleChange}
                            className="input"
                            placeholder="City, Country"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className="label">Profile Image</label>
                        <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', background: 'var(--surface)' }}>
                            <ImageUploader
                                storageBucket={STORAGE_BUCKETS.PROFILE_IMAGES}
                                currentImageUrl={profile.image_url}
                                onSave={async (file, settings) => {
                                    setUploading(true);
                                    try {
                                        const fileName = `profile-${Date.now()}.jpg`;
                                        const { url, error } = await uploadFile(STORAGE_BUCKETS.PROFILE_IMAGES, fileName, file);

                                        if (error) throw error;

                                        // Delete old image if exists and not placeholder
                                        if (profile.image_url && !profile.image_url.includes('placehold.co')) {
                                            const oldPath = profile.image_url.split('/').pop();
                                            if (oldPath) {
                                                await deleteFile(STORAGE_BUCKETS.PROFILE_IMAGES, oldPath);
                                            }
                                        }

                                        setProfile(prev => ({ ...prev, image_url: url }));
                                    } catch (err: any) {
                                        console.error(err);
                                        setMessage('Failed to upload image: ' + err.message);
                                    } finally {
                                        setUploading(false);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className="label">Resume (PDF)</label>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleResumeUpload}
                            className={styles.fileInput}
                            disabled={uploading}
                        />
                        {profile.resume_url && (
                            <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className={styles.fileLink}>
                                View Current Resume
                            </a>
                        )}
                    </div>
                </div>

                {message && (
                    <div className={message.includes('success') ? styles.successMessage : styles.errorMessage}>
                        {message}
                    </div>
                )}

                <div className={styles.formActions}>
                    <button type="submit" disabled={saving || uploading} className="btn btn-primary">
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
