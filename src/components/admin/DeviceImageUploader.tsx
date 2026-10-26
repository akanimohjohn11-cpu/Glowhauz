/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FolderOpen,
  Image as ImageIcon,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Star,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Link as LinkIcon,
  Sparkles,
} from 'lucide-react';
import { uploadImageFromFile, ImageUploadResult } from '../../lib/imageUploader';

interface DeviceImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const PRESET_IMAGES = [
  { label: 'Radiance Serum (Amber Dropper)', url: '/src/assets/images/product_radiance_serum_1793008581412.jpg' },
  { label: 'Ceramide Moisture Creme (Jar)', url: '/src/assets/images/product_ceramide_cream_1793008582747.jpg' },
  { label: 'Clarifying Salicylic Cleanser (Green)', url: '/src/assets/images/product_salicylic_cleanser_1793008583027.jpg' },
  { label: 'Rosé Hydrating Mist (Spray)', url: '/src/assets/images/product_rose_essence_mist_1793008583530.jpg' },
];

export const DeviceImageUploader: React.FC<DeviceImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 10,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fallback URL input
  const [urlInput, setUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);

  const showTemporaryFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  // Process files selected from device
  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      showTemporaryFeedback('error', 'Please select valid image files (JPG, PNG, WebP, etc.).');
      return;
    }

    if (images.length + fileArray.length > maxImages) {
      showTemporaryFeedback('error', `You can upload up to ${maxImages} images per formulation.`);
      return;
    }

    setIsUploading(true);
    const newUploadedUrls: string[] = [];
    let count = 0;

    for (const file of fileArray) {
      count++;
      setUploadProgressText(`Uploading ${count} of ${fileArray.length}: ${file.name}...`);
      try {
        const result: ImageUploadResult = await uploadImageFromFile(file);
        if (result.success && result.url) {
          newUploadedUrls.push(result.url);
        } else {
          console.error(`Failed to upload ${file.name}:`, result.error);
        }
      } catch (err: any) {
        console.error('File upload exception:', err);
      }
    }

    setIsUploading(false);
    setUploadProgressText('');

    if (newUploadedUrls.length > 0) {
      onChange([...images, ...newUploadedUrls]);
      showTemporaryFeedback(
        'success',
        `Successfully added ${newUploadedUrls.length} image${newUploadedUrls.length > 1 ? 's' : ''} from your device!`
      );
    } else {
      showTemporaryFeedback('error', 'Could not process the selected image files. Please try again.');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Reordering & actions
  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const item = images[index];
    const filtered = images.filter((_, i) => i !== index);
    onChange([item, ...filtered]);
    showTemporaryFeedback('success', 'Set as primary photo! Click "Save Formulation" above to publish live.');
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;
    onChange(newImages);
    showTemporaryFeedback('success', 'Image order updated. Click "Save Formulation" to publish.');
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
    showTemporaryFeedback('success', 'Image removed. Click "Save Formulation" to update the live catalog.');
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    if (images.includes(urlInput.trim())) {
      showTemporaryFeedback('error', 'This image is already added.');
      return;
    }
    onChange([...images, urlInput.trim()]);
    setUrlInput('');
    showTemporaryFeedback('success', 'Image added! Click "Save Formulation" to publish.');
  };

  return (
    <div className="space-y-4">
      {/* Hidden native device file picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
          }
        }}
      />

      {/* Main Drag & Drop / Device Selection Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xs p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-[#34483B] bg-[#EDF1EC]'
            : 'border-[#D9D2C5] hover:border-[#34483B] bg-[#F8F5EF]/80 hover:bg-[#F8F5EF]'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#EAE4D7] flex items-center justify-center text-[#34483B] shadow-2xs">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : isDragging ? (
              <UploadCloud className="w-6 h-6 animate-bounce" />
            ) : (
              <FolderOpen className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-[#292B28]">
              {isUploading
                ? uploadProgressText || 'Uploading image from device...'
                : 'Click to choose photos from your device folder'}
            </p>
            <p className="text-xs text-[#666963]">
              or drag & drop your skincare product photos here
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#34483B] hover:bg-[#243329] text-white text-xs font-semibold rounded-xs shadow-xs transition-colors">
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Browse Device Folder</span>
            </span>
            <span className="text-[11px] text-[#8C9088]">
              Supports JPG, PNG, WEBP, GIF (multi-select)
            </span>
          </div>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-3 rounded-xs text-xs flex items-center gap-2 border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Gallery thumbnails grid */}
      {images.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-[#666963]">
            <span className="font-semibold text-[#292B28]">
              Formulation Gallery ({images.length} photo{images.length > 1 ? 's' : ''})
            </span>
            <span className="text-[11px]">
              First image is the <strong>Primary</strong> storefront picture
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((url, idx) => (
              <div
                key={idx}
                className="relative aspect-square border border-[#E6E0D5] rounded-xs overflow-hidden group bg-white shadow-2xs"
              >
                <img
                  src={url}
                  alt={`Product view ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Primary Badge */}
                {idx === 0 ? (
                  <span className="absolute top-1.5 left-1.5 bg-[#34483B] text-white text-[9px] px-2 py-0.5 rounded-2xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <span>Primary</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white text-[#292B28] text-[9px] px-2 py-0.5 rounded-2xs font-semibold shadow-xs"
                    title="Make this the primary hero photo"
                  >
                    Set Main
                  </button>
                )}

                {/* Controls overlay */}
                <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'left')}
                        className="p-1 bg-white/80 hover:bg-white text-[#292B28] rounded-2xs transition-colors"
                        title="Move left"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                    )}
                    {idx < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'right')}
                        className="p-1 bg-white/80 hover:bg-white text-[#292B28] rounded-2xs transition-colors"
                        title="Move right"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-2xs transition-colors"
                    title="Delete photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alternative options toggle */}
      <div className="pt-2 border-t border-[#E6E0D5]/70 flex flex-wrap items-center justify-between gap-2 text-xs">
        <button
          type="button"
          onClick={() => setShowUrlField(!showUrlField)}
          className="inline-flex items-center gap-1 text-[#666963] hover:text-[#34483B] font-medium transition-colors"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>{showUrlField ? 'Hide URL input' : 'Or paste an Image URL'}</span>
        </button>

        {/* Quick Pick High-End Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-[#8C9088] font-semibold uppercase">Quick Pick:</span>
          {PRESET_IMAGES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (!images.includes(preset.url)) {
                  onChange([...images, preset.url]);
                  showTemporaryFeedback('success', `Added ${preset.label}`);
                }
              }}
              className="text-[10px] px-2 py-0.5 bg-[#F8F5EF] hover:bg-[#EDF1EC] border border-[#E6E0D5] rounded-xs text-[#34483B]"
            >
              + {preset.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Expandable URL Input Field */}
      {showUrlField && (
        <div className="flex items-center gap-2 p-3 bg-[#F8F5EF] rounded-xs border border-[#E6E0D5]">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/... or /src/assets/images/..."
            className="flex-1 text-xs p-2 bg-white border border-[#E6E0D5] rounded-xs focus:outline-hidden"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-2 bg-[#34483B] hover:bg-[#243329] text-white text-xs font-semibold rounded-xs shadow-xs transition-colors"
          >
            Add URL
          </button>
        </div>
      )}
    </div>
  );
};
