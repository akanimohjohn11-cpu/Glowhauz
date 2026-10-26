import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { db } from '../../lib/storage';
import { Category } from '../../types';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, FolderOpen, Loader2 } from 'lucide-react';
import { uploadImageFromFile } from '../../lib/imageUploader';

export const AdminCategoriesPage: React.FC = () => {
  const { categories, refreshStore } = useStore();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const startCreate = () => {
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl('');
    setEditingCategory(null);
    setIsCreating(true);
  };

  const startEdit = (cat: Category) => {
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setImageUrl(cat.imageUrl || '');
    setEditingCategory(cat);
    setIsCreating(true);
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setEditingCategory(null);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
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

    const payload: Category = {
      id: editingCategory?.id || `cat-${Date.now()}`,
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: description.trim(),
      imageUrl: imageUrl.trim() || undefined,
    };

    db.saveCategory(payload);
    refreshStore();
    setNotice(`Saved category "${payload.name}".`);
    setTimeout(() => setNotice(null), 3000);
    cancelEdit();
  };

  const handleDelete = (id: string, catName: string) => {
    if (window.confirm(`Delete category "${catName}"?`)) {
      db.deleteCategory(id);
      refreshStore();
      setNotice(`Deleted category "${catName}".`);
      setTimeout(() => setNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#292B28]">
            Categories ({categories.length})
          </h1>
          <p className="text-xs text-[#666963]">
            Organize catalog products into customer-facing skincare taxonomy.
          </p>
        </div>

        {!isCreating && (
          <button
            onClick={startCreate}
            className="inline-flex items-center gap-1.5 bg-[#34483B] hover:bg-[#243329] text-white px-4 py-2 rounded-xs text-xs font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        )}
      </div>

      {notice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xs text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Category Create/Edit Form */}
      {isCreating && (
        <div className="bg-white border border-[#E6E0D5] p-6 rounded-xs shadow-2xs space-y-4">
          <h2 className="font-serif text-lg font-semibold text-[#292B28] border-b border-[#E6E0D5] pb-2">
            {editingCategory ? `Edit Category: ${editingCategory.name}` : 'New Category'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#292B28] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Serums & Treatments"
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
                  placeholder="e.g. serums-treatments"
                  className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief category summary for editorial and SEO..."
                className="w-full text-xs p-2.5 bg-[#F8F5EF]/60 border border-[#E6E0D5] rounded-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292B28] mb-1">
                Category Banner Image (Optional)
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {imageUrl && (
                  <div className="relative w-12 h-12 rounded-xs overflow-hidden border border-[#E6E0D5]">
                    <img src={imageUrl} alt="Category Banner" className="w-full h-full object-cover" />
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
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white border border-[#E6E0D5] rounded-xs overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F8F5EF] border-b border-[#E6E0D5] text-[#666963] uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Category Name</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4 text-center">Products</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6E0D5]">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-[#F8F5EF]/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-[#292B28]">{c.name}</td>
                <td className="py-3 px-4 font-mono text-[11px] text-[#666963]">{c.slug}</td>
                <td className="py-3 px-4 text-[#666963] max-w-sm truncate">{c.description}</td>
                <td className="py-3 px-4 text-center font-bold tabular-nums text-[#34483B]">
                  {c.productCount || 0}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => startEdit(c)}
                      className="p-1.5 text-[#666963] hover:text-[#34483B]"
                      title="Edit category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id, c.name)}
                      className="p-1.5 text-[#666963] hover:text-rose-700"
                      title="Delete category"
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
