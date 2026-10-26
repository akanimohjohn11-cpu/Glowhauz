import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useStore();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !settings.announcementActive || !settings.announcementText) {
    return null;
  }

  return (
    <div className="bg-[#34483B] text-[#F8F5EF] text-xs font-medium py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <p className="flex-1 text-center truncate tracking-wide">
          {settings.announcementText}
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="text-[#A7B5A0] hover:text-[#F8F5EF] p-0.5 rounded transition-colors shrink-0"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
