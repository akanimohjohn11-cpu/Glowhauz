import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { db } from '../../lib/storage';
import { Collection } from '../../types';
import { Plus, Edit2, Trash2, CheckCircle2, FolderOpen, Loader2 } from 'lucide-react';
import { uploadImageFromFile } from '../../lib/imageUploader';

export const AdminCollectionsPage: React.FC = () => {
  const { collections, refreshStore } = useStore();
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const startCreate = () => {
    setName('');
    setSlug('');
    setTagline('');
    setDescription('');
    setImageUrl('');
    setEditingCollection(null);
    setIsCreating(true);
  };

  const startEdit = (col: Collection) => {
    setName(col.name);
    setSlug(col.slug);
    setTagline(col.tagline);
    setDescription(col.description);
    setImageUrl(col.imageUrl || '');
    setEditingCollection(col);
    setIsCreating(true);
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setEditingCollection(null);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCollection) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: Collection = {
      id: editingCollection?.id || `col-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      tagline: tagline.trim(),
      description: description.trim(),
      imageUrl: imageUrl.trim() || undefined,
    };

    db.saveCollection(payload);
    refreshStore();
    setNotice(`Saved collection "${payload.name}".`);
    setTimeout(() => setNotice(null), 3000);
    cancelEdit();
  };

  const handleDelete = (id: string, colName: string) => {
    if (window.confirm(`Delete collection "${colName}"?`)) {
      db.deleteCollection(id);
      refreshStore();
      setNotice(`Deleted collection "${colName}".`);
      setTimeout(() => setNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#292B28]">
            Curated Rituals & Collections ({collections.length})
          </h1>
          <p className="text-xs text-[#666963]">
            Group complementary products into branded multi-step daily routines.
          </p>
        </div>

        {!isCreating && (
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-1.5 bg-[#34483B] hover:bg-[#243329] text-white px-4 py-2 rounded-xs text-xs font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Ritual</span>
          </button>
        )}
      </div>

      {notice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xs text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Form */}
      {isCreating && (
        <div className="bg-white border border-[#E6E0D5] p-6 rounded-xs shadow-2xs space-y-4">
          <h2 className="font-serif text-lg font-semibold text-[#292B28] border-b border-[#E6E0D5] pb-2">
            {editingCollection ? `Edit Collection: ${editingCollection.name}` : 'New Collection / Ritual'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#292B28] mb-1">
                  Collection Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Everyday Radiance Ritual"
                  className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292B28] mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. everyday-radiance-ritual"
                  className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                Tagline / Subheading
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Brightening & Antioxidant Protection"
                className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Routine explanation and skin goals..."
                className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                Collection Cover Image (Optional)
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {imageUrl && (
                  <div className="relative w-12 h-12 rounded-xs overflow-hidden border border-[#E6E0D5]">
                    <img src={imageUrl} alt="Collection Cover" className="w-full h-full object-cover" />
                  </div>
                )}
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F5EF] hover:bg-[#EDF1EC] text-[#34483B] border border-[#E6E0D5] rounded-xs text-xs font-semibold transition-colors">
                  {uploadingImage ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FolderOpen className="w-3.5 h-3.5" />
                  )}
                  <span>{uploadingImage ? 'Uploading from device...' : 'Choose from Device Folder'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingImage}
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadingImage(true);
                        const res = await uploadImageFromFile(e.target.files[0]);
                        if (res.success && res.url) {
                          setImageUrl(res.url);
                        }
                        setUploadingImage(false);
                      }
                    }}
                  />
                </label>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="text-xs text-rose-600 hover:text-rose-800 underline font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-3.5 py-2 bg-white border border-[#E6E0D5] text-[#292B28] text-xs font-semibold rounded-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#34483B] hover:bg-[#243329] text-white text-xs font-semibold rounded-xs"
              >
                Save Collection
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="bg-white border border-[#E6E0D5] rounded-xs overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8F5EF] border-b border-[#E6E0D5] text-[#666963] uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Tagline</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6E0D5]">
            {collections.map((col) => (
              <tr key={col.id} className="hover:bg-[#F8F5EF]/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-[#292B28]">{col.name}</td>
                <td className="py-3 px-4 text-[#34483B] font-medium">{col.tagline}</td>
                <td className="py-3 px-4 font-mono text-[11px] text-[#666963]">{col.slug}</td>
                <td className="py-3 px-4 text-[#666963] max-w-sm truncate">{col.description}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => startEdit(col)}
                      className="p-1.5 text-[#666963] hover:text-[#34483B]"
                      title="Edit collection"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(col.id, col.name)}
                      className="p-1.5 text-[#666963] hover:text-rose-700"
                      title="Delete collection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
