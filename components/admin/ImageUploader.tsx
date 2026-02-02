'use client';

import { useState, useRef, useEffect } from 'react';
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
    convertToPixelCrop
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'; // Import styles

interface ImageUploaderProps {
    currentImageUrl?: string;
    onSave: (file: File, displaySettings: ImageDisplaySettings) => Promise<void>;
    storageBucket: string;
}

export interface ImageDisplaySettings {
    objectFit: 'cover' | 'contain';
}

// Helper to center the crop initially
function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

export default function ImageUploader({ currentImageUrl, onSave }: ImageUploaderProps) {
    const [imgSrc, setImgSrc] = useState('');
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [aspect, setAspect] = useState<number | undefined>(undefined); // undefined = Free crop
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'view' | 'edit'>('view');
    const imgRef = useRef<HTMLImageElement>(null);
    const [objectFit, setObjectFit] = useState<'cover' | 'contain'>('cover');

    // Load current image if available
    useEffect(() => {
        if (currentImageUrl && !imgSrc) {
            // We don't setImgSrc here because we want the "edit" mode to start fresh with a file select usually,
            // or we could let them edit the existing one if we proxy it?
            // CROPPING an existing URL image usually requires CORS configuration or proxying.
            // For now, simpler workflow: View Current -> Upload & Crop New.
        }
    }, [currentImageUrl]);

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined); // Reset crop
            const reader = new FileReader();
            reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
            reader.readAsDataURL(e.target.files[0]);
            setMode('edit');
        }
    };

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        // Default to free crop covering whole image? Or no crop?
        // Let's set a default crop of the whole image
        setCrop({
            unit: '%',
            width: 100,
            height: 100,
            x: 0,
            y: 0
        });
        setCompletedCrop({
            unit: 'px',
            width: width,
            height: height,
            x: 0,
            y: 0
        });
    }

    const handleSave = async () => {
        setLoading(true);
        try {
            let fileToUpload: File;

            if (completedCrop && imgRef.current) {
                // Generate cropped image
                const blob = await getCroppedImg(imgRef.current, completedCrop);
                if (!blob) throw new Error('Failed to create image blob');
                fileToUpload = new File([blob], `image-${Date.now()}.jpg`, { type: 'image/jpeg' });
            } else {
                // Fallback? Should not happen if image is loaded
                throw new Error('No image to save');
            }

            await onSave(fileToUpload, { objectFit });
            setMode('view');
            setImgSrc(''); // Clear editor
        } catch (e: any) {
            console.error(e);
            alert('Error saving image: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setMode('view');
        setImgSrc('');
    };

    // Aspect Ratio Controls
    const setAspectRatio = (ratio: number | undefined) => {
        setAspect(ratio);
        if (imgRef.current) {
            if (ratio) {
                const c = centerAspectCrop(imgRef.current.width, imgRef.current.height, ratio);
                setCrop(c);
                setCompletedCrop(convertToPixelCrop(c, imgRef.current.width, imgRef.current.height));
            } else {
                // Reset to full if free
                setCrop({ unit: '%', width: 100, height: 100, x: 0, y: 0 });
            }
        }
    }

    return (
        <div className="image-uploader-wrapper">
            {/* VIEW MODE */}
            {mode === 'view' && (
                <div className="view-mode">
                    {currentImageUrl ? (
                        <div className="current-preview" style={{ marginBottom: '1rem' }}>
                            <img
                                src={currentImageUrl}
                                alt="Current"
                                style={{
                                    width: '100%',
                                    maxHeight: '300px',
                                    objectFit: 'contain', // Show full image in admin
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    background: '#f0f0f0'
                                }}
                            />
                        </div>
                    ) : (
                        <div className="placeholder" style={{
                            padding: '2rem',
                            textAlign: 'center',
                            background: 'var(--surface-alt)',
                            borderRadius: '8px',
                            color: 'var(--text-muted)',
                            marginBottom: '1rem'
                        }}>
                            No image set
                        </div>
                    )}

                    <label className="btn btn-outline" style={{ display: 'inline-block', width: '100%', textAlign: 'center', cursor: 'pointer' }}>
                        {currentImageUrl ? 'Replace Image' : 'Upload Image'}
                        <input type="file" accept="image/*" onChange={onSelectFile} hidden />
                    </label>
                </div>
            )}

            {/* EDIT MODE */}
            {mode === 'edit' && imgSrc && (
                <div className="edit-mode" style={{ background: '#2a2a2a', padding: '1rem', borderRadius: '8px', color: 'white' }}>

                    {/* Toolbar */}
                    <div className="toolbar" style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button type="button" onClick={() => setAspectRatio(undefined)} className={`btn-xs ${!aspect ? 'active' : ''}`} style={btnStyle(!aspect)}>Free</button>
                        <button type="button" onClick={() => setAspectRatio(1)} className={`btn-xs ${aspect === 1 ? 'active' : ''}`} style={btnStyle(aspect === 1)}>Square (1:1)</button>
                        <button type="button" onClick={() => setAspectRatio(16 / 9)} className={`btn-xs ${aspect === 16 / 9 ? 'active' : ''}`} style={btnStyle(aspect === 16 / 9)}>Landscape (16:9)</button>
                        <button type="button" onClick={() => setAspectRatio(4 / 5)} className={`btn-xs ${aspect === 4 / 5 ? 'active' : ''}`} style={btnStyle(aspect === 4 / 5)}>Portrait (4:5)</button>
                    </div>

                    <div className="crop-area" style={{ background: '#111', borderRadius: '4px', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspect}
                            style={{ maxHeight: '500px' }}
                        >
                            <img ref={imgRef} alt="Crop me" src={imgSrc} onLoad={onImageLoad} style={{ maxHeight: '500px', maxWidth: '100%' }} />
                        </ReactCrop>
                    </div>

                    <div className="footer-controls" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.8rem' }}>Display:</span>
                            <select
                                value={objectFit}
                                onChange={(e) => setObjectFit(e.target.value as any)}
                                style={{ padding: '0.25rem', borderRadius: '4px', fontSize: '0.8rem' }}
                            >
                                <option value="cover">Cover (Fill)</option>
                                <option value="contain">Contain (Fit)</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={handleCancel} className="btn btn-ghost" style={{ color: 'white' }}>Cancel</button>
                            <button onClick={handleSave} disabled={loading} className="btn btn-primary">
                                {loading ? 'Uploading...' : 'Done & Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const btnStyle = (isActive: boolean) => ({
    padding: '0.25rem 0.75rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    cursor: 'pointer',
    border: 'none',
    background: isActive ? 'var(--electric)' : '#444',
    color: 'white',
});

// Canvas Cropping Helper
async function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): Promise<Blob | null> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Use natural dimensions to ensure quality (not displayed dimensions)
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY,
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, 'image/jpeg', 0.95); // High quality JPG
    });
}
